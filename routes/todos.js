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

        //criando link
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content,
            complete: false,
        })
        //salvando link
        await newToDo.save();
        return res.json(newToDo);

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }

});

//@route GET/api/todos/current
//@desc pega todos os usuarios
//@access Private


router.get("/current", requiresAuth, async (req, res) => {
    try {
      const completeToDos = await ToDo.find({
        user: req.user._id,
        complete: true,
      }).sort({ completedAt: -1 });
  
      const incompleteToDos = await ToDo.find({
        user: req.user._id,
        complete: false,
      }).sort({ createdAt: -1 });
  
      return res.json({ incomplete: incompleteToDos, complete: completeToDos });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  });

  
//@route GET/api/todos/:toDoId/complete
//@desc pega todos os links ja marcados
//@access Private

router.put("/:toDoId/complete", requiresAuth, async (req,res) =>{
    try {
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,

        });

        if(!toDo) {
            return res.status(404).json({error: " Link não pode ser Encontrado"});
        }
        if (toDo.complete) {
            return res.status(400).json({error: "Link ja foi vizualiado"});
        }

        const updatedToDo = await ToDo.findOneAndUpdate(
            {

                user: req.user._id,
                _id: req.params.toDoId,
            },
            {
                complete: true,
                completeAt: new Date(),
            },
            {
                new: true,
            }
        );

        return res.json(updatedToDo);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
});

//@route GET/api/todos/:toDoId/complete
//@desc pega todos os links incompletos
//@access Private


router.put("/:toDoid/incomplete", requiresAuth, async (req, res) =>{
    try {
        const toDo = await ToDo.findOne({
            user:req.user_id,
            _id:req.params.toDoid,
        });

        if(!toDo) {
            return res.status(404).json({error: " nao pode encontrar link"});
        }
        if(!toDo.complete) {
            return res.status(400).json({error: " link nao marcado"});
        }

        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.toDoid,
            },
            {
                complete: false,
                completedAt: null,
              },
              {
                new: true,
              }
        );

        return res.json(updatedToDo);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
});

//@route GET/api/todos/:toDoId
//@desc update link
//@access Private
router.put("/:toDoId", requiresAuth, async (req, res) => {
    try {
      const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId,
      });
  
      if (!toDo) {
        return res.status(404).json({ error: "Could not find ToDo" });
      }
  
      const { isValid, errors } = validateToDoInput(req.body);
  
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const updatedToDo = await ToDo.findOneAndUpdate(
        {
          user: req.user._id,
          _id: req.params.toDoId,
        },
        {
          content: req.body.content,
        },
        {
          new: true,
        }
      );
  
      return res.json(updatedToDo);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  });
  // @route   DELETE /api/todos/:toDoId
// @desc    Delete a Link
// @access  Private
router.delete("/:toDoId", requiresAuth, async (req, res) => {
    try {
      const toDo = await ToDo.findOne({
        user: req.user._id,
        _id: req.params.toDoId,
      });
  
      if (!toDo) {
        return res.status(404).json({ error: "Could not find ToDo" });
      }
  
      await ToDo.findOneAndRemove({
        user: req.user._id,
        _id: req.params.toDoId,
      });
  
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
  });





module.exports = router;