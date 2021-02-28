import api from "../../../api/index";
import router from "../../../router/index";
import firebase from "firebase";

const actions = {
  setPlaylist: ({ commit, dispatch }, newPlayist) => {
    return new Promise(resolve => {
      commit("SET_PLAYLIST", newPlayist);

      dispatch("setSuffle", {
        shuffle: true,
        loadingNewPlaylist: true
      });
      resolve();
      router.push({ path: "/playlist" });
    });
  },
  clearPlaylistState: ({ commit }) => {
    commit("SET_CURRENT_TRACK", undefined);
    commit("SET_PLAYLIST", undefined);
    commit("SET_SHUFFLED_PLAYLIST", []);
    commit("SET_CURRENT_PLAYLIST_META_DATA", []);
    commit("SET_RECENTLY_GENERATED_PLAYLISTS", []);
    commit("SET_AUDIO_ELEMENT", undefined);
  },
  fetchPlaylistsFromFB: ({ commit, getters }) => {
    commit("SET_LOADING", true);

    firebase
      .database()
      .ref("/playlists/" + getters.user.id)
      .once("value")
      .then(data => {
        let savedPlaylists = [];
        const obj = data.val();

        for (let key in obj) {
          savedPlaylists.push({
            id: obj[key].id,
            playlistIds: obj[key].playlistIds,
            playlistName: obj[key].playlistName,
            spotifyGeneratedPlaylistId: obj[key].spotifyGeneratedPlaylistId,
            snapshot_id: obj[key].snapshot_id,
            generatedPlaylist: obj[key].generatedPlaylist,
            fbKey: obj[key].fbKey
          });
        }

        if (savedPlaylists) {
          commit("SET_RECENTLY_GENERATED_PLAYLISTS", savedPlaylists);
        }
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
      })
      .finally(() => commit("SET_LOADING", false));
  },
  savePlaylistToSpotify({ commit, getters, dispatch }) {
    commit("SET_LOADING", true);
    api
      .createPlaylistOnSpotify(
        getters.getAccessToken,
        getters.getCurrentPlaylistMetaData.playlistName
      )
      .then(data => {
        let spotifyGeneratedPlaylistId = data.data.items.id;
        commit("SET_SPOTIFY_GENERATED_PLAYLIST_ID", spotifyGeneratedPlaylistId);

        let id = getters.getCurrentPlaylistMetaData.id;
        commit("UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER", {
          key: "spotifyGeneratedPlaylistId",
          newValue: spotifyGeneratedPlaylistId,
          id
        });

        dispatch("updateCurrentPlaylistMetaDataToFB", {
          node: "/spotifyGeneratedPlaylistId/",
          newItemToReplace: spotifyGeneratedPlaylistId
        });

        return api.addTracksToCreatedPlaylistOnSpotify(
          getters.getAccessToken,
          getters.getCurrentPlaylistMetaData.playlistIds,
          spotifyGeneratedPlaylistId
        );
      })
      .then(data => {
        let { snapshot_id } = data.data.items;
        commit("SET_SPOTIFY_GENERATED_SNAPSHOT_ID", snapshot_id);

        let id = getters.getCurrentPlaylistMetaData.id;
        commit("UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER", {
          key: "snapshot_id",
          newValue: snapshot_id,
          id
        });

        dispatch("updateCurrentPlaylistMetaDataToFB", {
          node: "/snapshot_id/",
          newItemToReplace: snapshot_id
        }).then(() => {
          router.push({ path: "/playlist" });
        });

        commit("SET_LOADING", false);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
        commit("SET_LOADING", false);
      });
  },
  savePlaylistToFirebaseDB({ commit, getters }) {
    commit("SET_LOADING", true);
    let newPlaylistKey = firebase
      .database()
      .ref("/playlists/" + getters.user.id)
      .child("posts")
      .push().key;

    let currentPlaylistMeta = {
      ...getters.getCurrentPlaylistMetaData,
      fbKey: newPlaylistKey
    };

    let newPlaylist = {};
    newPlaylist[
      "/playlists/" + getters.user.id + "/" + newPlaylistKey
    ] = currentPlaylistMeta;

    firebase
      .database()
      .ref()
      .update(newPlaylist)
      .then(() => {
        commit("SET_CURRENT_PLAYLIST_META_DATA", currentPlaylistMeta);
        commit("ADD_TO_RECENTLY_GENERATED_PLAYLISTS", currentPlaylistMeta);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err.message);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  },
  updatedPlaylistName: ({ commit, getters, dispatch }, newPlaylistName) => {
    commit("UPDATE_PLAYLIST_NAME", newPlaylistName);

    let id = getters.getCurrentPlaylistMetaData.id;
    commit("UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER", {
      key: "playlistName",
      newValue: newPlaylistName,
      id
    });

    dispatch("updateCurrentPlaylistMetaDataToFB", {
      node: "/playlistName/",
      newItemToReplace: newPlaylistName
    });
  },
  updatedPlaylistSnapshotId: ({ commit, getters, dispatch }, snapshot_id) => {
    return new Promise((resolve, reject) => {
      commit("UPDATE_PLAYLIST_SNAPSHOT_ID", snapshot_id);

      let id = getters.getCurrentPlaylistMetaData.id;
      commit("UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER", {
        key: "snapshot_id",
        newValue: snapshot_id,
        id
      });

      dispatch("updateCurrentPlaylistMetaDataToFB", {
        node: "/snapshot_id/",
        newItemToReplace: snapshot_id
      })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },

  updateCurrentPlaylistMetaDataToFB: (
    { commit, getters },
    { node, newItemToReplace }
  ) => {
    return new Promise((resolve, reject) => {
      if (getters.user) {
        // update on firebase as well
        commit("SET_LOADING", true);

        const fbKey = getters.getCurrentPlaylistMetaData.fbKey;
        const location = "/playlists/" + getters.user.id + "/" + fbKey + node;

        let fbUpdates = {};
        fbUpdates[location] = newItemToReplace;

        firebase
          .database()
          .ref()
          .update(fbUpdates)
          .then(() => {
            commit("SET_LOADING", false);
            resolve();
          })
          .catch(err => {
            // eslint-disable-next-line
            console.log(err);
            reject(err);
          })
          .finally(() => commit("SET_LOADING", false));
      }
    });
  },
  checkIfLoginIntitiatedFromPlaylistPage: ({ commit, dispatch, getters }) => {
    return new Promise((resolve, reject) => {
      let isLoginIntitiatedFromPlaylistPage = window.localStorage.getItem(
        "loginFromPlaylistPage"
      );

      if (isLoginIntitiatedFromPlaylistPage) {
        commit("SET_LOADING", true);
        window.localStorage.removeItem("loginFromPlaylistPage");

        let postion = getters.getRecentlyGeneratedPlaylist.length - 1;

        commit(
          "SET_CURRENT_PLAYLIST_META_DATA",
          getters.getRecentlyGeneratedPlaylist[postion]
        );

        dispatch(
          "setPlaylist",
          getters.getRecentlyGeneratedPlaylist[postion].generatedPlaylist
        )
          .then(() => {
            resolve();
          })
          .finally(() => {
            commit("SET_LOADING", false);
          });
      }
    });
  },
  saveCurrentGeneratedPlaylistToFirebaseForUserThatHasNotLinkedSpotify: ({
    dispatch,
    getters
  }) => {
    // after user links spotify account from the playlist page, the page refreshs
    // thus, we loose the currentlyGeneratedPlaylist from our store
    // so save it first before letting the user link their account

    return new Promise(resolve => {
      dispatch("updateCurrentPlaylistMetaDataToFB", {
        node: "/generatedPlaylist/",
        newItemToReplace: getters.getCurrentPlaylist
      }).then(() => {
        dispatch("updateCurrentPlaylistMetaDataToFB", {
          node: "/fbKey/",
          newItemToReplace: getters.getCurrentPlaylistMetaData.fbKey
        }).then(() => resolve());
      });
    });
  },
  selectPlaylistFromRecentlyGeneratedPlaylists: (
    { commit, dispatch },
    selectedPlaylist
  ) => {
    commit("SET_LOADING", true);
    commit("SET_CURRENT_PLAYLIST_META_DATA", selectedPlaylist);
    let trackIds = selectedPlaylist.playlistIds.map(trackUri =>
      trackUri.substring(14)
    );
    dispatch("fetchPlaylistTracks", trackIds).then(tracks => {
      dispatch("setPlaylist", tracks).then(() => {
        commit("SET_LOADING", false);
      });
    });
  },
  fetchPlaylistTracks: ({ commit }, trackIds) => {
    return new Promise((resolve, reject) => {
      let size = trackIds.length;
      let quotient = Math.floor(size / 50);
      let reminder = size % 50;

      let startingPoint = 0;
      let startingEndPoint = 50 > size ? size : 50;

      let i = 0;
      let promises = [];
      if (quotient > 0) {
        while (i < quotient) {
          if (startingPoint < startingEndPoint) {
            var trackIdsPortion = trackIds.slice(
              startingPoint,
              startingEndPoint
            );

            promises.push(api.fetchPlaylistTracks(trackIdsPortion));
          }

          if (i !== quotient - 1) {
            startingPoint += startingEndPoint;
            startingEndPoint += 50;
          }
          i += 1;
        }
        if (startingEndPoint !== size) {
          promises.push(
            api.fetchPlaylistTracks(trackIds.slice(startingEndPoint, size))
          );
        }
      } else {
        promises.push(
          api.fetchPlaylistTracks(
            trackIds.slice(startingPoint, startingPoint + reminder)
          )
        );
      }

      Promise.all(promises)
        .then(responses => {
          let playlistTracks = [];
          responses.forEach(({ items }) => {
            playlistTracks = [...playlistTracks, ...items];
          });
          resolve(playlistTracks);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          commit("SET_LOADING", false);
          reject(err);
        });
    });
  },
  fetchFeaturedPlaylists: ({ commit }) => {
    commit("SET_LOADING", true);
    api
      .fetchFeaturedPlaylists()
      .then(({ items }) => {
        commit("SET_FEATURED_PLAYLISTS", items);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
      })
      .finally(() => commit("SET_LOADING", false));
  },
  fetchTracksForSelectedFeaturedPlaylist: (
    { dispatch, commit },
    { id, playlistName }
  ) => {
    commit("SET_LOADING", true);
    api
      .fetchTracksForSelectedFeaturedPlaylist(id)
      .then(({ items }) => {
        return dispatch("finalSetUpForGeneratedPlaylist", {
          newlyGeneratedPlaylist: items,
          playlistName: playlistName
        });
      })
      .finally(() => commit("SET_LOADING", false));
  },
  removePlaylistFromFirebasePlaylists: ({ getters }, index) => {
    return new Promise((resolve, reject) => {
      const fbKey = getters.getRecentlyGeneratedPlaylist[index].fbKey;
      const location = "/playlists/" + getters.user.id + "/" + fbKey;

      var updates = {};
      updates[location] = null;

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },
  removePlaylistFromRecentlyGeneratedPlaylists: ({ commit }, index) => {
    commit("REMOVE_SELECTED_PLAYLIST_FROM_RECENTLY_GENERATED_PLAYLISTS", index);
  }
};

export default actions;
