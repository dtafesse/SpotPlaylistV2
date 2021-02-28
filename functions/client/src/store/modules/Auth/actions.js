import api from "../../../api/index";
import router from "../../../router/index";
import firebase from "firebase";

const actions = {
  firebaseSignUpUser({ commit, dispatch }, signUpRequest) {
    commit("SET_LOADING", true);
    commit("clearError");
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        signUpRequest.email,
        signUpRequest.password
      )
      .then(response => {
        commit("SET_LOADING", false);
        const newUser = {
          id: response.user.uid
        };
        commit("setUser", newUser);
        dispatch("clearPlaylistState");

        if (signUpRequest.linkSpotify) {
          window.localStorage.setItem("fbUserId", newUser.id);
          dispatch("loginSpotify");
        }
      })
      .catch(error => {
        commit("SET_LOADING", false);
        commit("setError", error);
        console.log(error);
      });
  },
  firebaseSignInUser({ commit, dispatch }, signInRequest) {
    commit("SET_LOADING", true);
    commit("clearError");
    firebase
      .auth()
      .signInWithEmailAndPassword(signInRequest.email, signInRequest.password)
      .then(response => {
        commit("SET_LOADING", false);
        dispatch("clearPlaylistState");
        const oldUser = {
          id: response.user.uid
        };
        commit("setUser", oldUser);
      })
      .catch(error => {
        commit("SET_LOADING", false);
        commit("setError", error);
        // eslint-disable-next-line
        console.log(error);
      });
  },
  autoSignIn({ commit, dispatch, getters }, payload) {
    const user = {
      id: payload.uid
    };
    commit("setUser", user);
    window.localStorage.setItem("fbUserId", user.id);

    dispatch("fetchPlaylistsFromFB");
    dispatch("fetchUserSpotAuthTokenFromFB", user.id).then(() => {
      if (getters.isSpotifyLoggedIn) {
        dispatch("fetchSpotifyUsersTopArtists");
      }
    });
  },
  logout({ commit, getters, dispatch }) {
    if (getters.isSpotifyLoggedIn) {
      dispatch("logoutSpotify");
    }
    firebase.auth().signOut().finally(() => {
      commit("setUser", null);
      dispatch("clearPlaylistState");
      dispatch("clearSearchState");

      router.push("/signin");
    });
  },
  clearError({ commit }) {
    commit("clearError");
  },
  loginSpotify: () => {
    api.loginSpotify();
  },

  finalizeSpotifyLogin({ commit }, { access_token, refresh_token, isRefresh }) {
    return new Promise((resolve, reject) => {
      commit("setSpotifyAuthCodes", { access_token, refresh_token });
      window.localStorage.setItem("spotifyAuthAccessCode", access_token);
      window.localStorage.setItem("spotifyAuthRefreshCode", refresh_token);

      if (!isRefresh) {
        router.push("/saved/playlists");
      }
      resolve();
    });
  },

  saveUserSpotAuthTokensToFB({ commit, dispatch }, query) {
    return new Promise((resolve, reject) => {
      const userId = window.localStorage.getItem("fbUserId");

      const tokens = {
        access_token: query.access_token,
        refresh_token: query.refresh_token
      };

      commit("SET_LOADING", true);

      firebase
        .database()
        .ref("/users/" + userId)
        .child("/tokens/")
        .set(tokens)
        .then(() => {
          dispatch("finalizeSpotifyLogin", {
            ...tokens,
            isRefresh: query.refresh
          }).then(() => {
            resolve(true);
          });
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err.message);
          reject(err);
        })
        .finally(() => {
          commit("SET_LOADING", false);
        });
    });
  },

  fetchUserSpotAuthTokenFromFB({ dispatch, commit }, id) {
    return new Promise((resolve, reject) => {
      commit("SET_LOADING", true);

      firebase
        .database()
        .ref("/users/" + id)
        .child("/tokens/")
        .once("value")
        .then(data => {
          const tokens = data.val();
          if (tokens) {
            dispatch("finalizeSpotifyLogin", tokens).then(() => resolve());
          } else {
            dispatch("finalizeSpotifyLogin", {
              access_token: null,
              refresh_token: null
            }).then(() => resolve());
          }
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          reject(err);
        })
        .finally(() => commit("SET_LOADING", false));
    });
  },

  logoutSpotify({ commit }) {
    commit("setSpotifyAuthCodes", {
      access_token: null,
      refresh_token: null
    });

    window.localStorage.removeItem("spotifyAuthAccessCode");
    window.localStorage.removeItem("spotifyAuthRefreshCode");
    window.localStorage.removeItem("fbUserId");
  },

  fetchSpotifyRefreshToken({ commit, getters, dispatch }) {
    return new Promise((resolve, reject) => {
      if (!getters.isSpotifyLoggedIn) {
        reject(new Error("Spotify account is Not linked!"));
      }

      commit("SET_LOADING", true);
      api
        .fetchSpotifyRefreshToken(getters.getRefreshToken)
        .then(({ data }) => {
          dispatch("saveUserSpotAuthTokensToFB", {
            ...data.items,
            isRefresh: true
          }).then(() => {
            commit("SET_LOADING", false);
            resolve(true);
          });
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err.message);
          commit("SET_LOADING", false);
          reject(err);
        });
    });
  },

  fetchSpotifyUsersTopArtists({ commit, getters }) {
    return new Promise((resolve, reject) => {
      api
        .fetchSpotifyUsersTopArtists(getters.getAccessToken)
        .then(data => {
          commit("setUserSpotifyTopArtists", data.items);
          resolve();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
          reject(err);
        });
    });
  }
};

export default actions;
