<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box" :class="{'bigger': requiredReserve.length > 15, 'biggest': requiredReserve.length > 17}">
                <div class="title-row">
                    <span class="rich-age-text">{{title1}}</span><br>
                    <span class="rich-age" :class="{'small': requiredReserve.length > 19, 'smaller': requiredReserve.length > 21, 'smallest': requiredReserve.length > 23}">{{requiredReserve}}</span>
                </div>
                <div class="title-row">
                    <span class="rich-age-text">{{title2}}</span><br>
                    <span class="rich-age" :class="{'small': requiredReserve.length > 19, 'smaller': requiredReserve.length > 21, 'smallest': requiredReserve.length > 23}">{{owedReserves}}</span>
                </div>
                <div class="title-row" style="margin-bottom: 0;">
                    <span class="orange-text">共{{toEntryYear.value}}年</span><span class="rich-age-text">{{title3}}</span><br>
                    <span class="rich-age" :class="{'small': requiredReserve.length > 19, 'smaller': requiredReserve.length > 21, 'smallest': requiredReserve.length > 23}" style="width: calc(100% - 1.54rem);">{{monthReserves}}</span>
                </div>
            </div>
        </div>
        <!-- 国家选择器 -->
        <select-picker ref="countryPicker" :data="countrys" :default="showCountry" :title="please_select_area" @updateData="updateCountrys"></select-picker>
        <!-- 大学选择器 -->
        <select-picker ref="universityPicker" :data="realUniversitys" :default="showUniversity" :title="please_select_university" :value-key="'university'" @updateData="updateUniversitys"></select-picker>
        <section v-if="showCalcContent" id="calculatorSection" class="com-scroll-y">
            <div class="calculator-content">
                <div class="bottom-main-content">
                    <div class="top-title">{{top_title}}</div>
                    <div class="select-box" @click="showCountrys">
                        <span class="select-box-text com-nowrap">{{showCountry}}</span>
                        <i class="iconfont arrow-down">&#xe77d;</i>
                    </div>
                    <div class="select-box" style="margin-bottom: .32rem;" @click="showUniversitys">
                        <span class="select-box-text com-nowrap">{{showUniversity.university}}</span>
                        <i class="iconfont arrow-down">&#xe77d;</i>
                    </div>
                    <!-- 入学年期 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title1}}</span>
                            <div class="input-box-right max">
                                <input id="universityYearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="universityYear.value" name="universityYear" :min="universityYear.min" :max="universityYear.max" :step="universityYear.step" :placeholder="universityYear.min + '-' + universityYear.max"
                                    @input="inputChange('universityYear')" @blur="inputChange('universityYear', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="universityYear.value" :min="universityYear.min" :max="universityYear.max" :interval="universityYear.step" :tooltip="false" @callback="rangeChange('universityYear')"></vue-slider>
                            <span v-for="(item, index) in universityYear.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 10 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in universityYear.values" class="irs-grid-pol" :style="{left: 100 / universityYear.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in universityYear.values" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / universityYear.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 现时费用 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title2}}</span>
                            <div class="input-box-right max">
                                <input id="chargeMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="chargeMoney.value" name="chargeMoney" :min="chargeMoney.min" :max="chargeMoney.max" :step="chargeMoney.step" :placeholder="chargeMoney.placeholder" :style="{'top': chargeMoney.inputTop, 'z-index': 1, right: '.1rem'}"
                                    @input="inputChange('chargeMoney')" @blur="inputChange('chargeMoney', 'blur')">
                                <div id="chargeMoneyShow" class="input-box-right-input" @click="inputFocus('chargeMoney')" style="right: .1rem">{{chargeMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="chargeMoney.value" :min="chargeMoney.min" :max="chargeMoney.max" :interval="chargeMoney.step" :tooltip="false" @callback="rangeChange('chargeMoney')"></vue-slider>
                            <span v-for="(item, index) in chargeMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 0.1 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in chargeMoney.values" class="irs-grid-pol" :style="{left: 100 / chargeMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in chargeMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / chargeMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 子女年齡 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title3}}</span>
                            <div class="input-box-right max">
                                <input id="nowAgeInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="nowAge.value" name="nowAge" :min="nowAge.min" :max="nowAge.max" :step="nowAge.step" :placeholder="nowAge.min + '-' + nowAge.max" @input="inputChange('nowAge')"
                                    @blur="inputChange('nowAge', 'blur')">
                                <span class="input-box-right-unit">{{age_unit}}</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="nowAge.value" :disabled="nowAge.disabled" :min="nowAge.min" :max="nowAge.max" :interval="nowAge.step" :tooltip="false" @callback="rangeChange('nowAge')"></vue-slider>
                            <span v-for="(item, index) in nowAge.values" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':age_unit)}}</span>
                            <span v-for="(item, index) in nowAge.values" class="irs-grid-pol" :style="{left: 100 / nowAge.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in nowAge.values" class="irs-grid-pol small" :class="{'display-none': index === 7}" :style="{left: 100 / nowAge.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 距離進入大學 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title4}}</span>
                            <div class="input-box-right small">
                                <input id="toEntryYearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="toEntryYear.value" name="toEntryYear" :min="toEntryYear.min" :max="toEntryYear.max" :step="toEntryYear.step" :placeholder="toEntryYear.min + '-' + toEntryYear.max"
                                    @input="inputChange('toEntryYear')" @blur="inputChange('toEntryYear', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="toEntryYear.value" :min="toEntryYear.min" :max="toEntryYear.max" :interval="toEntryYear.step" :tooltip="false" @callback="rangeChange('toEntryYear')"></vue-slider>
                            <span v-for="(item, index) in toEntryYear.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 4 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in toEntryYear.values" class="irs-grid-pol" :style="{left: 100 / toEntryYear.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in toEntryYear.values" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / toEntryYear.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 每年通脹率 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title5}}</span>
                            <div class="input-box-right">
                                <input id="inflationRateInput" class="input-box-right-input" type="number" v-model="inflationRate.value" name="inflationRate" :min="inflationRate.min" :max="inflationRate.max" :step="inflationRate.step" :placeholder="inflationRate.min + '-' + inflationRate.max"
                                    @input="inputChange('inflationRate')" @blur="inputChange('inflationRate', 'blur')" @keydown="preventNotNumber($event)" style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="inflationRate.value" :min="inflationRate.min" :max="inflationRate.max" :interval="inflationRate.step" :tooltip="false" @callback="rangeChange('inflationRate')"></vue-slider>
                            <span v-for="(item, index) in inflationRate.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in inflationRate.values" class="irs-grid-pol" :style="{left: 100 / inflationRate.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in inflationRate.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / inflationRate.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                        <div class="inflation-rate-tip">{{inflation_rate_tip}}</div>
                    </div>
                    <!-- 每年回報率 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title6}}</span>
                            <div class="input-box-right">
                                <input id="returnRateInput" class="input-box-right-input" type="number" v-model="returnRate.value" name="returnRate" :min="returnRate.min" :max="returnRate.max" :step="returnRate.step" :placeholder="returnRate.min + '-' + returnRate.max" @input="inputChange('returnRate')"
                                    @blur="inputChange('returnRate', 'blur')" @keydown="preventNotNumber($event)" style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="returnRate.value" :min="returnRate.min" :max="returnRate.max" :interval="returnRate.step" :tooltip="false" @callback="rangeChange('returnRate')"></vue-slider>
                            <span v-for="(item, index) in returnRate.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in returnRate.values" class="irs-grid-pol" :style="{left: 100 / returnRate.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in returnRate.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / returnRate.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 現有教育儲備 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title7}}</span>
                            <div class="input-box-right small">
                                <input id="assetsMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="assetsMoney.value" name="assetsMoney" :min="assetsMoney.min" :max="assetsMoney.max" :step="assetsMoney.step" :placeholder="assetsMoney.placeholder" :style="{'top': assetsMoney.inputTop, 'z-index': 1, right: '.1rem'}"
                                    @input="inputChange('assetsMoney')" @blur="inputChange('assetsMoney', 'blur')">
                                <div id="assetsMoneyShow" class="input-box-right-input" @click="inputFocus('assetsMoney')" style="right: .1rem">{{assetsMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="assetsMoney.value" :min="assetsMoney.min" :max="assetsMoney.max" :interval="assetsMoney.step" :tooltip="false" @callback="rangeChange('assetsMoney')"></vue-slider>
                            <span v-for="(item, index) in assetsMoney.values" class="owner-grid-text" :style="{left: parseInt(item) + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in assetsMoney.values" class="irs-grid-pol" :style="{left: 100 / assetsMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in assetsMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / assetsMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'28'" @getAgentInfo="getAgentInfo"></consultant-card>
            <div class="disclaimer-box">{{disclaimer_text}}</div>
        </section>
        <calculator-share ref="calculatorShare" :share-title="this.share_title" :share-des="this.share_des"></calculator-share>
    </div>
</template>

<script src="./education.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../calculator.css">

</style>

<style scoped>
.calculator-content {
    padding-top: 1.9rem;
}

.top-main-content {
    height: 1.9rem;
    background-image: linear-gradient(180deg, #3364E4 0%, #469FFF 100%);
}

.rich-age-box {
    left: .3rem;
    right: auto;
    width: calc(100% - .8rem);
    text-align: left;
}

.rich-age-box .title-row {
    width: 100%;
    margin-bottom: .04rem;
}

.rich-age-box .rich-age {
    font-size: .2rem;
    margin-top: .02rem;
    line-height: .2rem;
}

.rich-age-text {
    font-size: .14rem;
    color: #FFFFFF;
    line-height: .14rem;
}

.orange-text {
    font-size: .14rem;
    color: #FFCF3C;
    line-height: .2rem;
    font-weight: bold;
}

.input-box-row-left,
.input-box-row-right {
    width: 44%;
    float: left;
    height: 0.4rem;
}

.input-box-row-right {
    margin-left: 2%;
    width: 54%;
}

.rich-age-box.bigger {
    left: .3rem;
    width: calc(100% - .6rem);
}

.rich-age-box.biggest {
    left: .2rem;
    width: calc(100% - .4rem);
}

.rich-age-box .rich-age.small {
    font-size: .2rem;
}

.rich-age-box .rich-age.smaller {
    font-size: .18rem;
}

.rich-age-box .rich-age.smallest {
    font-size: .16rem;
}

.input-box-bottom {
    margin-bottom: .12rem;
}

.top-title {
    font-size: .2rem;
    color: #2A2A2A;
    font-weight: bold;
    line-height: .24rem;
    margin-bottom: .16rem;
}

.select-box {
    position: relative;
    width: 100%;
    height: .4rem;
    line-height: .38rem;
    border: 1px solid #DDDDDD;
    border-radius: .08rem;
    margin-bottom: .16rem;
    font-size: .16rem;
    color: #2A2A2A;
    padding: 0 .12rem 0 .12rem;
    cursor: pointer;
}

.select-box-text {
    display: inline-block;
    width: calc(100% - .2rem);
}

.arrow-down {
    color: #DDDDDD;
    position: absolute;
    top: 0;
    right: .12rem;
}
</style>
