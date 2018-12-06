<template>
  <v-layout>
    <v-flex xs12>
      <v-form>
        <v-autocomplete
          v-model="model"
          :items="queryResults"
          :loading="isLoading"
          :search-input.sync="search"
          hide-no-data
          hide-details
          chips
          clearable
          flat
          color="cyan darken-3"
          item-text="name"
          item-value="query"
          placeholder="Search ..."
          append-outer-icon="search"
          @click:append-outer="onSearchClick"
          return-object
          multiple
          @input="onInputModelChange"
        >
          <template slot="no-data">
            <v-list-tile>
              <v-list-tile-title>
                Search for your favorite
                <strong>Artist or Album</strong>
              </v-list-tile-title>
            </v-list-tile>
          </template>
          <template slot="selection" slot-scope="data">
            <v-chip :selected="data.selected" class="chip--select-multi" label>
              <v-avatar>
                <img v-if="data.item.images.length > 0" :src="data.item.images[0].url">
                <v-icon v-else>{{ 'person_outline' }}</v-icon>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template slot="item" slot-scope="{ item }">
            <template v-if="typeof item !== 'object'">
              <v-list-tile-content v-text="item.name"></v-list-tile-content>
            </template>

            <template v-else>
              <v-list-tile-avatar v-if="item.images">
                <img v-if="item.images.length > 0" :src="item.images[0].url">
                <v-icon v-else>{{ 'person_outline' }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.type"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-autocomplete>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from "lodash";

export default {
  name: "searchBar",
  data: function() {
    return {
      model: null,
      search: null
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    },
    queryResults() {
      // return this.$store.getters.getQueryResult.map(artist => {
      //     const artistName = artist.name;
      //     return Object.assign({}, artist, { artistName });
      // });
      return this.$store.getters.getQueryResult;
    }
  },
  watch: {
    search(val) {
      if (val && val !== this.model && !this.isLoading) {
        this.searchApiRequest(val);
      }
    }
  },
  methods: {
    // debounce takes the inner function and calls it/runs it every 250 miliseconds,
    // comment out to see difference
    searchApiRequest: _.debounce(function(val) {
      // this.$store.dispatch('searchArtistId', val);
      this.$store.dispatch("searchForQueryString", val);
    }, 300),

    onInputModelChange() {
      if (this.model) {
        // this.$store.dispatch('setSelectedArtistId', this.model.id);
        // this.$store.dispatch('searchArtistTopTrack');
        // this.$router.push({path: '/Playlist'});
      }
    },
    onSearchClick() {
      if (this.model) {
        console.log(this.model);
      }
    }
  }
};
</script>
