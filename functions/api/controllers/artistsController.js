const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getArtistTopTracks = (req, res, next) => {
  let artistId;
  if (req.params.id) {
    artistId = req.params.id;

    spotifyWebApi
      .clientCredentialsGrant()
      .then(data => {
        // Save the access token so that it's used in future calls
        spotifyWebApi.setAccessToken(data.body['access_token']);
        spotifyWebApi.setRefreshToken(data.body['refresh_token']);
        return spotifyWebApi.getArtistTopTracks(artistId, 'US');
      })
      .then(data => {
        res.status(200).json({
          confirmation: 'success',
          data: data.body.tracks
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
