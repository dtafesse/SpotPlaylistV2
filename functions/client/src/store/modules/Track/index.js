import api from '../../../api/index';
import firebase from 'firebase';

const actions = {
  findRelatedTrack: (context, id) => {
    return new Promise((resolve, reject) => {
      api
        .fetchRelatedTrack(id)
        .then(({ items }) => {
          if (items.length === 0) {
            reject(new Error('Could not find related track!'));
          }
          resolve(items[0]);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  },

  updateCurrentPlaylistWithNewTrack: ({ commit }, { track, index }) => {
    return new Promise((resolve, reject) => {
      if (!track) reject(new Error('No related Track Found'));
      commit('UPDATE_CURRENT_PLAYLIST_WITH_NEW_TRACK', { track, index });
      resolve();
    });
  },

  updateCurrentPlaylistMetaDataPlaylistUriId: (
    { commit },
    { track, index }
  ) => {
    return new Promise((resolve, reject) => {
      commit('UPDATE_CURRENT_PLAYLIST_META_DATA_WITH_NEW_TRACK_URI_ID', {
        track,
        index
      });
      resolve();
    });
  },

  updatedTrackForPlaylistFromRecentlyGeneratedPlaylists: (
    { commit, getters },
    { trackUri, index }
  ) => {
    return new Promise(resolve => {
      commit(
        'UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER_WITH_NEW_TRACK_URI_ID',
        {
          id: getters.getCurrentPlaylistMetaData.id,
          trackUri,
          trackUriPosition: index
        }
      );
      resolve();
    });
  },

  updatePlaylistOnFirebase: ({ dispatch }, { trackUri, index }) => {
    return new Promise((resolve, reject) => {
      dispatch('updateCurrentPlaylistMetaDataToFB', {
        node: `/playlistIds/${index}`,
        newItemToReplace: trackUri
      })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },

  updateSavedSpotifyPlaylist: (
    { dispatch, getters },
    { snapshot_id, index, newTrackUri, spotifyGeneratedPlaylistId }
  ) => {
    return new Promise((resolve, reject) => {
      api
        .removeTrackFromSavedSpotifyPlaylistByPostion({
          access_token: getters.getAccessToken,
          snapshot_id,
          index,
          spotifyGeneratedPlaylistId
        })
        .then(() => {
          return api.addTracksToCreatedPlaylistOnSpotify(
            getters.getAccessToken,
            [newTrackUri],
            spotifyGeneratedPlaylistId
          );
        })
        .then(({ data }) => {
          let new_snapshot_id = data.items;
          return api.reorderTrackInSavedSpotiyPlaylist({
            access_token: getters.getAccessToken,
            new_snapshot_id,
            spotifyGeneratedPlaylistId,
            rangeStart: getters.getCurrentPlaylist.length - 1,
            rangeLength: 1,
            insertBefore: index
          });
        })
        .then(data => {
          let new_snapshot_id = data.items;
          // update snapshot_id in currentlyPlaylistMetaData and recentlySavedPlaylits, and finally firebase
          return dispatch('updatedPlaylistSnapshotId', new_snapshot_id);
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },

  removeTrackFromSavedSpotifyPlaylists: (
    { dispatch, getters },
    { snapshot_id, index, spotifyGeneratedPlaylistId }
  ) => {
    return new Promise((resolve, reject) => {
      api
        .removeTrackFromSavedSpotifyPlaylistByPostion({
          access_token: getters.getAccessToken,
          snapshot_id,
          index,
          spotifyGeneratedPlaylistId
        })
        .then(data => {
          let new_snapshot_id = data.items;
          
          // update snapshot_id in currentlyPlaylistMetaData and recentlySavedPlaylits, and finally firebase
          return dispatch('updatedPlaylistSnapshotId', new_snapshot_id);
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },

  removeTrackFromFirebasePlaylist: ({ getters }, index) => {
    return new Promise((resolve, reject) => {
      const fbKey = getters.getCurrentPlaylistMetaData.fbKey;
      const location =
        '/playlists/' + getters.user.id + '/' + fbKey + '/playlistIds/';

      // sync down from server
      let list = [];

      let playlistIdsRef = firebase.database().ref(location);
      playlistIdsRef.on('value', (snap) => {
        list = snap.val();
      });

      // remove track uri at position of index, save it back to firebase
      list.splice(index, 1);
      playlistIdsRef
        .set(getters.getCurrentPlaylistMetaData.playlistIds)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }
};

export default {
  actions
};
