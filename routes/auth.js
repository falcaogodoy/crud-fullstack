const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require('jsonwebtoken');
const requiresAuth = require('../middleware/permissions');




//@route GET /api/auth/test
//@desc test the auth route
//@acess Public

router.get("/test", (req, res) =>{
    res.send("Auth rota work");
});

//@route POST /api/auth/register
//@desc creat new user
//@acess Public

router.post("/register", async(req, res) =>{
    try{
        const {errors, isValid} = validateRegisterInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }



        // checando email existente
        const existingEmail = await User.findOne({
            
            email: new RegExp("^" + req.body.email + "$", "i")
        
        });

        if (existingEmail) {
            return res.status(400).json({error: ' Email ja registrado'})
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
       //criar usuario
        const newUser = new User({
            email: req.body.email,
            password:hashedPassword,
            name: req.body.name,
        });
        //salvando usuario

        const savedUser = await newUser.save();
        const userToReturn = { ...savedUser._doc };
        delete userToReturn.password;

        //retorno novo user
        return res.json(userToReturn);

    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
});

//@route POST /api/auth/login
//@desc acesso ao token de usuario e senha
//@acess Public

router.post("/login", async (req, res) =>{
    try{
        //verifica usuario
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        })
        if(!user) {
            return res.status(400).json({error: ' problema no seu login'});
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if(!passwordMatch){
            return res.status(400).json({error: ' problema no seu login'});
        }

        const payload = {userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("access-token", token,{
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, 
            secure: process.env.NODE_ENV === "prodction"
        } );

        const userToReturn = { ...user._doc};
        delete userToReturn.password;

        return res.json({
            token: token, 
            user: userToReturn,
        });

    }catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
});


//@route GET/api/auth/current
//@desc Retorna usuario autenticado
//@acess Private


router.get("/current", requiresAuth, (req, res)=> {
    if(!req.user) {
        return res.status(401).send(" Nao Autorizado");
    }

    return res.json(req.user);
});

//@route GET/api/auth/current
//@desc Logout
//@acess Private
router.put("/logout", requiresAuth, async (req, res) => {
    try{
        res.clearCookie("access-token");

        return res.json({success: true});


    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);

    }





});








module.exports = router;