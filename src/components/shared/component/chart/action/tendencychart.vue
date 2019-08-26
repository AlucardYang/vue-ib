<template>
    <div class="tendency">
        <div class="tendency-top">
            <i v-if="thisNum - preNum > 0" class="iconfont tendency-type" :style="{color: color}">&#xe677;</i>
            <i v-if="thisNum - preNum === 0" class="iconfont tendency-type tendency-type-flat" :style="{color: color}">&#xe675;</i>
            <i v-if="thisNum - preNum < 0" class="iconfont tendency-type" :style="{color: color}">&#xe676;</i>
            <span>{{Math.abs(thisNum - preNum) <= 99 ? Math.abs(thisNum - preNum) : '99+'}}</span>
        </div>
        <svg v-if="thisNum - preNum > 0" class="svg-box" version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="0,0,100,60" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="30" r="4" stroke-width="2" fill="none" :style="{stroke: color}"></circle>
          <text :x="String(preNum).length > 2 ? 0 : (String(preNum).length === 2 ? 6 : x1)" y="58" fill="#000" style="font-size:130%">{{preNum <= 99 ? preNum : '99+'}}</text>
          <path d="M20 30 C65 30, 35 10, 80 10" stroke-width="2" fill="none" :style="{stroke: color}"></path>
          <circle cx="84" cy="10" r="4" stroke-width="2" fill="none" :style="{stroke: color}"></circle>
          <text :x="String(thisNum).length > 2 ? 68 : (String(thisNum).length === 2 ? 72 : x2)" y="58" fill="#000" style="font-size:130%">{{thisNum <= 99 ? thisNum : '99+'}}</text>
          <path d="M84 14 L84 32" stroke-width="2" stroke-dasharray="4 4" fill="none" stroke="#E2E3E4"></path>
        </svg>
        <svg v-if="thisNum - preNum === 0" class="svg-box" version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="0,0,100,60" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="20" r="4" stroke-width="2" fill="none" :style="{stroke: color}"></circle>
          <text :x="String(preNum).length > 2 ? 0 : (String(preNum).length === 2 ? 6 : x1)" y="58" fill="#000" style="font-size:130%">{{preNum <= 99 ? preNum : '99+'}}</text>
          <line x1="20" y1="20" x2="80" y2="20" stroke-width="2" :style="{stroke: color}"></line>
          <circle cx="84" cy="20" r="4" stroke-width="2" fill="none" :style="{stroke: color}"></circle>
          <text :x="String(thisNum).length > 2 ? 68 : (String(thisNum).length === 2 ? 72 : x2)" y="58" fill="#000" style="font-size:130%">{{thisNum <= 99 ? thisNum : '99+'}}</text>
        </svg>
        <svg v-if="thisNum - preNum < 0" class="svg-box" version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="0,0,100,60" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="10" r="4" stroke-width="2" fill="none" :style="{stroke: color}"></circle>
          <text :x="String(preNum).length > 2 ? 0 : (String(preNum).length === 2 ? 6 : x1)" y="58" fill="#000" style="font-size:130%">{{preNum <= 99 ? preNum : '99+'}}</text>
          <path d="M20 10 C65 10, 35 30, 80 30" stroke-width="2" fill="none" :style="{stroke: color}"></path>
          <circle cx="84" cy="30" r="4" stroke-width="2" fill="none" :style="{stroke: color}"></circle>
          <text :x="String(thisNum).length > 2 ? 68 : (String(thisNum).length === 2 ? 72 : x2)" y="58" fill="#000" style="font-size:130%">{{thisNum <= 99 ? thisNum : '99+'}}</text>
          <path d="M84 26 L84 4" stroke-width="2" stroke-dasharray="4 4" fill="none" stroke="#E2E3E4"></path>
        </svg>
    </div>
</template>

<script>
export default {
    name: "TendencyChart",
    props: {
        thisNum: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        preNum: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        color: {
            type: String,
            default: function() {
                return '#C3C3C3';
            }
        }
    },
    data() {
        return {
            x1: 11,
            x2: 79,
        };
    },
    mounted: function() {},
    methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tendency {
    width: 100%;
    text-align: right;
    background-color: #fff;
}

.tendency-top {
    display: inline-block;
    position: relative;
    text-align: right;
    padding: 0 .06rem;
    min-width: .46rem;
    height: .12rem;
    line-height: .12rem;
    border-radius: .15rem;
    box-shadow: 0px 2px 16px #eee;
    font-size: .1rem;
}

.tendency-type {
    position: absolute;
    left: 12%;
    display: inline-block;
    font-size: 0.12rem;
}

.tendency-type-flat {
    font-size: 0.1rem;
    left: -.27rem;
    top: .01rem;
}

.svg-box {
    width: 100%;
    height: 60%;
    display: block;
    /* border: 1px solid #000; */
}
</style>
