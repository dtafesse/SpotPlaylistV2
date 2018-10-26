<template>
    <v-list two-line>
        <v-subheader>{{ type }}</v-subheader>
        <template 
            v-for="(item, index) in limitItemSize" >
            <v-list-tile 
                :key="item.id" 
                avatar ripple 
                @click="onClick(index)" 
                class="listItem"
            >
                <v-list-tile>
                    <v-avatar 
                        v-bind="{ ['tile']: imageType }"
                        size="55"
                    >
                        <img 
                            v-if="item.images.length > 0" 
                            :src="item.images[0].url"
                        >
                        <v-icon v-else > 
                            {{ 'person_outline' }} 
                        </v-icon>
                    </v-avatar>
                </v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title v-html="item.name"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
        <v-btn 
            v-if="showMoreButton" 
            outline color="cyan lighten-1"
            @click="onShowAllClick"
        >
            {{ moreText }}
        </v-btn>
    </v-list>
    


</template>

<script>

export default {
    name: 'category',
    props: {
        type: String,
        items: Array,
        size: Number
    },
    computed: {
        limitItemSize(){
            if(this.items){
                if(this.items.length > this.size) {
                    return this.items.slice(0, this.size);
                }else{
                    return this.items;
                }
            }
        },
        showMoreButton(){
            if(this.items){
                if(this.items.length > this.size) {
                    return true;
                }else{
                    return false;
                }
            }
        },
        moreText(){
            return this.type === "Albums" ? 'See all albums' : 'See all artists';
        },
        imageType(){
            if(this.type === "Albums"){
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        onClick(index){
            this.$emit('onClick', { 'type': this.type.toLowerCase(), 'index' : index});
        },
        onShowAllClick(){
            this.$emit('onShowAllClick', this.type.toLowerCase() );
        }
    }
}
</script>

<style scoped>
    .listItem {
        cursor: pointer;
    }
    .listItem:hover {
        background-color: rgb(228,231,234);
    }
</style>
