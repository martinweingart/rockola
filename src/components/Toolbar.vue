<template>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon @click="$emit('menu')"></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Rockola Music Player</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
    name: 'Toolbar'

}
</script>

<style>

</style>
