<!-- 单条展开组件 -->
<template>
    <ul class="expand-down">
        <li class="expand-down-block" v-for="(item, index) in expands" :key="index">
            <div class="expand-down-title" @click="open(item)">
                <span>{{item.title}}</span>
                <i v-show="!item.expand && item.desc" class="iconfont arrow-down">&#xe774;</i>
                <i v-show="item.expand && item.desc" class="iconfont arrow-up">&#xe774;</i>
                <span class="expand-down-mark" v-show="!item.desc && item.mark">{{item.mark}}</span>
            </div>
            <!-- <div v-show="(data.length - 1 !== index) || ((data.length - 1 === index) && item.expand)" class="separate-line"></div> -->
            <div v-show="item.expand && item.desc" class="expand-down-desc" v-html="item.desc"></div>
        </li>
    </ul>
</template>

<script>
export default {
    name: "ExpandDown",
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        title: {
            type: String,
            default: function() {
                return 'title';
            }
        },
        desc: {
            type: String,
            default: function() {
                return 'desc';
            }
        },
        mark: {
            type: String,
            default: function() {
                return 'mark';
            }
        },
    },
    data() {
        return {
            expands: []
        };
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {
                this.expands = [];
                value && value.forEach((item, index) => {
                    let obj = {
                        title: item[this.title],
                        desc: item[this.desc] && item[this.desc].replace(/\n/g, "<br>"),
                        mark: item[this.mark]
                    };
                    this.expands.push(obj);
                });
            }
        }
    },
    mounted() {},
    methods: {
        open(item) {
            if (item.desc) {
                item.expand = !item.expand;
                this.$forceUpdate();
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.expand-down {
    width: 100%;
    padding: 0 .12rem;
}

.expand-down-block {
    width: 100%;
}

.expand-down-title {
    padding: .12rem .2rem .12rem .12rem;
    font-size: .14rem;
    color: #2A2A2A;
    line-height: .19rem;
    cursor: pointer;
}

.expand-down .arrow-down,
.expand-down .arrow-up {
    display: inline-block;
    color: #CCCCCC;
    font-size: .1rem;
    transform: rotate(90deg) translateX(-65%);
    position: absolute;
    top: 50%;
    right: 0;
}

.expand-down .arrow-up {
    transform: rotate(-90deg) translateX(65%);
}

.expand-down-mark {
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
}

.expand-down-desc {
    width: calc(100% - .27rem);
    margin-left: .27rem;
    padding: 0 0 .12rem 0;
    font-size: .14rem;
    color: #999999;
    line-height: .19rem;
    /* border-bottom: .005rem solid #DDDDDD; */
}

.separate-line {
    width: calc(100% - .29rem);
    margin-left: .29rem;
    height: .01rem;
    background-color: #DDDDDD;
}
</style>
