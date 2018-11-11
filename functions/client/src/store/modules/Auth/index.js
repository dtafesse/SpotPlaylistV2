import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';

const state = {
  spotifyAuthAccessCode: window.localStorage.getItem('spotifyAuthAccessCode'),
  spotifyAuthRefreshCode: window.localStorage.getItem('spotifyAuthRefreshCode'),
  spotifyAuthExpiresIn: window.localStorage.getItem('spotifyAuthExpiresIn')
};
const getters = {
  isSpotifyLoggedIn: state => !!state.spotifyAuthAccessCode
};
const actions = {
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
    router.push('/saved/playlists');
  },
  logoutSpotify: ({ commit }) => {
    commit('setSpotifyAuthCodes', {
      access_token: null,
      refresh_token: null,
      expires_in: null
    });
    window.localStorage.removeItem('spotifyAuthAccessCode');
    window.localStorage.removeItem('spotifyAuthRefreshCode');
    window.localStorage.removeItem('spotifyAuthExpiresIn');
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
