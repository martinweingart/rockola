import Store from '@/store'

export default {
    elem: null,
    repeat: false,
    repeat_one: false,
    shuffle: false,

    init: function(dom_elem) {
        this.elem = dom_elem;
        this.elem.onended = () => {
            this.next()            
        }; 
    },

    play: function() {
        if (Store.state.queue.length > 0) 
            this.elem.src = Store.state.queue[Store.state.playing].src;
        else return;

        this.elem.play();
    },

    previous: function() {
        if (Store.state.playing > 0) {
            Store.commit('queue_decrement');
            this.play();
        }        
    },

    next: function() {
        if (this.repeat_one) {
            this.play();
        }        
        if (this.shuffle) {
            let random = Math.floor((Math.random() * Store.state.queue.length-1) + 1);
            Store.commit('set_playing', random);
            this.play();
        }
        else if (this.repeat && Store.state.playing === Store.state.queue.length-1) {
            Store.commit('set_playing', 0);
            this.play();
        }
        else if (Store.state.playing < Store.state.queue.length - 1) {
            Store.commit('queue_increment');
            this.play();
        }
    },

    setRepeat: function() {
        this.repeat_one = false;
        this.repeat = true;
    },

    setRepeatOne: function() {
        this.repeat_one = true;
        this.repeat = false;
    },

    setRepeatOff: function() {
        this.repeat = false;
        this.repeat_one = false;
    },

    setShuffle: function(shuffle) {
        this.shuffle = shuffle;
    }
}