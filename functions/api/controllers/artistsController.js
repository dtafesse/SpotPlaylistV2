const SpotifyWebApi = require("spotify-web-api-node");
const keys = require("../../config/keys.js");

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getArtistTopTracks = (req, res, next) => {
  let artistId = req.body.data.id;
  let type = req.body.data.type;

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body["access_token"]);
      spotifyWebApi.setRefreshToken(data.body["refresh_token"]);
      return spotifyWebApi.getArtistTopTracks(artistId, "US");
    })
    .then(data => {
      let { tracks } = data.body;
      tracks.forEach(track => {
        track.type = type;
      });

      res.status(200).json({
        confirmation: "success",
        data: {
          items: tracks
        }
      });
      return;
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).json({
        confirmation: "fail",
        message: err.message
      });
    });
};

exports.getUserTopTracks = (req, res, next) => {
  let { access_token } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .getMyTopArtists()
    .then(data => {
      res.status(200).json({
        confirmation: "success",
        data: {
          items: data.body.items
        }
      });
      return;
    })
    .catch(err => {
      console.log(err);
      if (err.statusCode === 401) {
        res.status(401).json({
          confirmation: "fail",
          message: err.message,
          statusCode: 401
        });
      } else {
        res.status(404).json({
          confirmation: "fail",
          message: err.message,
          statusCode: 404
        });
      }
    });
};

exports.suggestTracksBasedOnArtists = (req, res, next) => {
  // TODO: maybe implement this instead of just getting an artist top tracks
};
