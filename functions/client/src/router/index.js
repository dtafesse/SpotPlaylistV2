import Vue from 'vue';
import Router from 'vue-router';

import SigIn from '../components/User/signIn';
import SignUp from '../components/User/signUp';

import Home from '../components/Home';

import SearchResults from '../components/Search/index';
import AlbumAndArtistResult from '../components/Search/AlbumAndArtistResult';
import RenderAll from '../components/Search/displayAll';

import PlaylistTable from '../components/Playlist/playlistTable';
import SavedPlaylists from '../components/Playlist/playlistSaved';
import Landing from '../components/Landing/landing';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/search',
          component: SearchResults,
          children: [
            {
              path: '/search/:query/',
              component: AlbumAndArtistResult
            },
            {
              path: '/search/:query/all/:type',
              component: RenderAll
            }
          ]
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
    },
    {
      path: '/landing',
      name: 'Landing',
      component: Landing
    }
  ],
  mode: 'history'
});
