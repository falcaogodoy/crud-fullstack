const express = require('express');
const router = express.Router();
const ToDo = require("../models/ToDo");
const requiresAuth = require("../middleware/permissions");
const validateToDoInput = require("../validation/toDoValidation");



//@route GET/api/todos/test
//@desc Test TodoRoute
//@access Public

router.get("/test", (req,res) =>{
    res.send("Todo's routa funcionando");
});


//@route POST/api/todos/new
//@desc Criando novo Todo
//@access Private

router.post("/new", requiresAuth, async (req,res)=>{

    try{
        const {isValid, errors} = validateToDoInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }

        //criando
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content,
            complete: false,
        })
        //salvando
        await newToDo.save();
        return res.json(newToDo);

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }

});

//@route GET/api/todos/current
//@desc current all
//@access Private


router.get("/current", requiresAuth, async (req, res)=>
{
    try{
        const completeToDos = await ToDo.find(
            {user: req.user._id,
             complete:true,}
            ).sort({completeAt: -1});

            const incompleteToDos = await ToDo.find({
                user: req.user._id,
                complete:false,
            }).sort({createdAt: -1});

            return res.json({incomplete:incompleteToDos, complete:completeToDos });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }




});


module.exports = router;