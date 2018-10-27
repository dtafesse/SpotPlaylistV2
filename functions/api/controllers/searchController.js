const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.search = (req, res, next) => {
  let query;
  if (req.params.query) {
    query = req.params.query;
  }

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body['access_token']);
      spotifyWebApi.setRefreshToken(data.body['refresh_token']);
      return spotifyWebApi.search(query, ['album', 'artist'], { limit: 20 });
    })
    .then(data => {
      //const artistId = data.body.artists.items[0].id;
      //   const artistId = data.body.artists.items;

      const statusCode = data.statusCode;
      res.status(200).json({
        confirmation: 'success',
        data: {
          items: data.body,
          statusCode
        }
      });
      return;
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).json({
        confirmation: 'fail',
        message: err.message
      });
    });
};
