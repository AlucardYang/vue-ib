<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box">
                <span class="rich-age-text">{{title1}}</span><br>
                <span class="rich-age">{{levyYears}}年共{{premiumLevy | formatMoney}}</span><br>
                <span v-if="levyYears > 0" class="go-levy-detail" @click="goLevyDetail">{{go_levy_detail}}</span>
                <span v-if="levyYears <= 0" class="levy-tip">{{levy_from_date}}<br>{{levy_to_end}}</span>
            </div>
        </div>
        <!-- 保单类型选择器 -->
        <select-picker ref="typePicker" :data="types" :default="showType" :title="please_select_type" @updateData="updateTypes"></select-picker>
        <!-- 时间弹窗 -->
        <date-picker ref="datePicker" :new-date="selectedDate" :title="please_select_date" @updateDate="updateDate"></date-picker>
        <section v-if="showCalcContent" id="calculatorSection" class="com-scroll-y">
            <div class="calculator-content" :class="{'calculator-content-height': !inApp && agentInfo.nickname}">
                <div class="bottom-main-content">
                    <div class="select-box" @click="showTypes">
                        <span class="select-box-left">{{left_title1}}</span>
                        <span class="select-box-text com-nowrap">{{showType}}</span>
                        <i class="iconfont arrow-down">&#xe77d;</i>
                    </div>
                    <div id="selectDateBtn" class="select-box" style="margin-bottom: .32rem;" @click="showDateFn">
                        <span class="select-box-left">{{left_title2}}</span>
                        <span class="select-box-text com-nowrap">{{selectedDate | formatDate('yyyy-MM-dd')}}</span>
                        <i class="iconfont arrow-down">&#xe77d;</i>
                    </div>
                    <!-- 供款年期 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title3}}</span>
                            <div class="input-box-right max">
                                <input id="supplyYearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="supplyYear.value" name="supplyYear" :min="supplyYear.min" :max="supplyYear.max" :step="supplyYear.step" :placeholder="supplyYear.placeholder" @input="inputChange('supplyYear')"
                                    @blur="inputChange('supplyYear', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="supplyYear.value" :min="supplyYear.min" :max="supplyYear.max" :interval="supplyYear.step" :tooltip="false" @callback="rangeChange('supplyYear')"></vue-slider>
                            <span v-for="(item, index) in supplyYear.values" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in supplyYear.values" class="irs-grid-pol" :style="{left: 100 / supplyYear.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in supplyYear.values" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / supplyYear.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <!-- 年度保費 -->
                    <div class="row-block">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title4}}</span>
                            <div class="input-box-right max">
                                <input id="premiumMoneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="premiumMoney.value" name="premiumMoney" :min="premiumMoney.min" :max="premiumMoney.max" :step="premiumMoney.step" :placeholder="premiumMoney.placeholder"
                                    :style="{'top': premiumMoney.inputTop, 'z-index': 1, right: '.1rem', width: 'calc(100% - 0.6rem)'}" @input="inputChange('premiumMoney')" @blur="inputChange('premiumMoney', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus('premiumMoney')" style="right: .1rem; width: calc(100% - 0.6rem)">{{premiumMoney.string}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="premiumMoney.value" :min="premiumMoney.min" :max="premiumMoney.max" :interval="premiumMoney.step" :tooltip="false" @callback="rangeChange('premiumMoney')"></vue-slider>
                            <span v-for="(item, index) in premiumMoney.values" class="owner-grid-text" :style="{left: parseInt(item) * 0.1 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in premiumMoney.values" class="irs-grid-pol" :style="{left: 100 / premiumMoney.gridNum * index + '%'}"></span>
                            <span v-for="(item, index) in premiumMoney.values" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / premiumMoney.gridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'25'" @getAgentInfo="getAgentInfo"></consultant-card>
            <div class="disclaimer-box">{{disclaimer_text}}</div>
        </section>
        <calculator-share ref="calculatorShare" :share-title="this.share_title" :share-des="this.share_des"></calculator-share>
    </div>
</template>

<script src="./premiumlevy.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../calculator.css">

</style>

<style scoped>
.calculator-content-height {
    min-height: calc(100% - 1.8rem);
}

.top-main-content {
    background-image: linear-gradient(90deg, #4E7FFF 0%, #469FFF 100%);
}

.rich-age-box {
    left: .3rem;
    width: 2.1rem;
    text-align: left;
}

.rich-age-box .rich-age {
    font-size: .20rem;
    margin-top: .04rem;
    line-height: .29rem;
}

.rich-age-text {
    font-size: .15rem;
    color: #FFFFFF;
    line-height: .18rem;
}

.levy-tip {
    display: inline-block;
    font-size: .12rem;
    line-height: .15rem;
    margin-top: .06rem;
}

.go-levy-detail {
    display: inline-block;
    padding: 0 .12rem;
    text-align: center;
    height: .26rem;
    font-size: .12rem;
    line-height: .26rem;
    border-radius: .14rem;
    cursor: pointer;
    background-color: #fff;
    color: #3364E4;
    margin-top: .04rem;
}

.go-levy-detail:after {
    /* content: '';
      display: inline-block;
      border: .04rem solid transparent;
      border-left-color: #fff;
      margin-left: .04rem; */
}

.bottom-main-content {
    padding-top: .16rem;
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
    margin-bottom: .12rem;
    font-size: .16rem;
    color: #2A2A2A;
    padding: 0 .12rem 0 .12rem;
    cursor: pointer;
}

.select-box-left {
    position: absolute;
    top: 0;
    left: .12rem;
}

.select-box-text {
    position: absolute;
    top: 0;
    left: 1rem;
    width: calc(100% - 1.4rem);
    text-align: right;
}

.arrow-down {
    color: #DDDDDD;
    position: absolute;
    top: 0;
    right: .12rem;
}
</style>
