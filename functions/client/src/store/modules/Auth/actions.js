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
        dispatch('fetchUserSpotAuthTokenFromFB', oldUser.id);
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
    dispatch('fetchPlaylistsFromFB');
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

  finalizeSpotifyLogin({ commit }, tokens) {
    commit('setSpotifyAuthCodes', tokens);
    window.localStorage.setItem('spotifyAuthAccessCode', tokens.access_token);
    window.localStorage.setItem('spotifyAuthRefreshCode', tokens.refresh_token);

    router.push('/saved/playlists');
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
      .push(tokens)
      .then(() => {
        dispatch('finalizeSpotifyLogin', tokens);
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
        let tokens = {
          access_token: null,
          refresh_token: null
        };
        const obj = data.val();
        for (let key in obj) {
          tokens.access_token = obj[key].access_token;
          tokens.refresh_token = obj[key].refresh_token;
        }

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
  fetchSpotifyRefreshToken({ commit, getters }) {
    if (!getters.isSpotifyLoggedIn) return;
    commit('SET_LOADING', true);
    api
      .fetchSpotifyRefreshToken(getters.getRefreshToken)
      .then(({ data }) => {
        commit('setSpotifyAuthCodes', {
          access_token: data.items.access_token,
          refresh_token: data.items.refresh_token
        });
        window.localStorage.setItem(
          'spotifyAuthAccessCode',
          data.items.access_token
        );
        window.localStorage.setItem(
          'spotifyAuthRefreshCode',
          data.items.refresh_token
        );
        commit('SET_LOADING', false);
        return Promise.resolve(true);
      })
      .catch(err => {
        console.log(err.message);
        commit('SET_LOADING', false);
      });
  }
};

export default actions;
