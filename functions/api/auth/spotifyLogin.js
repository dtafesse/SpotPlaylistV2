const express = require('express');
const router = express.Router();

const querystring = require('querystring');

const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const client_id = keys.CLIENT_ID; // Your client id
const client_secret = keys.CLIENT_SECRET; // Your secret
const redirect_uri = keys.REDIRECT_URI;

let spotifyWebApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});

router.get('/login', (req, res) => {
  var scope =
    'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri
      })
  );
});

router.get('/callback', (req, res) => {
  // your application requests refresh and access tokens

  let authorizationCode = req.query.code;

  spotifyWebApi
    .authorizationCodeGrant(authorizationCode)
    .then(data => {
      let access_token = data.body['access_token'];
      let refresh_token = data.body['refresh_token'];
      let expires_in = data.body['expires_in'];
      let uri = keys.FRONT_END_URI_CALLBACK;
      return res.redirect(
        uri +
          '?' +
          querystring.stringify({
            access_token,
            refresh_token,
            expires_in
          })
      );
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/refresh_token', (req, res) => {
  let refresh_token;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    refresh_token = req.headers.authorization.split(' ')[1];
  }

  spotifyWebApi.setRefreshToken(refresh_token);
  spotifyWebApi
    .refreshAccessToken()
    .then(data => {
      return res.status(200).json({
        confirmation: 'success',
        data: {
          items: {
            access_token: data.body.access_token,
            refresh_token: refresh_token,
            expires_in: data.body.expires_in
          }
        }
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).json({
        confirmation: 'fail',
        message: err.message
      });
    });
});

module.exports = router;
