<template>
<v-container ref="container">
    <v-list two-line subheader dense>
        <v-list-tile
            v-for="(track,i) in tracks"
            :key="i"
            avatar
        >
            <v-list-tile-action style="min-width:40px">
                <v-btn small icon ripple @click="play(track)" class="ma-0 pa-0">
                    <v-icon>play_circle_filled</v-icon>
                </v-btn>               
            </v-list-tile-action>

            <v-list-tile-action style="min-width:40px">
                <v-btn icon small ripple @click="add(track)" class="ma-0 pa-0">
                    <v-icon>playlist_add</v-icon>
                </v-btn>               
            </v-list-tile-action>

            <v-list-tile-content>
                <v-list-tile-title>{{ track.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ track.artist.name }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
                <v-btn icon ripple @click="download(track.id)">
                    <v-icon>cloud_download</v-icon>
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

    props: {
        filter: String
    },

    data() {
        return {
            offset: 0,
            tracks: []
        }
    },

    watch: {
        filter: function() {
            this.offset = 0;
            this.update();
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
        update: function() {
            let url = `/tracks?limit=20&offset=${this.offset}`;
            if (this.filter) url+= `&q=${this.filter}`;

            api.get(url)
            .then(r => {
                if (this.offset === 0) this.tracks = r.data;
                else this.tracks = this.tracks.concat(r.data);
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
        },

        download: function(id) {
           window.open(getTrackUrl(id));
        }
    }

}
</script>

<style>

</style>
