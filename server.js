'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./bookModel.js');
const { response } = require('express');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected')
});

const PORT = process.env.PORT || 3001;

app.get('/books', handleBooks)
app.post('/books', handlePostBooks)
app.delete('/books', handleDeleteBooks)

async function handleBooks(req, res) {
  let queryObj = {};
  if (req.query.email) {
    queryObj = {email: req.query.email}
  }

  try {
    let booksFromDB = await Book.find(queryObj);
    if (booksFromDB) {
      res.status(200).send(booksFromDB)
    } else {
      res.status(404).send('Books not found.');
    }
  } catch (e) {
    res.status(500).send('Server goofed');
  }
}

async function handlePostBooks(req, res) {
  
  try {
    let newBook = await Book.create(req.body);
    res.status(201).send(newBook);
  } catch (e) {
    res.status(500).send('Server error. Book was not added.');
  }
}

async function handleDeleteBooks(req, res) {

  const id = req.params.id;

  try{
    const deletedBook = await Book.findByIdAndDelete(id);
    if (deletedBook) {
      res.status(204).send('Book successfully deleted');
    } else {
      res.status(404).send('No book was found.');
    }
  } catch (e) {
    res.status(500).send('Server error. Book was not deleted.');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
