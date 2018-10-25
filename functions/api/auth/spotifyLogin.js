const express = require('express');
const router = express.Router();

const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const client_id = keys.CLIENT_ID; // Your client id
const client_secret = keys.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:5000/server/api/auth/callback/'; // Your redirect uri

const spotifyWebApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUrl: redirect_uri
});

let authorizationCode;
const stateKey = 'spotify_auth_state'; 

function generateRandomString (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

router.get("/login", (req, res) => {   
    let state = generateRandomString(16);
    res.cookie(stateKey, state);
    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
});

router.get('/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);   
      console.log(code);   
    }
  });
  
module.exports = router;