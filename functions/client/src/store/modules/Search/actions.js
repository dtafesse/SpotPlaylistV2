import api from "../../../api";
import router from "../../../router/index";
import helpers from "../../../assets/js/helpers";

const actions = {
  searchForQueryString({ commit, getters }, payload) {
    commit("SET_LOADING", true);
    api
      .fetchQueryResults(payload)
      .then(data => {
        if (data.message !== "Unauthorized") {
          const { items } = data.data;
          const { statusCode } = data.data;
          if (statusCode === 304) {
            commit("SET_QUERY_RESULTS_SEARCH_QUERY", getters.queryResult);
          } else {
            commit("SET_QUERY_RESULTS_SEARCH_QUERY", items);
          }
          //commit('SET_ARTISTS_SEARCH_QUERY', results);
        }
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err.message);
      })
      .finally(() => commit("SET_LOADING", false));
  },

  finalSetUpForGeneratedPlaylist({ commit, dispatch, getters }) {
    return new Promise((resolve, reject) => {
      let playlist = {
        playlistName: "Untitled",
        playlistIds: getters.getNewGeneratedPlaylist.map(track => track.uri),
        id: helpers.generateRandom(),
        spotifyGeneratedPlaylistId: null,
        snapshot_id: null
      };

      commit("SET_CURRENT_PLAYLIST_META_DATA", playlist);

      if (getters.user) {
        dispatch("savePlaylistToFirebaseDB");
      } else {
        commit("ADD_TO_RECENTLY_GENERATED_PLAYLISTS", playlist);
      }

      dispatch("setPlaylist", getters.getNewGeneratedPlaylist)
        .then(() => {
          dispatch("setSuffle", {
            shuffle: true,
            loadingNewPlaylist: true
          });

          resolve();
          router.push({ path: "/playlist" });
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err.message);
          reject(err);
        });
    });
  },

  generatePlaylist({ commit, dispatch, getters }) {
    commit("SET_LOADING", true);
    commit("RESET_GENERATED_PLAYLIST");

    const selectedAlbums = getters.getSelectedAlbums;
    const selectedArtists = getters.getSelectedArtists;
    dispatch("removeAllSelectedItems");

    dispatch("fetchCombinedSuggestedTracksForAlbumsAndArtists", {
      selectedAlbums,
      selectedArtists
    })
      .then(combinedSuggestedTracks => {
        // make sure each track is unique
        combinedSuggestedTracks.forEach(track => {
          const trackPos = getters.getNewGeneratedPlaylist
            .map(function(e) {
              return e.id;
            })
            .indexOf(track.id);

          if (trackPos === -1) {
            commit("PUSH_TO_GENERATED_PLAYLIST", track);
          }
        });

        return dispatch("finalSetUpForGeneratedPlaylist");
      })
      .catch(err => console.log(err))
      .finally(() => commit("SET_LOADING", false));
  },

  fetchCombinedSuggestedTracksForAlbumsAndArtists(
    { commit, dispatch },
    { selectedAlbums, selectedArtists }
  ) {
    return new Promise((resolve, reject) => {
      commit("SET_LOADING", true);
      let combinedSuggestedTracks = [];

      dispatch("fetchSuggestedTracksForEachSelectedAlbum", selectedAlbums)
        .then(suggestedTracks => {
          suggestedTracks.forEach(track => combinedSuggestedTracks.push(track));

          return dispatch(
            "fetchSuggestedTracksForEachSelectedArtist",
            selectedArtists
          );
        })
        .then(suggestedTracks => {
          suggestedTracks.forEach(track => combinedSuggestedTracks.push(track));

          resolve(combinedSuggestedTracks);
        })
        .catch(err => {
          console.log(err);
          commit("SET_LOADING", false);
          reject(err);
        });
    });
  },

  fetchSuggestedTracksForEachSelectedAlbum({ commit }, selectedAlbums) {
    return new Promise((resolve, reject) => {
      // no albums was selected so move on
      if (selectedAlbums.length === 0) return resolve([]);
      commit("SET_LOADING", true);

      const promises = Array.from(selectedAlbums).map(album => {
        return api.fetchRecommendedTracksForAlbum({ id: album.id });
      });

      Promise.all(promises)
        .then(responses => {
          let generatedPlayistBasedOnAlbumsOnly = [];

          responses.forEach(({ items }) => {
            generatedPlayistBasedOnAlbumsOnly = [
              ...generatedPlayistBasedOnAlbumsOnly,
              ...items
            ];
          });

          resolve(generatedPlayistBasedOnAlbumsOnly);
        })
        .catch(err => {
          console.log(err);
          commit("SET_LOADING", false);
          reject(err);
        });
    });
  },

  fetchSuggestedTracksForEachSelectedArtist({ commit }, selectedArtists) {
    return new Promise((resolve, reject) => {
      // no artists was selected so move on
      if (selectedArtists.length === 0) return resolve([]);
      commit("SET_LOADING", true);

      let selectedArtistIds = selectedArtists.map(artist => artist.id);
      api
        .fetchRecommendedTracksForArtists({ selectedArtistIds })
        .then(({ items }) => {
          // if there was no suggested tracks for selectedArtists,
          // just find their top tracks for each artist

          // return with a minimum of 10 suggested tracks
          if (items.length !== 0 && items.length > 10) resolve(items);

          const promises = Array.from(selectedArtists).map(artist => {
            return api.fetchArtistTopTracks({ id: artist.id });
          });

          return Promise.all(promises);
        })
        .then(responses => {
          let suggestedTracksForArtists = [];

          responses.forEach(({ items }) => {
            suggestedTracksForArtists = [
              ...suggestedTracksForArtists,
              ...items
            ];
          });
          resolve(suggestedTracksForArtists);
        })
        .catch(err => {
          commit("SET_LOADING", false);
          reject(err);
        });
    });
  },

  setSelectedArtistId: ({ commit }, payload) => {
    commit("SET_SELECTED_ARTIST_ID", payload);
  },
  addToSelectedAlbums: ({ dispatch, commit, getters }, item) => {
    const itemPos = getters.getSelectedAlbums
      .map(function(e) {
        return e.id;
      })
      .indexOf(item.id);

    if (itemPos === -1) {
      commit("ADD_TO_SELECTED_ALBUMS", item);
    } else {
      dispatch("removeItemFromSelectedAlbums", itemPos);
    }
  },
  addToSelectedArtists: ({ dispatch, commit, getters }, item) => {
    const itemPos = getters.getSelectedArtists
      .map(function(e) {
        return e.id;
      })
      .indexOf(item.id);

    if (itemPos === -1) {
      commit("ADD_TO_SELECTED_ARTISTS", item);
    } else {
      dispatch("removeItemFromSelectedArtists", itemPos);
    }
  },
  removeItemFromSelectedAlbums: ({ commit }, index) => {
    commit("REMOVE_ITEM_FROM_SELECTED_ALBUMS", index);
  },
  removeItemFromSelectedArtists: ({ commit }, index) => {
    commit("REMOVE_ITEM_FROM_SELECTED_ARTISTS", index);
  },
  removeAllSelectedItems: ({ commit }) => {
    commit("REMOVE_ALL_SELECTED_ALBUMS");
    commit("REMOVE_ALL_SELECTED_ARTISTS");
  },
  clearSearchState: ({ commit, dispatch }) => {
    dispatch("removeAllSelectedItems");
    commit("RESET_GENERATED_PLAYLIST");
  }
};

export default actions;
