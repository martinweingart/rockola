<template>
<v-card>    
    <v-card-title class="black white--text">
        Play Queue

        <v-divider></v-divider>
        <v-btn icon dark @click.native="$emit('close')">
            <v-icon>close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text style="max-height: 300px;">
        <v-list two-line subheader dense>
            <v-list-tile
                :class="$store.state.playing == i ? 'grey lighten-2' : ''"
                v-for="(track, i) in $store.state.queue"
                :key="i"
                avatar
                @click=""
            >
                <v-list-tile-content @click="play(i)">
                    <v-list-tile-title>{{ track.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ track.artist.name }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                    <v-btn icon ripple @click="remove(i)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-list-tile-action>            
            </v-list-tile>    
        </v-list>          
    </v-card-text>        
    </v-card>    
</template>

<script>
import player from '@/services/player'

export default {
    name: 'Queue',
    methods: {
        play: function(index) {
            this.$store.commit('set_playing', index);
            player.play();
        },

        remove: function(index) {
            this.$store.commit('queue_remove', index);
        }
    }

}
</script>

<style>

</style>
