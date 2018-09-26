<template>
<v-layout>
    <v-flex xs12>
        <template v-for="album of albums">
            <album-tracks :id="album.id" :key="album.id"></album-tracks>
            <v-divider :key="`divider-${album.id}`"></v-divider>
        </template>
    </v-flex>
</v-layout>
</template>

<script>
import api from '@/services/api'
import AlbumTracks from '@/components/albums/AlbumTracks'

export default {
    name: 'ArtistTracks',

    props: {
        artist: Number
    },

    components: {
        AlbumTracks
    },

    data() {
        return {
            offset: 0,
            albums: []
        }
    },

    watch: {
        artist: function() {
            this.update();
        }
    },

    created: function() {
        this.update();
    },

    methods: {
        update: function() {
            if (this.artist != null) {
                api.get(`/artists/${this.artist}`)
                .then(r => {
                    this.albums = r.data.albums;
                })
                .catch(e => console.error(e));
            }
        }
    }

}
</script>

<style>

</style>
