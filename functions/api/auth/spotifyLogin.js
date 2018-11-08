const express = require('express');
const router = express.Router();

const querystring = require('querystring');


const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const client_id = keys.CLIENT_ID; // Your client id
const client_secret = keys.CLIENT_SECRET; // Your secret
const redirect_uri = 'http://localhost:5000/server/api/auth/callback/'; // Your redirect uri


var spotifyWebApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUrl: redirect_uri
});

var authorizationCode;
const stateKey = 'spotify_auth_state'; 
//var authorizeURL = spotifyWebApi.clientCredentialsGrant();

router.get("/login", (req, res) => {   
      
  var scope = 'user-read-private user-read-email';
  console.log('https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri
  }));
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});


router.get('/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code;
     spotifyWebApi.
      spotifyWebApi.authorizationCodeGrant(code).then(
        data => {
          let accessCode = data.body["access_token"];
          let uri = 'http://localhost:8080';
          console.log('access token: ' + accessCode);
          res.redirect(uri + '?access_token=' + accessCode);
        }
       ).catch( err => {
         console.log(err.message);  });
        //console.log(spotifyWebApi.getAccessToken());
      //});
      
      
});

router.get('/home',(req, res) =>
{
console.log("hey you made it this far");
console.log(spotifyWebApi.getAccessToken());
});
module.exports = router;