const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // references the user who created it
    },
    publishYear: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true, // default to available
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Books = mongoose.model('Books', booksSchema);

module.exports = Books;
