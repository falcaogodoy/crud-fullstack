require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
/// imprort

const authRoute = require("./routes/auth");
const ToDosRoute = require("./routes/todos");


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/api", (req, res) => {
    res.send(" TESte /");
});
app.use("/api/auth", authRoute);
app.use("/api/todos", ToDosRoute);


mongoose.connect(process.env.MONGO_URL).then(() =>{
    console.log('Conectando ao DB');
    
    app.listen(process.env.PORT, () =>{
        console.log(` Server running on port ${process.env.PORT} `);
    });
})
.catch((error) =>{
    console.log(error);
});



/* 
app.post("/name", (req, res) => {
    if(req.body.name){
        return res.json({name: req.body.name});
    } else {
        return res.status(400).json({ erro: '  sem nome na base'});
    }
}); */



