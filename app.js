//ye express, mongoose, etc ko require karne ka block hai
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// database connection
connectDB();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/addUser', async (req, res) => { //this route is not working for some reason idk
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect('/userList');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/userList', async (req, res) => {
  try {
    const users = await User.find();
    res.render('userList', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/userList/:id', async (req, res) => {  //dynamic routes ke liye
  try {
    const user = await User.findById(req.params.id);
    res.render('userList', { users: [user] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/deleteUser/:id', async (req, res) => { //direct delete
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/userList');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//5000 port use kiya hu kyu ki mere system pe pehle se 3000 pe kuch orr chal raha tha

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
