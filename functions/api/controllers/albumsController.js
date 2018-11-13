const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getAlbumTracks = (req, res, next) => {
  let { id, type, images, albumName } = req.body;

  //callSpotifyWebApiClientCredentialGrant();
  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body['access_token']);
      return spotifyWebApi.getAlbumTracks(id);
    })
    .then(data => {
      let tracks = data.body.items;

      tracks.forEach(track => {
        track.type = type;
        let album = {
          images: images,
          name: albumName
        };
        track.album = album;
      });

      res.status(200).json({
        confirmation: 'success',
        data: {
          items: tracks
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
