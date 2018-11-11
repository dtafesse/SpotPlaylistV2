import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import router from './router';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
  mounted() {
    this.$store.dispatch('setSpotifyRefreshInterval');
  }
}).$mount('#app');
