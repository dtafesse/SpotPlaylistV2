const express = require('express');
const router = express.Router();

const querystring = require('querystring');

const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const client_id = keys.CLIENT_ID; // Your client id
const client_secret = keys.CLIENT_SECRET; // Your secret
const redirect_uri = keys.REDIRECT_URI;

router.get('/login', (req, res) => {
  var scope = 'user-read-private user-read-email';
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

  let spotifyWebApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
  });

  spotifyWebApi
    .authorizationCodeGrant(authorizationCode)
    .then(data => {
      let accessToken = data.body['access_token'];
      let uri = keys.FRONT_END_URI_CALLBACK;
      return res.redirect(uri + '?access_token=' + accessToken);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;