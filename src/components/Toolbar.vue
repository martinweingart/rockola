<template>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon @click="$emit('menu')"></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Rockola Music Player</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon
      v-show="!show_filter"
      @click="show_filter = true"
    >
      <v-icon>search</v-icon>
    </v-btn>

    <transition name="slide">
      <v-text-field
        v-show="show_filter"
        placeholder="Search..."
        hide-details
        single-line
        prepend-icon="search"
        append-icon="close"
        :value="value"
        @click:append="clear"
        @input="$emit('input', $event)"
      ></v-text-field>      
    </transition>
  </v-toolbar>
</template>

<script>
export default {
    name: 'Toolbar',

    props: ['value'],

    data() {
      return {
        show_filter: false
      }
    },

    methods: {
      clear: function() {
        this.show_filter = false;
        this.$emit('input', '');
      }
    }

}
</script>

<style>
.slide-enter-active {
  transition: all .5s ease;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
}
</style>
