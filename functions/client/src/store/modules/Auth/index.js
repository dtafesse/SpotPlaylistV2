import api from '../../../api/index';
import router from '../../../router/index';
import * as firebase from 'firebase';

let refreshTokenInterval;
let isRefreshTokenIntervalSet;

const state = {
  user: null,
  error: null,
  spotifyAuthAccessCode: window.localStorage.getItem('spotifyAuthAccessCode'),
  spotifyAuthRefreshCode: window.localStorage.getItem('spotifyAuthRefreshCode'),
  spotifyAuthExpiresIn: window.localStorage.getItem('spotifyAuthExpiresIn')
};
const getters = {
  isSpotifyLoggedIn: state => !!state.spotifyAuthAccessCode,
  user: state => state.user,
  error: state => state.error,
  getExpiresIn: state => state.spotifyAuthExpiresIn,
  getRefreshToken: state => state.spotifyAuthRefreshCode
};
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

        /// figire out where to handle spotify linking??
        if (signUpRequest.linkSpotify) {
          dispatch('loginSpotify');

          // save access token and refresh token in the database for the user
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
        const oldUser = {
          id: response.user.uid
        };
        commit('setUser', oldUser);

        // fetch access, refresh, expire_in data from database for given user
      })
      .catch(error => {
        commit('SET_LOADING', false);
        commit('setError', error);
        console.log(error);
      });
  },
  autoSignIn({ commit }, payload) {
    const user = {
      id: payload.uid
    };
    commit('setUser', user);
  },
  logout({ commit, getters, dispatch }) {
    if (getters.isSpotifyLoggedIn) {
      dispatch('logoutSpotify');
    }
    firebase.auth().signOut();
    commit('setUser', null);

    router.push('/landing');
  },
  clearError({ commit }) {
    commit('clearError');
  },
  loginSpotify: () => {
    api.loginSpotify();
  },

  finalizeSpotifyLogin: ({ commit }, query) => {
    commit('setSpotifyAuthCodes', {
      access_token: query.access_token,
      refresh_token: query.refresh_token,
      expires_in: query.expires_in
    });
    window.localStorage.setItem('spotifyAuthAccessCode', query.access_token);
    window.localStorage.setItem('spotifyAuthRefreshCode', query.refresh_token);
    window.localStorage.setItem('spotifyAuthExpiresIn', query.expires_in);

    // dispatch('setSpotifyRefreshInterval');

    router.push('/saved/playlists');
  },
  logoutSpotify: ({ commit, dispatch }) => {
    commit('setSpotifyAuthCodes', {
      access_token: null,
      refresh_token: null,
      expires_in: null
    });

    dispatch('clearSpotifyRefreshInterval');

    window.localStorage.removeItem('spotifyAuthAccessCode');
    window.localStorage.removeItem('spotifyAuthRefreshCode');
    window.localStorage.removeItem('spotifyAuthExpiresIn');
  },
  setSpotifyRefreshInterval: ({ commit, getters }) => {
    if (getters.isSpotifyLoggedIn & !isRefreshTokenIntervalSet) {
      isRefreshTokenIntervalSet = true;
      let tokenExpirationInMilliSeconds =
        (Number(getters.getExpiresIn) - 200) * 1000;

      refreshTokenInterval = setInterval(() => {
        api
          .fetchSpotifyRefreshToken(getters.getRefreshToken)
          .then(({ data }) => {
            commit('setSpotifyAuthCodes', {
              access_token: data.items.access_token,
              refresh_token: data.items.refresh_token,
              expires_in: data.items.expires_in
            });
          })
          .catch(err => console.log(err.message));
      }, tokenExpirationInMilliSeconds);
    }
  },

  clearSpotifyRefreshInterval: () => {
    isRefreshTokenIntervalSet = false;
    clearInterval(refreshTokenInterval);
  }
};
const mutations = {
  setUser: (state, userObject) => {
    state.user = userObject;
  },
  setError: (state, error) => {
    state.error = error;
  },
  clearError(state) {
    state.error = null;
  },
  setSpotifyAuthCodes: (state, { access_token, refresh_token, expires_in }) => {
    state.spotifyAuthAccessCode = access_token;
    state.spotifyAuthRefreshCode = refresh_token;
    state.spotifyAuthExpiresIn = expires_in;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
