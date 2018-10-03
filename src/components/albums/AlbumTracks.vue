<template>
<v-container fluid ref="container" class="pa-0 ma-0">
    <track-list 
        avatar
        :avatar-src="getAlbumArt(album.id)"
        :avatar-text="album.name"
        :tracks="album.tracks"
    ></track-list>
</v-container>
</template>

<script>
import { getAlbumArt } from '@/utils'
import api from '@/services/api'
import TrackList from '@/components/tracks/TrackList'

export default {
    name: 'AlbumTracks',

    props: {
        id: Number
    },

    components: {
        TrackList
    },

    data() {
        return {
            album: null
        }
    },

    watch: {
        id: function() {
            this.update();
        }
    },

    created: function() {
        this.update();
    },

    methods: {
        update: function() {
            if (this.id != null) {
                api.get(`/albums/${this.id}`)
                .then(r => this.album = r.data);
            }
        },

        getAlbumArt: function(id) {
            return getAlbumArt(id);
        },        
    }

}
</script>

<style>

</style>
