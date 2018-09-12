<template>

    <v-layout row wrap>
        <v-flex md2 xs4  v-for="album of albums" :key="album.id" class="ma-3">
            <v-card>
              <v-card-media style="max-height:150px">
                  <img
                    src="https://images-na.ssl-images-amazon.com/images/I/61vHDvFnmpL._SY355_.jpg"
                    />
              </v-card-media>
                <v-card-title class="pa-2 ma-0">
                    <div style="width:100px; white-space: nowrap;overflow:hidden;text-overflow:ellipsis;">
                        <div style="font-size:70%;">{{album.name}}</div>
                        <div style="font-size:60%">Artist</div>
                    </div>
                </v-card-title>

              <v-divider light></v-divider>

              <v-card-actions class="pa-1 ma-0">
                <v-btn icon small>
                    <v-icon>play_circle_outline</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon small>
                    <v-icon>more_vert</v-icon>
                </v-btn>                
              </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
import api from '@/services/api'

export default {
    name: 'AlbumList',

    data() {
        return {
            albums: []
        }
    },

    created: function() {
        this.update();
    },

    methods: {
        update: function() {
            api.get('/albums')
            .then(r => {
                this.albums = r.data;
            })
        }
    }

}
</script>

<style>

</style>
