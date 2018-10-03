<template>
<v-container ref="container">
    <track-list
        :tracks="tracks"
    ></track-list>
</v-container>
</template>

<script>
import api from '@/services/api'
import TrackList from '@/components/tracks/TrackList'

export default {
    name: 'Tracks',

    props: {
        filter: String
    },

    components: {
        TrackList
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
        }
    }

}
</script>

<style>

</style>
