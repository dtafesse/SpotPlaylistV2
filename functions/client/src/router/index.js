import Vue from 'vue';
import Router from 'vue-router';
import SigIn from '../components/User/signIn';
import SignUp from '../components/User/signUp';
import Home from '../components/Home';
import SearchResults from '../components/Search/results';
import PlaylistTable from '../components/Playlist/playlistTable';
import SavedPlaylists from '../components/Playlist/playlistSaved';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/search/:query',
          component: SearchResults
        },
        {
          path: '/playlist',
          component: PlaylistTable
        },
        {
          path: '/saved/playlists',
          component: SavedPlaylists
        }
      ]
    },
    {
      path: '/signin',
      name: 'Signin',
      component: SigIn
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignUp
    }
  ],
  mode: 'history'
});
