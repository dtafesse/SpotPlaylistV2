<template>
  <v-app>
    <v-main>
      <v-container fluid>
          <v-layout align-center justify-center wrap fill-height>
            <v-flex class="hidden-sm-and-down" xs12 sm6>
              <v-layout wrap>
                <v-flex xs12>
                  <div class="leftPanel" :style="{backgroundImage:'url(' +item.src+')'}">
                    <div
                      class="titleText text-h4 font-weight-light font-italic"
                    >Welcome To Sonorous Discovery</div>
                    <div class="infoText subheading font-weight-light">
                      Playlist Generator 3000 changes the you the way
                      you find music. You won't have to anymore.
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm6>
              <router-view></router-view>
            </v-flex>
          </v-layout>
      </v-container>
    </v-main>
  </v-app>

</template>

<script>
export default {
  name: "landing",
  data() {
    return {
      item: { src: require("@/assets/images/splashPageImage.png") }
    };
  },
  methods: {
    login() {
      this.$router.push("/signin");
    },
    signUp() {
      this.$router.push("/signup");
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.leftPanel {
  height: 18em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.infoText {
  width: 60%;
  color: #80d8ff;
}
.titleText {
  align-self: center;
  color: #00b0ff;
}
</style>
