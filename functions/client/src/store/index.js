import Vuex from 'vuex';
import Vue from 'vue';
import Track from './modules/Track';
import Playlist from './modules/Playlist';
import Search from './modules/Search';
import PlayerControl from './modules/PlayerControl';
import Auth from './modules/Auth';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Playlist,
    Search,
    Auth,
    PlayerControl,
    Track
  }
});
