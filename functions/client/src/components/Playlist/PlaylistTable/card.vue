<template>
    <v-flex sm5 v-if="$vuetify.breakpoint.smAndUp">
        <v-card 
            v-if="currentlySelectedTrack" 
            max-width="380px"
        >          
            <v-layout>
                <v-flex xs12 mt-2 >
                    <v-img 
                        :src="currentlySelectedTrack.album.images[0].url"
                        contain
                        height="320px"
                    >
                    </v-img>
                </v-flex>
            </v-layout> 
            <v-divider light></v-divider>    
            <v-card-actions>
                <v-btn  
                    flat
                    @click="$emit('onPlay')"
                    color="primary"
                    >Play 
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn 
                    flat
                    @click="$emit('onShuffle')"
                    color="primary"
                    >Shuffle
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn  
                    v-if="isUserLoggedIn"
                    flat
                    @click="$emit('onSpotifyButton')"
                    color="#1DB954"
                    > {{ spotifyButtonValue }}
                </v-btn>
            </v-card-actions>  
        </v-card>           
    </v-flex>
</template>

<script>
export default {
    name: 'card',
    props: {
        currentlySelectedTrack: Object,
        isUserLoggedIn: Boolean,
        spotifyButtonValue: String 
    }

}
</script>

