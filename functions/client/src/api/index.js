const ROOT_URL_PROD =
  'https://us-central1-spotplaylist-dev.cloudfunctions.net/server';

//const ROOT_URL = ROOT_URL_PROD;
const ROOT_URL = '/server';

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
  
  // temp way to fetch artwork until search by top rated tracks of artists in implement
  fetchArtwork() {
    const id = '6NijWPXUijjGcrdkQFcflv';
    return fetch(`/server/api/artwork/${id}`, {
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

  fetchArtistTopTracks(artistId) {
    return fetch(`${ROOT_URL}/api/artists/${artistId}/toptracks`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  fetchAlbumTracks(id) {
    return fetch(`${ROOT_URL}/api/albums/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(checkStatus)
      .then(response => response.json());
  }
};
