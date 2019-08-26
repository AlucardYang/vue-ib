<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box">
                <div class="title-row">
                    <span class="rich-age-text">{{title1}}</span><br>
                    <span class="rich-age">{{requiredReserve}}</span>
                </div>
                <div class="title-row">
                    <span class="rich-age-text">{{title2}}</span><br>
                    <span class="rich-age">{{owedReserves}}</span>
                </div>
                <div class="title-row" style="margin-bottom: 0;">
                    <span class="rich-age-text">{{title3}}</span><br>
                    <span class="rich-age">{{monthReserves}}</span>
                </div>
            </div>
        </div>
        <section v-if="showCalcContent" id="calculatorSection" class="com-scroll-y">
            <div class="calculator-content">
                <div class="bottom-main-content">
                    <div class="bottom-main-tip">{{top_tip}}</div>
                    <!-- 當前年齡 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title1}}</span>
                            <div class="input-box-right max">
                                <input id="nowAgeInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="nowAge.value" name="nowAge" :min="nowAge.min" :max="nowAge.max" :step="nowAge.step" :placeholder="nowAge.min + '-' + nowAge.max" @input="inputChange('nowAge')"
                                    @blur="inputChange('nowAge', 'blur')">
                                <span class="input-box-right-unit">{{age_unit}}</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="nowAge.value" :disabled="nowAge.disabled" :min="nowAge.min" :max="nowAge.max" :interval="nowAge.step" :tooltip="false" @callback="rangeChange('nowAge')"></vue-slider>
                            <span v-for="(item, index) in nowAge.values" class="owner-grid-text" :style="{left: parseInt(item) * 1.427 + 0.4 + '%'}">{{item + ((index === 0)?'':age_unit)}}</span>
                            <span v-for="(item, index) in nowAge.values" class="irs-grid-pol" :style="{left: 100 / nowAge.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in nowAge.values" class="irs-grid-pol small" :class="{'display-none': index === 7}" :style="{left: 100 / nowAge.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 預期退休年齡 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title2}}</span>
                            <div class="input-box-right small">
                                <input id="retiredAgeInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="retiredAge.value" name="retiredAge" :min="retiredAge.min" :max="retiredAge.max" :step="retiredAge.step" :placeholder="retiredAge.min + '-' + retiredAge.max"
                                    @input="inputChange('retiredAge')" @blur="inputChange('retiredAge', 'blur')">
                                <span class="input-box-right-unit">{{age_unit}}</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="retiredAge.value" :disabled="retiredAge.disabled" :min="retiredAge.min" :max="retiredAge.max" :interval="retiredAge.step" :tooltip="false" @callback="rangeChange('retiredAge')"></vue-slider>
                            <span v-for="(item, index) in retiredAge.values" class="owner-grid-text" :style="{left: parseInt(item) * 1.427 + 0.4 + '%'}">{{item + ((index === 0)?'':age_unit)}}</span>
                            <span v-for="(item, index) in retiredAge.values" class="irs-grid-pol" :style="{left: 100 / retiredAge.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in retiredAge.values" class="irs-grid-pol small" :class="{'display-none': index === 7}" :style="{left: 100 / retiredAge.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 退休生活年期 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title3}}</span>
                            <div class="input-box-right small">
                                <input id="retiredYearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="retiredYear.value" name="retiredYear" :min="retiredYear.min" :max="retiredYear.max" :step="retiredYear.step" :placeholder="retiredYear.min + '-' + retiredYear.max"
                                    @input="inputChange('retiredYear')" @blur="inputChange('retiredYear', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="retiredYear.value" :min="retiredYear.min" :max="retiredYear.max" :interval="retiredYear.step" :tooltip="false" @callback="rangeChange('retiredYear')"></vue-slider>
                            <span v-for="(item, index) in retiredYear.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 1.427 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in retiredYear.values" class="irs-grid-pol" :style="{left: 100 / retiredYear.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in retiredYear.values" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / retiredYear.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 每月退休開支 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title4}}</span>
                            <div class="input-box-right small">
                                <input id="monthExpMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="monthExpMoney.value" name="monthExpMoney" :min="monthExpMoney.min" :max="monthExpMoney.max" :step="monthExpMoney.step" :placeholder="monthExpMoney.placeholder"
                                    :style="{'top': monthExpMoney.inputTop, 'z-index': 1, right: '.1rem', width: 'calc(100% - 0.4rem)'}" @input="inputChange('monthExpMoney')" @blur="inputChange('monthExpMoney', 'blur')">
                                <div id="monthExpMoneyShow" class="input-box-right-input" @click="inputFocus('monthExpMoney')" style="right: .1rem; width: calc(100% - 0.4rem)">{{monthExpMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="monthExpMoney.value" :min="monthExpMoney.min" :max="monthExpMoney.max" :interval="monthExpMoney.step" :tooltip="false" @callback="rangeChange('monthExpMoney')"></vue-slider>
                            <span v-for="(item, index) in monthExpMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in monthExpMoney.values" class="irs-grid-pol" :style="{left: 100 / monthExpMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in monthExpMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / monthExpMoney.gridNum * (index + 0.5) + '%'}"></span>
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
                    <!-- 退休前每年回報率 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title6}}</span>
                            <div class="input-box-right" style="width: calc(100% - 1.7rem)">
                                <input id="beforeReturnRateInput" class="input-box-right-input" type="number" v-model="beforeReturnRate.value" name="beforeReturnRate" :min="beforeReturnRate.min" :max="beforeReturnRate.max" :step="beforeReturnRate.step" :placeholder="beforeReturnRate.min + '-' + beforeReturnRate.max"
                                    @input="inputChange('beforeReturnRate')" @blur="inputChange('beforeReturnRate', 'blur')" @keydown="preventNotNumber($event)" style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="beforeReturnRate.value" :min="beforeReturnRate.min" :max="beforeReturnRate.max" :interval="beforeReturnRate.step" :tooltip="false" @callback="rangeChange('beforeReturnRate')"></vue-slider>
                            <span v-for="(item, index) in beforeReturnRate.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in beforeReturnRate.values" class="irs-grid-pol" :style="{left: 100 / beforeReturnRate.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in beforeReturnRate.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / beforeReturnRate.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 退休後每年回報率 -->
                    <div class="row-block" style="margin-bottom: 0.2rem;">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title7}}</span>
                            <div class="input-box-right" style="width: calc(100% - 1.7rem)">
                                <input id="afterReturnRateInput" class="input-box-right-input" type="number" v-model="afterReturnRate.value" name="afterReturnRate" :min="afterReturnRate.min" :max="afterReturnRate.max" :step="afterReturnRate.step" :placeholder="afterReturnRate.min + '-' + afterReturnRate.max"
                                    @input="inputChange('afterReturnRate')" @blur="inputChange('afterReturnRate', 'blur')" @keydown="preventNotNumber($event)" style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="afterReturnRate.value" :min="afterReturnRate.min" :max="afterReturnRate.max" :interval="afterReturnRate.step" :tooltip="false" @callback="rangeChange('afterReturnRate')"></vue-slider>
                            <span v-for="(item, index) in afterReturnRate.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in afterReturnRate.values" class="irs-grid-pol" :style="{left: 100 / afterReturnRate.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in afterReturnRate.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / afterReturnRate.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="other-option">
                <div class="other-option-title">
                    <span class="title">{{other_option_title}}</span>
                    <span class="des">({{other_option_des}})</span>
                    <mt-switch class="other-option-switch" v-model="otherOption" @change="calcReault()"></mt-switch>
                </div>
                <div v-if="otherOption" class="other-option-content">
                    <div class="bottom-title">{{your_MPF}}</div>
                    <!-- 公積金現時存結 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title8}}</span>
                            <div class="input-box-right max">
                                <input id="assetsMPFMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="assetsMPFMoney.value" name="assetsMPFMoney" :min="assetsMPFMoney.min" :max="assetsMPFMoney.max" :step="assetsMPFMoney.step" :placeholder="assetsMPFMoney.placeholder"
                                    :style="{'top': assetsMPFMoney.inputTop, 'z-index': 1, right: '.1rem'}" @input="inputChange('assetsMPFMoney')" @blur="inputChange('assetsMPFMoney', 'blur')">
                                <div id="assetsMPFMoneyShow" class="input-box-right-input" @click="inputFocus('assetsMPFMoney')" style="right: .1rem">{{assetsMPFMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="assetsMPFMoney.value" :min="assetsMPFMoney.min" :max="assetsMPFMoney.max" :interval="assetsMPFMoney.step" :tooltip="false" @callback="rangeChange('assetsMPFMoney')"></vue-slider>
                            <span v-for="(item, index) in assetsMPFMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in assetsMPFMoney.values" class="irs-grid-pol" :style="{left: 100 / assetsMPFMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in assetsMPFMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / assetsMPFMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 公積金每月供款 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title9}}</span>
                            <div class="input-box-right max">
                                <input id="monthMPFMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="monthMPFMoney.value" name="monthMPFMoney" :min="monthMPFMoney.min" :max="monthMPFMoney.max" :step="monthMPFMoney.step" :placeholder="monthMPFMoney.placeholder"
                                    :style="{'top': monthMPFMoney.inputTop, 'z-index': 1, right: '.1rem'}" @input="inputChange('monthMPFMoney')" @blur="inputChange('monthMPFMoney', 'blur')">
                                <div id="monthMPFMoneyShow" class="input-box-right-input" @click="inputFocus('monthMPFMoney')" style="right: .1rem">{{monthMPFMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="monthMPFMoney.value" :min="monthMPFMoney.min" :max="monthMPFMoney.max" :interval="monthMPFMoney.step" :tooltip="false" @callback="rangeChange('monthMPFMoney')"></vue-slider>
                            <span v-for="(item, index) in monthMPFMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in monthMPFMoney.values" class="irs-grid-pol" :style="{left: 100 / monthMPFMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in monthMPFMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / monthMPFMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 公積金每年回報率 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title10}}</span>
                            <div class="input-box-right" style="width: calc(100% - 1.7rem)">
                                <input id="returnMPFRateInput" class="input-box-right-input" type="number" v-model="returnMPFRate.value" name="returnMPFRate" :min="returnMPFRate.min" :max="returnMPFRate.max" :step="returnMPFRate.step" :placeholder="returnMPFRate.min + '-' + returnMPFRate.max"
                                    @input="inputChange('returnMPFRate')" @blur="inputChange('returnMPFRate', 'blur')" @keydown="preventNotNumber($event)" style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="returnMPFRate.value" :min="returnMPFRate.min" :max="returnMPFRate.max" :interval="returnMPFRate.step" :tooltip="false" @callback="rangeChange('returnMPFRate')"></vue-slider>
                            <span v-for="(item, index) in returnMPFRate.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in returnMPFRate.values" class="irs-grid-pol" :style="{left: 100 / returnMPFRate.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in returnMPFRate.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / returnMPFRate.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <div class="bottom-title">{{your_investment}}</div>
                    <!-- 儲蓄和投資現時存結 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title8}}</span>
                            <div class="input-box-right max">
                                <input id="assetsSaveMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="assetsSaveMoney.value" name="assetsSaveMoney" :min="assetsSaveMoney.min" :max="assetsSaveMoney.max" :step="assetsSaveMoney.step" :placeholder="assetsSaveMoney.placeholder"
                                    :style="{'top': assetsSaveMoney.inputTop, 'z-index': 1, right: '.1rem'}" @input="inputChange('assetsSaveMoney')" @blur="inputChange('assetsSaveMoney', 'blur')">
                                <div id="assetsSaveMoneyShow" class="input-box-right-input" @click="inputFocus('assetsSaveMoney')" style="right: .1rem">{{assetsSaveMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="assetsSaveMoney.value" :min="assetsSaveMoney.min" :max="assetsSaveMoney.max" :interval="assetsSaveMoney.step" :tooltip="false" @callback="rangeChange('assetsSaveMoney')"></vue-slider>
                            <span v-for="(item, index) in assetsSaveMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in assetsSaveMoney.values" class="irs-grid-pol" :style="{left: 100 / assetsSaveMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in assetsSaveMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / assetsSaveMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 儲蓄和投資每年回報率 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title10}}</span>
                            <div class="input-box-right" style="width: calc(100% - 1.7rem)">
                                <input id="returnSaveRateInput" class="input-box-right-input" type="number" v-model="returnSaveRate.value" name="returnSaveRate" :min="returnSaveRate.min" :max="returnSaveRate.max" :step="returnSaveRate.step" :placeholder="returnSaveRate.min + '-' + returnSaveRate.max"
                                    @input="inputChange('returnSaveRate')" @blur="inputChange('returnSaveRate', 'blur')" @keydown="preventNotNumber($event)" style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="returnSaveRate.value" :min="returnSaveRate.min" :max="returnSaveRate.max" :interval="returnSaveRate.step" :tooltip="false" @callback="rangeChange('returnSaveRate')"></vue-slider>
                            <span v-for="(item, index) in returnSaveRate.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in returnSaveRate.values" class="irs-grid-pol" :style="{left: 100 / returnSaveRate.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in returnSaveRate.values" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / returnSaveRate.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'27'" @getAgentInfo="getAgentInfo"></consultant-card>
            <div class="disclaimer-box">{{disclaimer_text}}</div>
        </section>
        <calculator-share ref="calculatorShare" :share-title="this.share_title" :share-des="this.share_des"></calculator-share>
    </div>
</template>

<script src="./annuity.js">

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
    left: .4rem;
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
    width: 100%;
}

.rich-age-text {
    font-size: .14rem;
    color: #FFFFFF;
    line-height: .14rem;
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

.other-option {
    width: 100%;
    margin-bottom: .4rem;
}

.other-option-content {
    width: 100%;
    padding: 0 .16rem;
}

.other-option-title {
    width: 100%;
    height: .5rem;
    line-height: .5rem;
    background-color: #F6F6F6;
    padding-left: .16rem;
    position: relative;
}

.other-option-title .title {
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .18rem;
    font-weight: bold;
}

.other-option-title .des {
    font-size: .12rem;
    color: #999999;
    letter-spacing: 0;
}

.other-option-switch {
    position: absolute;
    right: .16rem;
    top: .12rem;
}

.bottom-title {
    font-size: .2rem;
    color: #2A2A2A;
    font-weight: bold;
    line-height: .24rem;
    margin: .32rem 0 .16rem 0;
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
</style>
