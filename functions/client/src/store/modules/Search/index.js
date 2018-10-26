import api from '../../../api';

const state = {
  selectedArtistId: '',
  queryResult: [],
  selectedItems: [],
  searchQueryCleared: false,
  suggestionsDivVisible: false,
  loading: false
};

const getters = {
  getArtistId: state => state.selectedArtistId,
  isSearchQueryCleared: state => state.searchQueryCleared,
  getQueryResult: state => state.queryResult,
  isLoading: state => state.loading,
  getSelectedItems: state => state.selectedItems
};

const actions = {
  searchForQueryString({ commit, getters }, payload) {
    commit('SET_LOADING', true);
    api
      .fetchQueryResults(payload)
      .then(data => {
        if (data.message !== 'Unauthorized') {
          const { items } = data.data;
          // const results = [];

          // if (items.albums) {
          //   results.push({ header: 'Albums' });
          //   items.albums.items.forEach(element => results.push(element));

          //   if (items.artists) {
          //     results.push({ divider: true });
          //     results.push({ header: 'Artists' });
          //     items.artists.items.forEach(element => results.push(element));
          //   }
          // } else {
          //   if (items.artists) {
          //     results.push({ header: 'Artists' });
          //     items.artists.items.forEach(element => results.push(element));
          //   }
          // }

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

  // searchArtistId({ commit, getters }, payload) {
  //   commit('SET_LOADING', true);
  //   api
  //     .fetchArtistId(payload)
  //     .then(data => {
  //       if (data.message !== 'Unauthorized') {
  //         const artistList = data.data.items;

  //         const { statusCode } = data.data;
  //         if (statusCode === 304 || artistList.length == 0) {
  //           commit('SET_ARTISTS_SEARCH_QUERY', getters.getArtists);
  //         } else {
  //           commit('SET_ARTISTS_SEARCH_QUERY', artistList);
  //         }
  //         commit('SET_ARTISTS_SEARCH_QUERY', artistList);
  //       }
  //     })
  //     .catch(err => {
  //       // eslint-disable-next-line
  //       console.log(err.message);
  //     })
  //     .finally(() => commit('SET_LOADING', false));
  // },

  async searchArtistTopTrack({ dispatch, commit, getters }) {
    commit('SET_LOADING', true);
    let topTracksResponse = undefined;
    try {
      topTracksResponse = await api.fetchTopTracks(getters.getArtistId);
    } catch (err) {
      // eslint-disable-next-line
      console.log(err.message);
    }

    dispatch('setPlaylist', topTracksResponse.data)
      .then(() => {
        dispatch('setSuffle', {
          shuffle: true,
          loadingNewPlaylist: true
        });
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err.message);
      })
      .finally(() => commit('SET_LOADING', false));

    /// move this to table componet, set it first track in table component later on
    // maybe table component should have its own playlist and current track state??
    // dispatch(
    //   'setCurrentTrack',
    //   {
    //     currentTrack: rootGetters.getCurrentPlaylist[0],
    //     currentArtwork: rootGetters.getCurrentPlaylist[0].album.images[0].url,
    //     currentTrackIndex: 0
    //   },
    //   { root: true }
    // );
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

const mutations = {
  UPDATE_SEARCH_QUERY_CLEAR: (state, payload) => {
    state.searchQueryCleared = payload;
  },
  SET_SELECTED_ARTIST_ID: (state, payload) => {
    state.selectedArtistId = payload;
  },
  SET_QUERY_RESULTS_SEARCH_QUERY: (state, payload) => {
    state.queryResult = payload;
  },
  SET_LOADING: (state, payload) => {
    state.loading = payload;
  },
  ADD_TO_SELECTED_ITEMS: (state, item) => {
    state.selectedItems.push(item);
  },
  REMOVE_ITEM_FROM_SELECTED_ITEMS: (state, index) => {
    state.selectedItems.splice(index, 1);
  },
  REMOVE_ALL_SELECTED_ITEMS: state => {
    state.selectedItems = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
