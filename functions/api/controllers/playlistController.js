const SpotifyWebApi = require("spotify-web-api-node");
const keys = require("../../config/keys.js");

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.createPlaylist = (req, res, next) => {
  let { access_token, playlistName } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .getMe()
    .then(data => {
      return spotifyWebApi.createPlaylist(data.body.id, playlistName);
    })
    .then(data => {
      res.status(200).json({
        confirmation: "success",
        data: {
          items: {
            id: data.body.id
          }
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

exports.addToPlaylist = (req, res, next) => {
  let { access_token, listOfPlaylistUris, playlistId } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .addTracksToPlaylist(playlistId, listOfPlaylistUris)
    .then(data => {
      res.status(200).json({
        confirmation: "success",
        data: {
          items: {
            snapshot_id: data.body.snapshot_id
          }
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

exports.featuredPlaylists = (req, res) => {
  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body["access_token"]);

      return spotifyWebApi.getFeaturedPlaylists({ limit: 18 });
    })
    .then(data => {
      return res.status(200).json({
        confirmation: "success",
        data: {
          items: data.body.playlists.items
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

exports.getPlaylistWithId = (req, res) => {
  let id;
  if (req.params.id) {
    id = req.params.id;
  }

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body["access_token"]);

      return spotifyWebApi.getPlaylist(id);
    })
    .then(data => {
      let tracks = data.body.tracks.items.map(item => item.track);

      return res.status(200).json({
        confirmation: "success",
        data: {
          items: tracks
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
