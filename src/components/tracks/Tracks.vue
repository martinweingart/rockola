<template>
<v-container ref="container">
    <v-list two-line subheader dense>
        <v-list-tile
            v-for="(track,i) in tracks"
            :key="i"
            avatar
        >
            <v-list-tile-action>
                <v-btn icon ripple @click="play(track)">
                    <v-icon>play_circle_filled</v-icon>
                </v-btn>               
            </v-list-tile-action>

            <v-list-tile-action>
                <v-btn icon small @click="add(track)">
                    <v-icon>playlist_add</v-icon>
                </v-btn>               
            </v-list-tile-action>

            <v-list-tile-content>
                <v-list-tile-title>{{ track.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ track.artist.name }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
                <v-btn icon ripple>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
    </v-list>
</v-container>
</template>

<script>
import { getTrackUrl } from '@/utils'
import api from '@/services/api'
import player from '@/services/player'

export default {
    name: 'Tracks',

    data() {
        return {
            offset: 0,
            tracks: []
        }
    },

    created: function() {
        this.update();
    },

    mounted: function() {
        let content = document.getElementById('content');
        content.onscroll = () => {
            let bottom = content.scrollTop + content.offsetHeight === this.$refs.container.offsetHeight;
            if (bottom) {
                this.offset += 20;
                this.update();
            }
        };
    },

    methods: {
        update: function(offset) {
            let url = `/tracks?limit=20&offset=${this.offset}`;
            api.get(url)
            .then(r => {
                this.tracks = this.tracks.concat(r.data);
            })
        },

        play: function(track) {
            this.$store.commit('queue_clear');
            track.src= getTrackUrl(track.id);
            this.$store.commit('queue_add', track);
            player.play();
        },
        
        add: function(track) {
            track.src= getTrackUrl(track.id);
            this.$store.commit('queue_add', track);
        }
    }

}
</script>

<style>

</style>
