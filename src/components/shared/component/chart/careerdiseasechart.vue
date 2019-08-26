<template>
    <div class="career-disease-chart" :id="refId" data-emergence="hidden">
        <div class="center-outer-circle animated slower" :class="{'fadeIn': showChart}">
            <div class="center-inner-circle">
                <div class="inner-text">
                    <span>{{title}}</span><br>
                    <span><label v-if="simply">高发疾病</label><label v-if="!simply">高發疾病</label></span>
                </div>
            </div>
            <div class="outer-circle outer-top-circle animated slower" :class="{'fadeInDown': showChart}">
                <div class="inner-text">
                    <span>{{career[0]}}</span>
                </div>
            </div>
            <div class="outer-circle outer-left-circle animated slower" :class="{'fadeInLeft': showChart}">
                <div class="inner-text">
                    <span>{{career[1]}}</span>
                </div>
            </div>
            <div class="outer-circle outer-right-circle animated slower" :class="{'fadeInRight': showChart}">
                <div class="inner-text">
                    <span>{{career[2]}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "CareerDiseaseChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "careerDiseaseChart";
            }
        },
        title: {
            type: String,
            default: function() {
                return "";
            }
        },
        career: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {
            showChart: false
        };
    },
    methods: {
        showAnimate: function(state) {
            this.showChart = state;
        }
    },
    beforeCreate() {
        CommonJS.loadStyle('https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css');
    },
    created: function() {},
    watch: {
        career: function(val, oldVal) {
            //console.log(val); 
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.career-disease-chart {
    widows: 100%;
    height: 1.86rem;
    position: relative;
}

.center-outer-circle {
    width: 1.25rem;
    height: 1.25rem;
    border: 0.01rem solid #89e7c4;
    border-radius: 50%;
    padding: 0.185rem;
    position: absolute;
    top: 26%;
    left: calc(50% - .625rem);
}

.center-inner-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-image: linear-gradient(131deg, #97e9cb 0%, #2adb9b 100%);
    color: #ffffff;
    font-size: 0.13rem;
    line-height: 0.18rem;
}

.inner-text {
    display: inline-block;
    vertical-align: middle;
    width: 80%;
    letter-spacing: 0;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
}

.outer-circle {
    width: 0.58rem;
    height: 0.58rem;
    border: 0.01rem solid #89e7c4;
    border-radius: 50%;
    color: #3DDDA3;
    font-size: 0.12rem;
    line-height: 0.16rem;
    background-color: #fff;
}

.outer-top-circle {
    position: absolute;
    top: -36%;
    left: calc(50% - .29rem);
}

.outer-left-circle {
    position: absolute;
    top: 60%;
    left: -27%;
}

.outer-right-circle {
    position: absolute;
    top: 60%;
    left: 80%;
}
</style>
