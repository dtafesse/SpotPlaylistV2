const SpotifyWebApi = require("spotify-web-api-node");
const keys = require("../../config/keys.js");

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getArtistTopTracks = (req, res, next) => {
  let artistId = req.body.data.id;

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

exports.getUserTopArtists = (req, res, next) => {
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

exports.getSuggestedTracksBasedOnArtists = (req, res, next) => {
  let { selectedArtistIds } = req.body.data;

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body["access_token"]);

      // limit of 5 track ids.. rule set by this endpoing on spotify
      return spotifyWebApi.getRecommendations({
        seed_artists: selectedArtistIds,
        limit: 25
      });
    })
    .then(data => {
      return res.status(200).json({
        confirmation: "success",
        data: {
          items: data.body.tracks
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        confirmation: "fail",
        message: err.message
      });
    });
};
