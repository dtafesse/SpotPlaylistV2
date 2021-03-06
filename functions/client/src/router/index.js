import Vue from "vue";
import Router from "vue-router";

import SignIn from "../components/User/signIn";
import SignUp from "../components/User/signUp";

import Home from "../components/Home";
import SpotifyAuthHandler from "../components/User/spotifyAuthHandler";

import SearchResults from "../components/Search/index";
import AlbumAndArtistResult from "../components/Search/AlbumAndArtistResult";
import RenderAll from "../components/Search/displayAll";

import PlaylistTable from "../components/Playlist/PlaylistTable/index";
import SavedPlaylists from "../components/Playlist/PlaylistSaved/index";
import Landing from "../components/Landing/landing";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing,
      redirect: "/signin",
      children: [
        {
          path: "/signin",
          name: "Signin",
          component: SignIn
        },
        {
          path: "/signup",
          name: "Signup",
          component: SignUp
        }
      ]
    },
    {
      path: "/oauth/callback",
      name: "spotifyAuthHandler",
      component: SpotifyAuthHandler
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
      children: [
        {
          path: "/search",
          component: SearchResults,
          children: [
            {
              path: "/search/:query/",
              component: AlbumAndArtistResult
            },
            {
              path: "/search/:query/all/:type",
              component: RenderAll
            }
          ]
        },
        {
          path: "/playlist",
          component: PlaylistTable
        },
        {
          path: "/saved/playlists",
          component: SavedPlaylists
        }
      ]
    }
  ],
  mode: "history"
});
