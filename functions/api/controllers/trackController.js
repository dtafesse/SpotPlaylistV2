const SpotifyWebApi = require('spotify-web-api-node');
const keys = require('../../config/keys.js');

const spotifyWebApi = new SpotifyWebApi({
  clientId: keys.CLIENT_ID,
  clientSecret: keys.CLIENT_SECRET
});

exports.getRelatedTracks = (req, res, next) => {
  let trackId;
  if (req.params.id) {
    trackId = req.params.id;
  }

  spotifyWebApi
    .clientCredentialsGrant()
    .then(data => {
      // Save the access token so that it's used in future calls
      spotifyWebApi.setAccessToken(data.body['access_token']);
      return spotifyWebApi.getRecommendations({
        seed_tracks: [trackId],
        limit: 1
      });
    })
    .then(data => {
      res.status(200).json({
        confirmation: 'success',
        data: {
          items: data.body.tracks
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

exports.reorderTrack = (req, res, next) => {
  let {
    access_token,
    snapshot_id,
    rangeStart,
    rangeLength,
    insertBefore,
    spotifyGeneratedPlaylistId
  } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .reorderTracksInPlaylist(
      spotifyGeneratedPlaylistId,
      rangeStart,
      insertBefore,
      { range_length: rangeLength, snapshot_id }
    )
    .then(data => {
      console.log(data.body);
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

exports.removeTrackByPostion = (req, res, next) => {
  let {
    access_token,
    snapshot_id,
    index,
    spotifyGeneratedPlaylistId
  } = req.body.data;

  spotifyWebApi.setAccessToken(access_token);
  spotifyWebApi
    .removeTracksFromPlaylistByPosition(
      spotifyGeneratedPlaylistId,
      [index],
      snapshot_id
    )
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
