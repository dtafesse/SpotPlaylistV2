<template>
    <div>
      <v-chip
        v-for="(item, index) in selectedItems"
        :key="index"
        close
        label
        class="ma-2"
        @click:close="removeSelected(index)"
      >
        <v-avatar left>
          <img 
            v-if="item.images.length > 0" 
            :src="item.images[0].url"
          >
          <v-icon v-else > 
              {{ 'person_outline' }} 
          </v-icon>
        </v-avatar>    
        {{ item.name }}
      </v-chip>
    </div>
</template>

<script>
export default {
  name: "selector",
  props: {
    selectedItems: Array
  },
  methods: {
    removeSelected(index) {
      this.$emit("onRemoveSelected", index);
    }
  }
};
</script>
