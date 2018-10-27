const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getAlbumTracks = (req, res, next) => {
  let id;
  if (req.params.id) {
    id = req.params.id;

    //callSpotifyWebApiClientCredentialGrant();
    spotifyWebApi
      .clientCredentialsGrant()
      .then(data => {
        // Save the access token so that it's used in future calls
        spotifyWebApi.setAccessToken(data.body['access_token']);
        return spotifyWebApi.getAlbumTracks(id);
      })
      .then(data => {
        res.status(200).json({
          confirmation: 'success',
          data: {
            items: data.body.items
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
  }
};
