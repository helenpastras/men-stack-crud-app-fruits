// ___________create schema
const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: String, 
    isReadyToEat: Boolean
});
const Fruit = mongoose.model("Fruit", fruitSchema);

// _________link schema
// ???


// ___________ export model
module.exports = Fruit;