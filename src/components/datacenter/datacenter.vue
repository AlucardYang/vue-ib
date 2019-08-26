<template>
    <router-view>
    </router-view>
</template>

<script>
import touchMove from '../../components/shared/service/touchmove.js';

export default {
    name: "DataCenter",
    data() {
        return {};
    },
    components: {},
    mounted() {
        this.addTouchMove();
    },
    methods: {
        addTouchMove() {
            const _this = this;
            touchMove.listenTouchDirection(document, false, function(event) {
                _this.appFn.commonFn('touchMoveUp', {
                    scrollTop: document.querySelector('.com-scroll-y') && document.querySelector('.com-scroll-y').scrollTop
                });
            }, null, function(event) {
                _this.appFn.commonFn('touchMoveDown', {
                    scrollTop: document.querySelector('.com-scroll-y') && document.querySelector('.com-scroll-y').scrollTop
                });
            }, null);
        }
    }
};
</script>
