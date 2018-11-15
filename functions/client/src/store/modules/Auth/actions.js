import api from '../../../api/index';
import router from '../../../router/index';
import * as firebase from 'firebase';

const actions = {
  firebaseSignUpUser({ commit, dispatch }, signUpRequest) {
    commit('SET_LOADING', true);
    commit('clearError');
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        signUpRequest.email,
        signUpRequest.password
      )
      .then(response => {
        commit('SET_LOADING', false);
        const newUser = {
          id: response.user.uid
        };
        commit('setUser', newUser);
        dispatch('clearPlaylistState');

        if (signUpRequest.linkSpotify) {
          window.localStorage.setItem('fbUserId', newUser.id);
          dispatch('loginSpotify');
        }
      })
      .catch(error => {
        commit('SET_LOADING', false);
        commit('setError', error);
        console.log(error);
      });
  },
  firebaseSignInUser({ commit, dispatch }, signInRequest) {
    commit('SET_LOADING', true);
    commit('clearError');
    firebase
      .auth()
      .signInWithEmailAndPassword(signInRequest.email, signInRequest.password)
      .then(response => {
        commit('SET_LOADING', false);
        dispatch('clearPlaylistState');
        const oldUser = {
          id: response.user.uid
        };
        commit('setUser', oldUser);
      })
      .catch(error => {
        commit('SET_LOADING', false);
        commit('setError', error);
        console.log(error);
      });
  },
  autoSignIn({ commit, dispatch }, payload) {
    const user = {
      id: payload.uid
    };
    commit('setUser', user);
    window.localStorage.setItem('fbUserId', user.id);

    dispatch('fetchPlaylistsFromFB');
    dispatch('fetchUserSpotAuthTokenFromFB', user.id);
  },
  logout({ commit, getters, dispatch }) {
    if (getters.isSpotifyLoggedIn) {
      dispatch('logoutSpotify');
    }
    firebase.auth().signOut();
    commit('setUser', null);
    dispatch('clearPlaylistState');

    router.push('/landing');
  },
  clearError({ commit }) {
    commit('clearError');
  },
  loginSpotify: () => {
    api.loginSpotify();
  },

  finalizeSpotifyLogin({ commit }, { access_token, refresh_token, refresh }) {
    commit('setSpotifyAuthCodes', { access_token, refresh_token });
    window.localStorage.setItem('spotifyAuthAccessCode', access_token);
    window.localStorage.setItem('spotifyAuthRefreshCode', refresh_token);

    if (refresh) {
      return Promise.resolve(true);
    }
    router.push('/saved/playlists');

    return Promise.resolve(true);
  },

  saveUserSpotAuthTokensToFB({ commit, dispatch }, query) {
    const userId = window.localStorage.getItem('fbUserId');

    const tokens = {
      access_token: query.access_token,
      refresh_token: query.refresh_token
    };

    commit('SET_LOADING', true);

    firebase
      .database()
      .ref('/users/' + userId)
      .child('/tokens/')
      .set(tokens)
      .then(() => {
        dispatch('finalizeSpotifyLogin', {
          ...tokens,
          refresh: query.refresh
        }).then(() => {
          return Promise.resolve(true);
        });
      })
      .catch(err => {
        console.log(err.message);
      })
      .finally(() => {
        commit('SET_LOADING', false);
      });
  },

  fetchUserSpotAuthTokenFromFB({ dispatch, commit }, id) {
    commit('SET_LOADING', true);

    firebase
      .database()
      .ref('/users/' + id)
      .child('/tokens/')
      .once('value')
      .then(data => {
        const tokens = data.val();
        dispatch('finalizeSpotifyLogin', tokens);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => commit('SET_LOADING', false));
  },

  logoutSpotify({ commit }) {
    commit('setSpotifyAuthCodes', {
      access_token: null,
      refresh_token: null
    });

    window.localStorage.removeItem('spotifyAuthAccessCode');
    window.localStorage.removeItem('spotifyAuthRefreshCode');
    window.localStorage.removeItem('fbUserId');
  },

  fetchSpotifyRefreshToken({ commit, getters, dispatch }) {
    if (!getters.isSpotifyLoggedIn) return;
    commit('SET_LOADING', true);
    api
      .fetchSpotifyRefreshToken(getters.getRefreshToken)
      .then(({ data }) => {
        dispatch('saveUserSpotAuthTokensToFB', {
          ...data.items,
          refresh: true
        }).then(() => {
          commit('SET_LOADING', false);
          return Promise.resolve(true);
        });
      })
      .catch(err => {
        console.log(err.message);
        commit('SET_LOADING', false);
      });
  }
};

export default actions;
