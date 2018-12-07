import Vuex from "vuex";
import Vue from "vue";
import Track from "./modules/Track";
import Playlist from "./modules/Playlist";
import Search from "./modules/Search";
import PlayerControl from "./modules/PlayerControl";
import Auth from "./modules/Auth";
import Album from "./modules/Albums";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Playlist,
    Search,
    Auth,
    PlayerControl,
    Track,
    Album
  }
});
