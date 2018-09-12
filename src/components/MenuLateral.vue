<template>
    <v-navigation-drawer
      :value="value"
      absolute
      temporary
      @input="$emit('input', $event)"
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="@/assets/profile.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Martín W.</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Configuración</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>    
</template>

<script>
export default {
    props: {
        value: Boolean
    }
}
</script>

<style>

</style>
