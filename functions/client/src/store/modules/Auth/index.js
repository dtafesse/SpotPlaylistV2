import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';

let refreshTokenInterval;
let isRefreshTokenIntervalSet;

const state = {
  spotifyAuthAccessCode: window.localStorage.getItem('spotifyAuthAccessCode'),
  spotifyAuthRefreshCode: window.localStorage.getItem('spotifyAuthRefreshCode'),
  spotifyAuthExpiresIn: window.localStorage.getItem('spotifyAuthExpiresIn')
};
const getters = {
  isSpotifyLoggedIn: state => !!state.spotifyAuthAccessCode,
  getExpiresIn: state => state.spotifyAuthExpiresIn,
  getRefreshToken: state => state.spotifyAuthRefreshCode
};
const actions = {
  loginSpotify: () => {
    api.loginSpotify();
  },

  finalizeSpotifyLogin: ({ commit, dispatch }, searchQuery) => {
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
  },
  setSpotifyRefreshInterval: ({ commit, getters }) => {
    if (getters.isSpotifyLoggedIn & !isRefreshTokenIntervalSet) {
      isRefreshTokenIntervalSet = true;
      let tokenExpirationInSeconds = Number(getters.getExpiresIn) - 200;

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
      }, 3000);
    }
  },

  clearSpotifyRefreshInterval: () => {
    isRefreshTokenIntervalSet = false;
    clearInterval(refreshTokenInterval);
  }
};
const mutations = {
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
