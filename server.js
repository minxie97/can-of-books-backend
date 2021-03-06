'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./bookModel.js');
const { response } = require('express');
const verifyUser = require('./auth.js');

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

app.get('/books', handleGetBooks)
app.post('/books', handlePostBooks)
app.delete('/books/:id', handleDeleteBooks)
app.put('/books/:id', handlePutBooks)
app.get('/user', getUser)

function handleGetBooks(req, res) {

  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('Invalid token');
    } else {
      try {
        let booksFromDB = await Book.find({ email: user.email });
        if (booksFromDB) {
          res.status(200).send(booksFromDB)
        } else {
          res.status(404).send('Books not found.');
        }
      } catch (e) {
        res.status(500).send('Server error.');
      }
    }
  }
  )
};

function handlePostBooks(req, res) {

  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('Invalid token');
    } else {
      const newBook = { ...req.body, email: user.email }
      try {
        let createNewBook = await Book.create(newBook);
        if (createNewBook) {
          res.status(201).send(createNewBook);
        } else {
          res.status(404).send('Books not found.');
        }
      } catch (e) {
        res.status(500).send('Server error. Book was not added.');
      }
    }
  }
  )
};

async function handleDeleteBooks(req, res) {

  const id = req.params.id;

  try {
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

function handlePutBooks(req, res) {

  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('Invalid token');
    } else {
      const id = req.params.id;
      const updatedData = { ...req.body, email: user.email }
      try {
        const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true, overwrite: true })
        console.log(updatedBook);
        if (updatedBook) {
          res.status(200).send(updatedBook)
        } else {
          res.status(404).send('No book was found.');
        }
      } catch (e) {
        res.status(500).send('Server error. Book was not updated.')
      }
    }
  }
  )
};

function getUser(req, res) {

  verifyUser(req, (err, user) => {
    if (err) {
      res.send('Invalid token');
    } else {
      res.send(user);
    }
  })
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
