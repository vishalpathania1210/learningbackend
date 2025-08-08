require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require("mongoose");
const Users = require('./models/Users');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.post('/signUp', async (req,res) => {

  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new Users({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});


app.post('/api/users',  async (req,res) => {

  try {
    const { name, email } = req.body;
    const user = new Users({ name, email })
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/users", async (req,res) => {
const users = await Users.find();
res.json(users);
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})
