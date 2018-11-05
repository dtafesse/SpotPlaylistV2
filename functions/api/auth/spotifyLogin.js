const express = require('express');
const router = express.Router();
let request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const client_id = keys.CLIENT_ID; // Your client id
const client_secret = keys.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:8080/server/api/auth/callback/'; // Your redirect uri


const spotifyWebApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUrl: redirect_uri
});

var authorizationCode;
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
        client_id: client_id,
        response_type: 'code',
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
      );
});

router.get('/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log('CODE: ' + code);
    console.log('state: ' + state);
    console.log('stateKey: ' + stateKey);
    console.log('storedState: ' + storedState);

    if ((state === null) || (state !== storedState)) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    }
     else {
      res.clearCookie(stateKey);   
      spotifyWebApi.authorizationCodeGrant(code).then(
        data => {
          let authorizationCode = data.body["access_token"];
        }
        
      ).catch( err => 
        console.log(err.message));  
  }
});

module.exports = router;