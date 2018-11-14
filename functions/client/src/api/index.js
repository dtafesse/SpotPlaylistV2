import axios from 'axios';

const ROOT_URL_PROD =
  'https://us-central1-spotplaylist-dev.cloudfunctions.net/server';

const ROOT_URL_DEV = '/server';
const ROOT_URL = window.location.href.includes('localhost')
  ? ROOT_URL_DEV
  : ROOT_URL_PROD;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export default {
  loginSpotify() {
    window.location = window.location.href.includes('localhost')
      ? 'http://localhost:5000/spotplaylist-dev/us-central1/server/api/auth/login'
      : `${ROOT_URL_PROD}/api/auth/login`;
  },

  fetchSpotifyRefreshToken(refresh_token) {
    return axios
      .get(`${ROOT_URL}/api/auth/refresh_token`, {
        headers: {
          Authorization: `Bearer ${refresh_token}`
        }
      })
      .then(response => response.data);
  },

  savePlaylistToSpotify(access_token, playlist) {
    return axios
      .post(`${ROOT_URL}/api/playlist/save`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
        data: { playlist }
      })
      .then(response => response.data);
  },

  fetchQueryResults(query) {
    return axios
      .get(`${ROOT_URL}/api/search/${query}`)
      .then(checkStatus)
      .then(response => response.data);
  },

  fetchArtistTopTracks(payload) {
    return axios
      .post(`${ROOT_URL}/api/artists/tracks`, {
        data: payload
      })
      .then(response => response.data);
  },

  fetchAlbumTracks(payload) {
    return axios
      .post(`${ROOT_URL}/api/albums/tracks`, {
        data: payload
      })
      .then(checkStatus)
      .then(response => response.data);
  }
};
