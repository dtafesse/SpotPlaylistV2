<template>
  <div>
    <v-navigation-drawer temporary v-model="sideNav" clipped app>
      <v-list dense>
        <v-list-tile v-for="item in menuItem" :key="item.title" @click="routeItem(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed flat dark color="primary">
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title class="title mr-4">
        <router-link to="/saved/playlists" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>

      <!-- SEARCH BAR -->
      <searchBar @onHideTitle="onHideTitle"/>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItem"
          :key="item.title"
          :to="item.link"
          @click="routeItem(item)"
        >
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
// import searchBar from './searchBar';
import searchBar from "./searchTextField";

export default {
  name: "navBar",
  components: {
    searchBar
  },
  data() {
    return {
      sideNav: false,
      hideTitle: false
    };
  },
  computed: {
    menuItem() {
      let menuItemIcons = [
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "face", title: "Sign Up", link: "/signup" }
      ];

      if (this.userIsAuth) {
        menuItemIcons = [
          { icon: "exit_to_app", title: "Logout", link: "/signin" }
        ];
      }
      return menuItemIcons;
    },
    userIsAuth() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    title() {
      return this.hideTitle && this.$vuetify.breakpoint.xs
        ? ""
        : "Playlist Generator 3000";
    }
  },
  methods: {
    onHideTitle(value) {
      this.hideTitle = value;
    },
    routeItem(item) {
      if (item.title === "Sign In") {
        this.signIn();
      } else if (item.title === "Sign Up") {
        this.signUp();
      } else {
        this.logout();
      }
    },
    signIn() {
      this.$router.push({ path: "/signin" });
    },
    signUp() {
      this.$router.push({ path: "/signup" });
    },
    logout() {
      this.$store.dispatch("logout");
      // inside of the dispatched func, this.$router.push({path: '/landing'});
    }
  }
};
</script>

