<template>
    <div v-if="params.show" class="blue-loading" :class="{'blue-loading-mask': params.showMask}" :style="{background: params.bg}">
        <i class="blue-loading-circle"></i>
    </div>
</template>

<script>
export default {
    name: "BlueRotate",
    props: {
        params: {
            type: Object,
            default: function() {
                return {
                    show: false,
                    showMask: false,
                    bg: "transparent"
                };
            }
        }
    },
    data() {
        return {};
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {}
        }
    },
    mounted() {},
    methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blue-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.blue-loading-mask {
    background-color: rgba(204, 204, 204, .2);
}

.blue-loading-circle {
    position: relative;
    width: .2rem;
    height: .4rem;
    animation: rotate360 2s infinite linear;
}

.blue-loading-circle:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 50%;
    border-radius: 50%;
    background-color: #6287EA;
    animation: scale_little 2s infinite;
}

.blue-loading-circle:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 50%;
    border-radius: 50%;
    background-color: #6287EA;
    animation: scale_big 2s infinite;
}

@keyframes rotate360 {
    0% {
        transform: rotateZ(90deg);
    }
    100% {
        transform: rotateZ(450deg);
    }
}

@keyframes scale_little {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.2);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes scale_big {
    0% {
        transform: scale(0.2);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(0.2);
    }
}
</style>
