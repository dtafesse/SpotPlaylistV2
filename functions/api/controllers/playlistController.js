const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.savePlaylist = (req, res, next) => {
  let { access_token, playlistIds, playlistName } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .getMe()
    .then(data => {
      return spotifyWebApi.createPlaylist(data.body.id, playlistName);
    })
    .then(data => {
      return spotifyWebApi.addTracksToPlaylist(data.body.id, playlistIds);
    })
    .then(data => {
      res.status(200).json({
        confirmation: 'success',
        data: {
          items: data.body.snapshot_id
        }
      });
      return;
    })
    .catch(err => {
      console.log(err);
      if (err.statusCode === 401) {
        res.status(401).json({
          confirmation: 'fail',
          message: err.message,
          statusCode: 401
        });
      } else {
        res.status(404).json({
          confirmation: 'fail',
          message: err.message,
          statusCode: 404
        });
      }
    });
};
