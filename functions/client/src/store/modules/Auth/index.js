import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';
import * as firebase from 'firebase';

let refreshTokenInterval;
let isRefreshTokenIntervalSet;

const state = {
  user: null,
  loading: false,
  error: null,
  spotifyAuthAccessCode: window.localStorage.getItem('spotifyAuthAccessCode'),
  spotifyAuthRefreshCode: window.localStorage.getItem('spotifyAuthRefreshCode'),
  spotifyAuthExpiresIn: window.localStorage.getItem('spotifyAuthExpiresIn')
};
const getters = {
  isSpotifyLoggedIn: state => !!state.spotifyAuthCode,
  user(state) {
    return state.user;
  },
  loading(state) {
    return state.loading;
  },
  error(state) {
    return state.error;
  },
  getExpiresIn: state => state.spotifyAuthExpiresIn,
  getRefreshToken: state => state.spotifyAuthRefreshCode
};
const actions = {
  firebaseSignUpUser({ commit }, signUpRequest) {
    commit('setLoading', true);
    commit('clearError');
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        signUpRequest.email,
        signUpRequest.password
      )
      .then(response => {
        commit('setLoading', false);
        const newUser = {
          id: response.user.uid
        };
        commit('setUser', newUser);
      })
      .catch(error => {
        commit('setLoading', false);
        commit('setError', error);
        console.log(error);
      });
  },
  firebaseSignInUser({ commit }, signInRequest) {
    commit('setLoading', true);
    commit('clearError');
    firebase
      .auth()
      .signInWithEmailAndPassword(signInRequest.email, signInRequest.password)
      .then(response => {
        commit('setLoading', false);
        const oldUser = {
          id: response.user.uid
        };
        commit('setUser', oldUser);
      })
      .catch(error => {
        commit('setLoading', false);
        commit('setError', error);
        console.log(error);
      });
  },
  clearError({ commit }) {
    commit('clearError');
  },
  loginSpotify: () => {
    api.loginSpotify();
  },

  finalizeSpotifyLogin: ({ commit }, searchQuery) => {
    const query = queryString.parse(searchQuery);
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

    router.push('/landing');
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
  setLoading: (state, isLoading) => {
    state.loading = isLoading;
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
