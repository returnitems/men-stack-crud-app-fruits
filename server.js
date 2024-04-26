const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require('mongoose');
const Fruit = require('./models/fruit.js');

const app = express();

app.use(express.urlencoded({extended:false}));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');
});

app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    const createdFruit = await Fruit.create(req.body);
    // res.send(createdFruit);
    res.redirect('/fruits');
});

app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find();
    res.render('fruits/index.ejs', {
        fruits: allFruits
    })
});

app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render('fruits/show.ejs', {
        clickedFruit: foundFruit
    });
});