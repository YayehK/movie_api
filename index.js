const express = require('express'),
 morgan = require('morgan');

const app = express();

let topTenMovies = [
  {
    title: 'Don\'t Look up',
    director: 'Adam McKay'
  },
  {
    title: 'Spider-Man: No Way Home',
    director: 'John Watts'
  },
  {
    title: 'Encanto',
    director: 'Byron Howard'
  },
  {
    title: 'Harry Potter 20th Anniversary: Return to Hogwarts',
    director: 'Giorgio Testi'
  },
  {
    title: 'The Matrix Resurrections',
    director: 'Lana Wachowski'
  },
  {
    title: '...',
    director: '...'
  },
];

// log all requests to the terminal
app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie database!');
});

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

// serving static file
app.use(express.static('public'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oopss..Something went wrong!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});