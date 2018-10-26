<template>
    <v-flex xs12 sm6 align-center justify-center fill-height>
        <v-list two-line>
            <v-subheader>{{ type }}</v-subheader>
            <template v-for="(item, index) in limitItemSize" >
                <v-list-tile :key="item.id" avatar ripple @click="onClick(index)" class="listItem">
                    <v-list-tile>
                        <img 
                            v-if="item.images.length > 0" :src="item.images[0].url"
                            max-width="50"
                            height="50"
                        >
                        <v-icon 
                            v-else
                            max-width="50"
                            height="50"> 
                            {{ 'person_outline' }} 
                        </v-icon>
                    </v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="item.name"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
            <v-btn 
                v-if="showMoreButton" 
                outline color="cyan lighten-1"
            >
                {{ moreText }}
            </v-btn>
        </v-list>
        

    </v-flex>
</template>

<script>
export default {
    name: 'render',
    props: {
        type: String,
        items: Array,
        size: Number
    },
    data(){
        return {
            showMoreButton: false
        };
    },
    computed: {
        limitItemSize(){
            if(this.items){
                if(this.items.length > this.size) {
                    this.showMoreButton = true;
                    return this.items.slice(0, this.size);
                }else{
                    this.showMoreButton = false;
                    return this.items;
                }
            }
        },
        moreText(){
            return this.type === "Albums" ? 'See all albums' : 'See all artists';
        }
    },
    methods: {
        onClick(index){
            this.$emit('onClick', { 'type': this.type, 'index' : index});
        }
    }
}
</script>

