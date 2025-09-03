//_____________ connections and imports_______________ 
const express = require('express');
const app = express();
const PORT = 3000
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
 const path = require("path");
// Environment Variables 
// these are variables that might change 
// based on the given environment 
// development vs production, your computer vs my computer 
// we can store them and access them in .env file
// this is also a good place to put any information we don't want public 
// API keys, session secrets 
// ALWAYS .gitignore your .env file 
// NOTE: .env is NOT a JavaScript File

// setup access to .env file
require('dotenv').config()
console.log(process.env)

// _____________db setup_______________
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection
db.on("connected", () => {console.log(`Connected to MongoDB ${mongoose.connection.name}.`);});
db.on("error", (err) => {console.log("Error: ", err)});
db.on("disconnected", () => {console.log("mongo disconnected")})

//import db model
const Fruit = require("./models/fruit.js");
app.use(express.urlencoded({extended: false}))

app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new
app.use(express.static(path.join(__dirname, "public")));


// _______________ routes___________
app.get("/", async (req, res) => {
    res.render("index.ejs")
});


app.get("/fruits", async (req,res) => {
    const allFruits =await Fruit.find();
    console.log(allFruits);
    res.render("fruits/index.ejs", {fruits: allFruits});
});


app.get("/fruits/new" , (req,res) => {
    res.render("fruits/new.ejs")
});


app.get("/fruits/:fruitId", async (req,res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", {fruit: foundFruit});
});

app.get("/fruits/:fruitId/edit", async (req,res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", {
    fruit: foundFruit,
    });
});

app.put("/fruits/:fruitId", async (req,res) => {
    if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body); // Update the fruit in the database
  res.redirect(`/fruits/${req.params.fruitId}`) // Redirect to the fruit's show page to see the updates
});


app.post("/fruits", async (req, res) => {
    if(req.body.isReadyToEat === "on"){
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body)
    console.log(req.body);
    res.redirect("/fruits")
})

app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
});


// _______________listeners________

app.listen(PORT, () =>{
    console.log('Listening on port 3000');
});

