import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import router from './router';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import * as firebase from 'firebase';

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
  mounted() {
    this.$store.dispatch('setSpotifyRefreshInterval');
  },
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAJkYNu0OoZ-6tgwh4tEUg-R-FEr7OIhso',
      authDomain: 'spotplaylist-dev.firebaseapp.com',
      databaseURL: 'https://spotplaylist-dev.firebaseio.com',
      projectId: 'spotplaylist-dev',
      storageBucket: ' spotplaylist-dev.appspot.com'
    });
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.$store.dispatch('autoSignIn', user);
    //   }
    // });
  }
}).$mount('#app');
