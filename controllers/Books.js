const express = require('express');
const router = express.Router();

const Books = require('../models/Books');
const isSignedIn = require('../middleware/is-signed-in');
const adminOnly = require('../middleware/is-admin');



/* ============================
   ADMIN ONLY — CREATE / EDIT / DELETE
============================ */

// Show create form
router.get('/new', isSignedIn, adminOnly, (req, res) => {
  res.render('Books/new.ejs');
});

// Create book
router.post('/', isSignedIn, adminOnly, async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    req.body.isAvailable = req.body.isAvailable === 'true'; // convert to boolean
    await Books.create(req.body);
    res.redirect('/Books');
  } catch (error) {
    console.error(error);
    res.redirect('/Books/new');
  }
});

// Show edit form
router.get('/:id/edit', isSignedIn, adminOnly, async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    if (!book) return res.redirect('/Books');
    res.render('Books/edit.ejs', { book });
  } catch (error) {
    console.error(error);
    res.redirect('/Books');
  }
});

// Update book
router.put('/:id', isSignedIn, adminOnly, async (req, res) => {
  try {
    req.body.isAvailable = req.body.isAvailable === 'true';
    await Books.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/Books/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.redirect('/Books');
  }
});

// Delete book
router.delete('/:id', isSignedIn, adminOnly, async (req, res) => {
  try {
    await Books.findByIdAndDelete(req.params.id);
    res.redirect('/Books');
  } catch (error) {
    console.error(error);
    res.redirect('/Books');
  }
});


/* ============================
   PUBLIC — USERS CAN VIEW ONLY
============================ */

// Show all books
router.get('/', async (req, res) => {
  try {
    const books = await Books.find().populate('owner');
    res.render('Books/index.ejs', { books });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Show a single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Books.findById(req.params.id).populate('owner');
    if (!book) return res.redirect('/Books');
    res.render('Books/show.ejs', { book });
  } catch (error) {
    console.error(error);
    res.redirect('/Books');
  }
});

module.exports = router;
