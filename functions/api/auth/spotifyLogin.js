const express = require('express');
const router = express.Router();

const querystring = require('querystring');


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
//var authorizeURL = spotifyWebApi.clientCredentialsGrant();

router.get("/login", (req, res) => {   
    //console.log('authurl: ' + JSON.stringify(authorizeURL));
    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        client_id: client_id,
        response_type: 'code',
        scope: scope,
        redirect_uri: redirect_uri
      })
      );
});
//router.post("https://accounts.spotify.com/api/token",)
// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   form: {
//     code: code,
//     redirect_uri: redirect_uri,
//     grant_type: 'authorization_code'
//   }
// };

router.get('/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code;
      console.log(code);
      // spotifyWebApi.authorizationCodeGrant(code).then(
      //   data => {
      //     let authorizationCode = data.body["access_token"];
      //     // spotifyWebApi.setAccessToken(data.body['access_token']);
      //     // spotifyWebApi.setRefreshToken(data.body['refresh_token']);
      //   }
      spotifyWebApi.setAccessToken(code);
      console.log(spotifyWebApi.getAccessToken());
      // ).catch( err => {
      //   console.log(err.message);  
        //console.log(spotifyWebApi.getAccessToken());
      //});
      res.redirect('../../../../home');
});

router.get('/home',(req, res) =>
{
console.log("hey you made it this far");
console.log(spotifyWebApi.getAccessToken());
});
module.exports = router;