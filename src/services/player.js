import Store from '@/store'

export default {
    elem: null,

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
            this.play(Store.state.queue[Store.state.playing].src);
        }        
    },

    next: function() {
        if (Store.state.playing < Store.state.queue.length - 1) {
            Store.commit('queue_increment');
            this.play(Store.state.queue[Store.state.playing].src);
        }
    }
}