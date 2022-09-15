const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require("../validation/registerValidation");




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

        // reorno novo user
        return res.json(savedUser);

    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
});


module.exports = router;