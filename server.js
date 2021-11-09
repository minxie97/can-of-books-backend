'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./bookModel.js');

const app = express();
app.use(cors());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected')
});

const PORT = process.env.PORT || 3001;

app.get('/books', handleBooks)

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

app.listen(PORT, () => console.log(`listening on ${PORT}`));
