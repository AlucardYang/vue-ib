<!-- 页面下拉组件 -->
<template>
    <div v-if="data.length > 1" ref="dropdown" class="select-dropdown">
        <div class="dropdown-top com-nowrap active-hover" @click="open">
            <span v-show="!showDropdown" class="arrow-down"></span>
            <span v-show="showDropdown" class="arrow-up"></span>
            <span>{{defaultName}}</span>
        </div>
        <ul v-show="showDropdown" class="dropdown-bottom">
            <li class="dropdown-block" v-for="(item, index) in data" :key="index" @click="selectChange(item)">{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "SelectDropdown",
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        default: {
            type: null,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            showDropdown: false,
            defaultName: ''
        };
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {
                value.forEach((item, index) => {
                    if (this.default === item.id) {
                        this.defaultName = item.name;
                    }
                });
            }
        },
        default: {
            handler: function(value, oldvalue) {
                this.data.forEach((item, index) => {
                    if (value === item.id) {
                        this.defaultName = item.name;
                    }
                });
            }
        }
    },
    mounted() {
        const _this = this;
        document.querySelector('.com-scroll-y').addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                _this.showDropdown = false;
            }
        });
    },
    methods: {
        open() {
            this.showDropdown = !this.showDropdown;
            document.querySelector('.com-scroll-y').scrollTop = this.$refs.dropdown.getBoundingClientRect().top + document.querySelector('.com-scroll-y').scrollTop - 90;
        },
        close() {
            this.showDropdown = false;
        },
        selectChange(value) {
            this.close();
            this.$emit('updateData', value);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select-dropdown {
    width: 100%;
    padding: .12rem .36rem;
    font-size: .15rem;
    color: #2A2A2A;
}

.dropdown-top {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    height: .36rem;
    line-height: .36rem;
    background-color: #3364E4;
    border-radius: .04rem;
    padding: 0 .4rem 0 .2rem;
    color: #FFFFFF;
}

.arrow-down,
.arrow-up {
    border: .04rem solid transparent;
    border-top: .04rem solid #FFFFFF;
    position: absolute;
    right: .2rem;
    top: .15rem;
}

.arrow-up {
    border-top: .04rem solid transparent;
    border-bottom: .04rem solid #FFFFFF;
    top: .12rem;
}

.dropdown-bottom {
    cursor: pointer;
    position: absolute;
    top: .48rem;
    left: .36rem;
    background-color: #FFFFFF;
    z-index: 100;
    width: calc(100% - .72rem);
    box-shadow: 0 .01rem .16rem 0 rgba(0, 0, 0, 0.14);
    border-radius: 0 0 .04rem .04rem;
}

.dropdown-block {
    width: 100%;
    line-height: .2rem;
    padding: .16rem .2rem;
}

.dropdown-block.current,
.dropdown-block:hover {
    color: #3364E4;
}
</style>
