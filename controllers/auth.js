const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

/* ============================
   USER SIGN UP
============================ */
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Username or Password is invalid');
    }

    // Validate password
    if (password !== confirmPassword) {
      return res.send('Username or Password is invalid');
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user (role defaults to "user")
    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'user'
    });

    // Save user to session
    req.session.user = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    req.session.save(() => res.redirect('/'));

  } catch (err) {
    console.error(err);
    res.send('Something went wrong with registration!');
  }
});

/* ============================
   USER SIGN IN
============================ */
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.send('Username or Password is invalid');

    // Check password
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.send('Username or Password is invalid');

    // Save user in session
    req.session.user = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    req.session.save(() => res.redirect('/'));
  } catch (err) {
    console.error(err);
    res.send('Something went wrong with Sign In');
  }
});

/* ============================
   USER SIGN OUT
============================ */
router.get('/sign-out', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

/* ============================
   ADMIN SIGN IN
============================ */
router.get('/admin/sign-in', (req, res) => {
  res.render('auth/admin-sign-in.ejs'); 
});

router.post('/admin/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await User.findOne({ username, role: 'admin' });
    if (!admin) return res.send('Invalid admin credentials');

    // Check password
    const valid = bcrypt.compareSync(password, admin.password);
    if (!valid) return res.send('Invalid admin credentials');

    // Save admin session
    req.session.user = {
      _id: admin._id,
      username: admin.username,
      role: admin.role,
    };

    req.session.save(() => res.redirect('/admin/dashboard'));

  } catch (err) {
    console.error(err);
    res.send('Something went wrong with Admin Sign In');
  }
});
// Admin login page
router.get('/admin/sign-in', (req, res) => {
  res.render('auth/admin-sign-in.ejs');
});

// Handle admin login
router.post('/admin/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = await User.findOne({ username, role: 'admin' });

    if (!adminUser) return res.send('Invalid admin credentials');

    const isValidPassword = bcrypt.compareSync(password, adminUser.password);
    if (!isValidPassword) return res.send('Invalid admin credentials');

    // Save session
    req.session.user = {
      _id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role
    };

    req.session.save(() => {
      res.redirect('/Books/new'); // go directly to Add New Book
    });

  } catch (error) {
    console.error(error);
    res.send('Something went wrong with Admin Sign In');
  }
});

module.exports = router;


module.exports = router;
