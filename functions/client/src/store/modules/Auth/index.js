import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';

let refreshTokenInterval;

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

    refreshTokenInterval = setInterval(() => {
      let tokenExpiration = new Date().getTime() / 1000 + query.expires_in;
      console.log({ tokenExpiration });
      api
        .fetchSpotifyRefreshToken(query.refresh_token)
        .then(({ data }) => {
          commit('setSpotifyAuthCodes', {
            access_token: data.items.access_token,
            refresh_token: data.items.refresh_token,
            expires_in: data.items.expires_in
          });
        })
        .catch(err => console.log(err.message));
    }, 3000);

    router.push('/saved/playlists');
  },
  logoutSpotify: ({ commit }) => {
    commit('setSpotifyAuthCodes', {
      access_token: null,
      refresh_token: null,
      expires_in: null
    });

    clearInterval(refreshTokenInterval);

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
