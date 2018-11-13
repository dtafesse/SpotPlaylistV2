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
    let uri = new URL(
      'http://localhost:5000/spotplaylist-dev/us-central1/server/api/auth/refresh_token'
    );
    uri.searchParams.append('refresh_token', refresh_token);
    return fetch(uri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  fetchResultsForQuery(query) {
    return fetch(`${ROOT_URL}/api/search/${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  fetchQueryResults(query) {
    return fetch(`${ROOT_URL}/api/search/${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(checkStatus)
      .then(response => response.json());
  },

  fetchArtistTopTracks(payload) {
    return fetch(`${ROOT_URL}/api/artists/tracks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => response.json());
  },

  fetchAlbumTracks(payload) {
    return fetch(`${ROOT_URL}/api/albums/tracks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(checkStatus)
      .then(response => response.json());
  }
};
