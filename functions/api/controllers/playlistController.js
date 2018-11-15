const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.savePlaylist = (req, res, next) => {
  let { playlist, access_token } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .getMe()
    .then(user => {
      res.status(200).json({
        confirmation: 'success',
        data: {
          items: user
        }
      });
      return;
    })
    .catch(err => {
      console.log(err);
      if (access_token && err.statusCode === 401) {
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
