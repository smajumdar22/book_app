'use strict';

const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

client.connect();
client.on('error', err => console.error(err));

app.get('/', getBooks);
app.get('/new', newSearch);
app.post('/searches', createSearch);
app.get('/add', (req, res) => {
  res.render('pages/add');
});
app.post('/add', addNewBook);
//app.get('/book/:book_id',getOneBook);
app.get('*', (req, res) => res.status(404).send('This route does not exist'));


function getBooks(req, res) {
  let sql = 'SELECT * FROM books;';
  return client.query(sql)
    .then(response => {
      if (response.rowCount > 0) {
        res.render('pages/index', { allBooks: response.rows });
      }
    });
}

function newSearch(req, res) {
  res.render('pages/new');
}

function createSearch(req, res) {
  console.log(req.body.search);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.search[1] === 'title') { url += `intitle:${req.body.search[0]}`; }
  if (req.body.search[1] === 'author') { url += `inauthor:${req.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => res.render('pages/searches/show.ejs', { searchResults: results }));
}

function addNewBook(req, res) {
  let r = req.body;
  let sql = 'INSERT INTO books(id, authors, title, isbn,image_url,description_book,bookshelf) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id';
  let values = [r.id, r.authors, r.title, r.isbn, r.image_url, r.description_book, r.bookshelf];
  client.query(sql, values)
    .then(result => {
      if (result.rowCount > 0) {
        res.redirect('/');
      }
    });
}

function Book(info) {
  console.log(info.title);
  this.title = info.title || 'No title available';
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

