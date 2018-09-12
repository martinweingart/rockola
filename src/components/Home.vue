<template>
  <v-container>
    <menu-lateral v-model="menu_lateral"></menu-lateral>

    <toolbar @menu="menu_lateral = true"></toolbar>

    <v-tabs
      centered
      color="primary"
      dark
      icons-and-text
    >
      <v-tabs-slider color="white"></v-tabs-slider>

      <v-tab href="#tab-tracks">
        Tracks
        <v-icon>library_music</v-icon>
      </v-tab>
      
      <v-tab href="#tab-artists">
        Artists
        <v-icon>people</v-icon>
      </v-tab>

      <v-tab href="#tab-albums">
        Albums
        <v-icon>album</v-icon>
      </v-tab>

      <v-tab href="#tab-genres">
        Genres
        <v-icon>style</v-icon>
      </v-tab>

      <v-tab-item id="tab-tracks" style="overflow:auto">
        <v-card flat>
          <tracks></tracks> 
        </v-card>
      </v-tab-item>
    </v-tabs>    

    <player-bottom></player-bottom>

  </v-container>
</template>

<script>
import MenuLateral from '@/components/MenuLateral'
import Toolbar from '@/components/Toolbar'
import PlayerBottom from '@/components/PlayerBottom'
import Tracks from '@/components/Tracks'

export default {
  name: 'Home',

  components: {
    MenuLateral,
    Tracks,
    Toolbar,
    PlayerBottom
  },

  data() {
    return {
      menu_lateral: false
    }
  }
  
}
</script>

<style scoped>

</style>
