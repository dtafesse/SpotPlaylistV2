<template>
  <div>
    <v-navigation-drawer temporary v-model="sideNav" clipped app>
      <v-list dense>
        <v-list-item v-for="item in menuItem" :key="item.title" @click="routeItem(item)">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app fixed flat dark color="primary">
      <v-app-bar-nav-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-h6 mr-6">
        <router-link to="/saved/playlists" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>

      <!-- SEARCH BAR -->
      <searchBar @onHideTitle="onHideTitle"/>

      <v-toolbar-items class="ml-2 hidden-xs-only">
        <v-btn
          text
          v-for="item in menuItem"
          :key="item.title"
          @click="routeItem(item)"
        >
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
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
        { icon: "lock_open", title: "Sign In" },
        { icon: "face", title: "Sign Up" }
      ];

      if (this.userIsAuth) {
        menuItemIcons = [
          { icon: "exit_to_app", title: "Logout" }
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

