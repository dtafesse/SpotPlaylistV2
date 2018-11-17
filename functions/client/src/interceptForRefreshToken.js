import axios from 'axios';
import store from './store';

let subscribers = [];
let isRefreshing = false;

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRrefreshed(token) {
  subscribers.map(cb => cb(token));
}

export default {
  interceptRefresh() {
    axios.interceptors.response.use(undefined, err => {
      if (err.response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          store.dispatch('fetchSpotifyRefreshToken').then(() => {
            // err.config.headers.Authorization =
            //   'Bearer ' + this.$store.getters.getAccessToken;
            isRefreshing = false;
            onRrefreshed(store.getters.getAccessToken);
            subscribers = [];
          });
        }
        const requestSubscribers = new Promise(resolve => {
          subscribeTokenRefresh(token => {
            let parsedData = JSON.parse(err.config.data);
            parsedData.data.access_token = token;

            err.config.data = JSON.stringify(parsedData);
            return resolve(axios(err.config));
          });
        });
        return requestSubscribers;
      } else {
        return Promise.reject(err);
      }
    });
  }
};
