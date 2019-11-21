'use strict';


const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


app.get('/', newSearch);
app.post('/searches' , createSearch);
app.get('*', (req, res) => res.status(404).send('This route does not exist'));

function newSearch(req,res){
  res.render('pages/index');
}

function createSearch(req,res){
  console.log(req.body.search);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if(req.body.search[1] === 'title') {url += `intitle:${req.body.search[0]}`;}
  if(req.body.search[1] === 'author') {url += `inauthor:${req.body.search[0]}`;}

  superagent.get(url)
    //map over the info from superagent, inside the items array, and create a new Book object
    //from each result
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    //take that array of Book objects and pass it to the searches page when rendered
    .then(results => res.render('pages/searches', {searchResults:results}));
}
function Book(info){
  console.log(info.title);
  this.title = info.title || 'No title available';
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

