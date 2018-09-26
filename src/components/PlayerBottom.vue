<template>
<v-container class="pa-0">
    <v-layout style="background: #ECEFF1;" :wrap="$options.isMobile()">
        <v-btn icon small @click="$emit('openQueue')" title="Open Queue">
            <v-icon>open_in_browser</v-icon>
        </v-btn>

        <v-btn icon small @click="playPrev" title="Play Previous">
            <v-icon>skip_previous</v-icon>
        </v-btn>

        <audio
            ref="player"
            controls
            type="audio/mpeg"
            :style="$options.isMobile() ? 'width:70%' : 'width:100%'"
        ></audio>

        <v-btn icon small @click="playNext" title="Play Next">
            <v-icon>skip_next</v-icon>
        </v-btn>

        <v-btn icon small @click="toggleRepeat" title="Repeat">
            <v-icon :class="!active.repeat && !active.repeat_one ? 'grey--text' : ''">
                {{ active.repeat_one ? 'repeat_one' : 'repeat'}}
            </v-icon>
        </v-btn>

        <v-btn icon small @click="toggleShuffle" title="Shuffle">
            <v-icon :class="!active.shuffle ? 'grey--text' : ''">shuffle</v-icon>
        </v-btn>

        <v-menu offset-y>
        <v-btn
            small
            title="Save List"
            slot="activator"
            icon
        >
            <v-icon>save</v-icon>
        </v-btn>
        <v-list>
            <v-list-tile v-if="$store.state.playlist" @click="save">
                <v-list-tile-title>
                    Guardar '{{ $store.state.playlist }}''
                </v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="saveAs">
                <v-list-tile-title>
                    Guardar como...
                </v-list-tile-title>
            </v-list-tile>
        </v-list>
        </v-menu>      

        <v-btn icon small @click="download" title="Download List">
            <v-icon>cloud_download</v-icon>
        </v-btn>              
    </v-layout>
</v-container>
</template>

<script>
import config from '@/config'
import { download, isMobile } from '@/utils'
import player from '@/services/player'

export default {
    name: 'PlayerBottom',

    data() {
        return {
            active: {
                shuffle: false,
                repeat: false,
                repeat_one: false
            }
        }
    },

    isMobile: isMobile,

    mounted: function() {
        player.init(this.$refs.player);
    },

    methods: {
        playPrev: function() {
            player.previous();
        },

        playNext: function() {
            player.next();
        },

        toggleRepeat: function() {
            if (this.active.repeat_one) {
                this.active.repeat_one = false;
                player.setRepeatOff();
            }
            else if (this.active.repeat) {
                this.active.repeat_one = true;
                this.active.repeat = false;
                player.setRepeatOne();
            }
            else { 
                this.active.repeat = true;
                player.setRepeat();
            }

        },

        toggleShuffle: function() {
            this.active.shuffle = !this.active.shuffle;
            player.setShuffle(this.active.shuffle);
        },

        save: function() {
            let playlists_saved = JSON.parse(this.$localStorage.get('rockola_playlist'));
            let playlist_index = playlists_saved.findIndex(p => p.name == this.$store.state.playlist);
            playlists_saved[playlist_index].tracks = this.$store.state.queue;

            this.$localStorage.set('rockola_playlist', JSON.stringify(playlists_saved))
            this.$store.commit('playlists_set', playlists_saved);
        },

        saveAs: function() {
            this.$emit('save');
        },

        download: function() {
            let tracks = this.$store.state.queue.map(t => `track[]=${t.id}`).join('&');
            download(`${config.files}/tracks/download?${tracks}`)
        }
    }

}
</script>

<style>
</style>
