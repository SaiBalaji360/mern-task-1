// routes/auth.js

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../passport-config');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Server Error' });
      }
      const token = generateToken(user);
      return res.status(200).json({ token });
    });
  })(req, res, next);
});

module.exports = router;
