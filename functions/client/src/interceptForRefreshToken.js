import axios from "axios";
import store from "./store";

let subscribers = [];
let isRefreshing = false;

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRrefreshed(token) {
  subscribers.forEach(cb => cb(token));
}

export default {
  interceptRefresh() {
    axios.interceptors.response.use(undefined, err => {
      if (err.response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          store
            .dispatch("fetchSpotifyRefreshToken")
            .then(() => {
              isRefreshing = false;
              onRrefreshed(store.getters.getAccessToken);
              subscribers = [];
            })
            .catch(err => {
              // eslint-disable-next-line
              console.log(err);
            });
        }
        const requestSubscribers = new Promise(resolve => {
          subscribeTokenRefresh(token => {
            // err.config.headers.Authorization =
            //   'Bearer ' + this.$store.getters.getAccessToken;
            // for some reason placing the access token in the header is
            // giving a lots of erros on the backend
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
