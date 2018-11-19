import api from '../../../api';
import router from '../../../router/index';
import helpers from '../../../assets/js/helpers';

const TYPE = {
  album: 'albumTracks',
  artist: 'topArtistTracks'
};

const actions = {
  searchForQueryString({ commit, getters }, payload) {
    commit('SET_LOADING', true);
    api
      .fetchQueryResults(payload)
      .then(data => {
        if (data.message !== 'Unauthorized') {
          const { items } = data.data;
          const { statusCode } = data.data;
          if (statusCode === 304) {
            commit('SET_QUERY_RESULTS_SEARCH_QUERY', getters.queryResult);
          } else {
            commit('SET_QUERY_RESULTS_SEARCH_QUERY', items);
          }
          //commit('SET_ARTISTS_SEARCH_QUERY', results);
        }
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err.message);
      })
      .finally(() => commit('SET_LOADING', false));
  },

  generatePlaylist({ commit, dispatch, getters }) {
    commit('SET_LOADING', true);
    commit('RESET_GENERATED_PLAYLIST');

    const selectedItems = getters.getSelectedItems;
    commit('REMOVE_ALL_SELECTED_ITEMS');

    const promises = Array.from(selectedItems).map(item => {
      if (item.type === 'album') {
        let albumPayload = {
          id: item.id,
          albumName: item.name,
          type: TYPE.album,
          images: item.images
        };
        return api.fetchAlbumTracks(albumPayload);
      } else {
        let artistPayload = {
          id: item.id,
          type: TYPE.artist
        };
        return api.fetchArtistTopTracks(artistPayload);
      }
    });

    Promise.all(promises).then(responses => {
      responses.forEach(response => {
        response.data.items.forEach(track => {
          const trackPos = getters.getNewGeneratedPlaylist
            .map(function(e) {
              return e.id;
            })
            .indexOf(track.id);

          if (trackPos === -1) {
            commit('PUSH_TO_GENERATED_PLAYLIST', track);
          }
        });
      });

      helpers.shuffle(getters.getNewGeneratedPlaylist);

      let playlist = {
        playlistName: 'Untitled',
        playlistIds: getters.getNewGeneratedPlaylist.map(track => track.uri),
        id: helpers.generateRandom()
      };

      commit('SET_CURRENT_PLAYLIST_META_DATA', playlist);

      if (getters.user) {
        dispatch('savePlaylistToFirebaseDB');
      } else {
        commit('ADD_TO_RECENTLY_GENERATED_PLAYLISTS', playlist);
      }

      dispatch('setPlaylist', getters.getNewGeneratedPlaylist)
        .then(() => {
          dispatch('setSuffle', {
            shuffle: true,
            loadingNewPlaylist: true
          });

          router.push({ path: '/Playlist' });
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err.message);
        })
        .finally(() => {
          commit('SET_LOADING', false);
        });
    });
  },

  setSelectedArtistId: ({ commit }, payload) => {
    commit('SET_SELECTED_ARTIST_ID', payload);
  },
  addToSelectedItems: ({ dispatch, commit, getters }, item) => {
    const itemPos = getters.getSelectedItems
      .map(function(e) {
        return e.id;
      })
      .indexOf(item.id);

    if (itemPos === -1) {
      commit('ADD_TO_SELECTED_ITEMS', item);
    } else {
      dispatch('removeItemFromSelectedItems', itemPos);
    }
  },
  removeItemFromSelectedItems: ({ commit }, index) => {
    commit('REMOVE_ITEM_FROM_SELECTED_ITEMS', index);
  },
  removeAllSelectedItems: ({ commit }) => {
    commit('REMOVE_ALL_SELECTED_ITEMS');
  }
};

export default actions;
