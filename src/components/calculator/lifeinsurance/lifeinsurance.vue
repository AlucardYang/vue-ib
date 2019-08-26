<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box">
                <span class="rich-age-text">{{title1}}</span><br>
                <span class="rich-age">{{requiredReserve}}</span><br>
                <span class="rich-age-text" style="margin-top: .14rem;">{{title2}}</span><br>
                <span class="rich-age">{{owedReserves}}</span>
            </div>
        </div>
        <section v-if="showCalcContent" id="calculatorSection" class="com-scroll-y">
            <div class="calculator-content">
                <div class="bottom-main-content">
                    <div class="bottom-main-tip">{{top_tip}}</div>
                    <!-- 每月家庭開支 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title1}}</span>
                            <div class="input-box-right max">
                                <input id="familyMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="familyMoney.value" name="familyMoney" :min="familyMoney.min" :max="familyMoney.max" :step="familyMoney.step" :placeholder="familyMoney.placeholder" :style="{'top': familyMoney.inputTop, 'z-index': 1, right: '.1rem', width: 'calc(100% - 0.4rem)'}"
                                    @input="inputChange('familyMoney')" @blur="inputChange('familyMoney', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus('familyMoney')" style="right: .1rem; width: calc(100% - 0.4rem)">{{familyMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="familyMoney.value" :min="familyMoney.min" :max="familyMoney.max" :interval="familyMoney.step" :tooltip="false" @callback="rangeChange('familyMoney')"></vue-slider>
                            <span v-for="(item, index) in familyMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in familyMoney.values" class="irs-grid-pol" :style="{left: 100 / familyMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in familyMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / familyMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 供養年期 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title2}}</span>
                            <div class="input-box-right max">
                                <input id="supplyYearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="supplyYear.value" name="supplyYear" :min="supplyYear.min" :max="supplyYear.max" :step="supplyYear.step" :placeholder="supplyYear.placeholder" @input="inputChange('supplyYear')"
                                    @blur="inputChange('supplyYear', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="supplyYear.value" :min="supplyYear.min" :max="supplyYear.max" :interval="supplyYear.step" :tooltip="false" @callback="rangeChange('supplyYear')"></vue-slider>
                            <span v-for="(item, index) in supplyYear.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 3.33 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in supplyYear.values" class="irs-grid-pol" :style="{left: 100 / supplyYear.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in supplyYear.values" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / supplyYear.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 總負債 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title3}}</span>
                            <div class="input-box-right max">
                                <input id="debtMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="debtMoney.value" name="debtMoney" :min="debtMoney.min" :max="debtMoney.max" :step="debtMoney.step" :placeholder="debtMoney.placeholder" :style="{'top': debtMoney.inputTop, 'z-index': 1, right: '.1rem'}"
                                    @input="inputChange('debtMoney')" @blur="inputChange('debtMoney', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus('debtMoney')" style="right: .1rem">{{debtMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="debtMoney.value" :min="debtMoney.min" :max="debtMoney.max" :interval="debtMoney.step" :tooltip="false" @callback="rangeChange('debtMoney')"></vue-slider>
                            <span v-for="(item, index) in debtMoney.values" class="owner-grid-text" :style="{left: parseInt(item) / 10 * 0.5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in debtMoney.values" class="irs-grid-pol" :style="{left: 100 / debtMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in debtMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / debtMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 每年通脹率 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title4}}</span>
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
                            <span class="input-box-left">{{left_title5}}</span>
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
                    <!-- 現有資產 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title6}}</span>
                            <div class="input-box-right max">
                                <input id="assetsMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="assetsMoney.value" name="assetsMoney" :min="assetsMoney.min" :max="assetsMoney.max" :step="assetsMoney.step" :placeholder="assetsMoney.placeholder" :style="{'top': assetsMoney.inputTop, 'z-index': 1, right: '.1rem'}"
                                    @input="inputChange('assetsMoney')" @blur="inputChange('assetsMoney', 'blur')">
                                <div id="assetsMoneyShow" class="input-box-right-input" @click="inputFocus('assetsMoney')" style="right: .1rem">{{assetsMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="assetsMoney.value" :min="assetsMoney.min" :max="assetsMoney.max" :interval="assetsMoney.step" :tooltip="false" @callback="rangeChange('assetsMoney')"></vue-slider>
                            <span v-for="(item, index) in assetsMoney.values" class="owner-grid-text" :style="{left: parseInt(item) / 10 * 0.5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in assetsMoney.values" class="irs-grid-pol" :style="{left: 100 / assetsMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in assetsMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / assetsMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 現有人壽保險 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title7}}</span>
                            <div class="input-box-right max">
                                <input id="lifeMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="lifeMoney.value" name="lifeMoney" :min="lifeMoney.min" :max="lifeMoney.max" :step="lifeMoney.step" :placeholder="lifeMoney.placeholder" :style="{'top': lifeMoney.inputTop, 'z-index': 1, right: '.1rem', width: 'calc(100% - 0.4rem)'}"
                                    @input="inputChange('lifeMoney')" @blur="inputChange('lifeMoney', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus('lifeMoney')" style="right: .1rem; width: calc(100% - 0.4rem)">{{lifeMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="lifeMoney.value" :min="lifeMoney.min" :max="lifeMoney.max" :interval="lifeMoney.step" :tooltip="false" @callback="rangeChange('lifeMoney')"></vue-slider>
                            <span v-for="(item, index) in lifeMoney.values" class="owner-grid-text" :style="{left: parseInt(item) / 10 * 0.5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in lifeMoney.values" class="irs-grid-pol" :style="{left: 100 / lifeMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in lifeMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / lifeMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'26'" @getAgentInfo="getAgentInfo"></consultant-card>
            <div class="disclaimer-box">{{disclaimer_text}}</div>
        </section>
        <calculator-share ref="calculatorShare" :share-title="this.share_title" :share-des="this.share_des"></calculator-share>
    </div>
</template>

<script src="./lifeinsurance.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../calculator.css">

</style>

<style scoped>
.calculator-content {
    padding-top: 1.6rem;
}

.top-main-content {
    height: 1.6rem;
    background-image: linear-gradient(90deg, #4E7FFF 0%, #469FFF 100%);
}

.rich-age-box {
    left: .3rem;
    width: 2.1rem;
    text-align: left;
}

.rich-age-box .rich-age {
    font-size: .24rem;
    margin-top: .04rem;
    line-height: .29rem;
}

.rich-age-text {
    font-size: .15rem;
    color: #FFFFFF;
    line-height: .18rem;
}
</style>
