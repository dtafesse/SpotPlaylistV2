const SpotifyWebApi = require("spotify-web-api-node");
const keys = require("../../config/keys.js");

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getAlbumTracks = (req, res, next) => {
  let { id, type, images, albumName } = req.body.data;

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body["access_token"]);
      return spotifyWebApi.getAlbumTracks(id);
    })
    .then(data => {
      // let tracks = data.body.items;

      // tracks.forEach(track => {
      //   track.type = type;
      //   let album = {
      //     images: images,
      //     name: albumName
      //   };
      //   track.album = album;
      // });

      // res.status(200).json({
      //   confirmation: "success",
      //   data: {
      //     items: tracks
      //   }
      // });

      let tracks = data.body.items;

      //
      let trackIds = tracks.map(track => track.id);

      if (trackIds.length > 5) {
        req.trackIds = [
          trackIds[0],
          trackIds[1],
          trackIds[2],
          trackIds[3],
          trackIds[4]
        ];
      } else {
        req.trackIds = trackIds;
      }

      return next();
    })
    .catch(err => {
      console.log(err.message);
      res.status(404).json({
        confirmation: "fail",
        message: err.message
      });
    });
};

exports.suggestTracksBasedOnAlbumTracks = (req, res) => {
  let trackIds;
  if (req.trackIds) {
    trackIds = req.trackIds;
  }

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body["access_token"]);

      // limit of 5 track ids.. rule set by this endpoing on spotify
      return spotifyWebApi.getRecommendations({
        seed_tracks: trackIds,
        limit: 20
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
