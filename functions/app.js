const express = require('express');
const app = express();
const morgan = require('morgan'); // logs all incoming requests to console, acts as a middleware
const bodyParser = require('body-parser');

const authRoutes = require('./api/auth/spotifyLogin');
const artistRoutes = require('./api/routes/artists');
const albumRoutes = require('./api/routes/albums');
const searchRoutes = require('./api/routes/search');
const playlistRoutes = require('./api/routes/playlist');
const trackRoutes = require('./api/routes/tracks');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorizaion'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// middleware which forwards to artistRoutes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/track', trackRoutes);

// middleware - routes that artistRoutes could not handle thus, send an error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// middleware - handles all errors we sent or ones that took place in our routes
app.use((error, req, res, next) => {
  // error.status is 404 the one we assigned or 500 for any other error
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
