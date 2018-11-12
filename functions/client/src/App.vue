<template>
  <v-app>
    <router-view></router-view>  
  </v-app> 
</template>

<script>
import Home from './components/Home';
import * as firebase from 'firebase';

export default {
  name: 'App',
  components: {
    Home
  },
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAJkYNu0OoZ-6tgwh4tEUg-R-FEr7OIhso',
      authDomain: 'spotplaylist-dev.firebaseapp.com',
      databaseURL: 'https://spotplaylist-dev.firebaseio.com',
      projectId: 'spotplaylist-dev',
      storageBucket: ' spotplaylist-dev.appspot.com'
    })
  }
}
</script>



