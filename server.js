'use strict';


const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

client.connect();
client.on('error',err => console.error(err));



app.get('/', getBooks);
app.post('/searches', createSearch);
app.get('*', (req, res) => res.status(404).send('This route does not exist'));

// function getBooks(req, res) {
//   res.render('pages/index');
// }

function getBooks(req,res){
  let sql = 'SELECT * FROM books;';
  return client.query(sql)
    .then(response => {
      if(response.rowCount > 0){
        res.render('index', {allBooks: response.rows});
      }
    });
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
function Book(info) {
  console.log(info.title);
  this.title = info.title || 'No title available';
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

