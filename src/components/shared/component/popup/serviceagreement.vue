<template>
    <div v-show="showPicker" class="popup-date-picker-content">
        <div class="popup-date-picker-bg" @click="close"></div>
        <div id="popupDatePicker" class="popup-date-picker" :style="slideStyle">
            <div class="popup-title">{{simply ? 'iBer Care 用户服务协议' : 'iBer Care 用戶服務協議'}}</div>
            <div class="service-agreement-content" v-html="simply ? tranSim.simplized(twUserPolicy) : twUserPolicy"></div>
            <div class="btn-box">
                <div class="cancel-btn" @click="agreeFn(false)">{{simply ? '不同意并退出' : '不同意並退出'}}</div>
                <div class="agree-btn" @click="agreeFn(true)">同意</div>
            </div>
        </div>
    </div>
</template>

<script>
import CommonJS from "@/components/shared/service/common.js";
import tranSim from '@/components/shared/language/tranSim.js';

export default {
    name: "ServiceAgreement",
    props: {},
    data() {
        return {
            showPicker: false,
            slideStyle: {},
            tranSim: tranSim,
            twUserPolicy: `
            <article class="com-scroll-y">
                <ul>
                    <li>
                        <p>使用條款</p>
                        <p>如閣下開通或使用iBer Care程式功能或者iBer Care相關聯的其他線上平台服務(包括但不限於WEB、微信WeChat小程序、移動端等)，即表示閣下完全同意以下的使用條款，並不附加其他限制或規條。在使用本服務前，請先仔細閱讀各條款。有關條款可能隨時作出更改，並在本頁刊登。閣下須遵從有關更改，因此閣下應該定期參閱本頁，以得知相關的最新條款。</p>
                        <br>
                    </li>
                    <li>
                        <p>1. 訂立合約的對象</p>
                        <p>此『iBer Care會員協議』由iBer FinTech Limited（以下簡稱“iBer”或者“本公司” ）實體和閣下簽訂。iBer Care為iBer公司其中一項業務，本協議約定閣下在使用本公司iBer Care業務之相關約定。</p>
                        <br>
                    </li>
                    <li>
                        <p>2. 合約說明</p>
                        <p>此「iBer Care會員協議」最後更新日期為 2018 年 7 月 1 日，自閣下首次開通使用iBer Care服務日期起生效 (以最早發生者為準)，約束閣下與iBer之間的行為。如果閣下不同意他們，則不該開通或使用此服務，提供任何材料到本軟體，或從本軟體下載任何資料。</p>
                        <br>
                    </li>
                    <li>
                        <p>3. 服務使用授權</p>
                        <p>本公司授權閣下合理使用iBer Care之服務和內容，服務內容根據iBer Care提供的軟體功能為準，本公司會不斷更新iBer Care提供服務內容。
                        本公司授權閣下合理使用iBer Care所簽約的醫療機構之產品信息，可用於向第三方宣傳推廣。</p>
                        <p>閣下在使用iBer Care之服務時，不得偏離本服務之內容及本意，不得向第三方誇大或者失實內容。</p>
                        <p>iBer Care平台上的醫療產品或服務由合作的醫療機構提供，iBer Care僅作為電子技術展示和預約平台，產品或服務的保證由相應醫療機構負責，與iBer無關。</p>
                        <br>
                    </li>
                    <li>
                        <p>4. iBer Coin之定義和約定</p>
                        <p>閣下透過合理方式推廣iBer產品，獲得客戶成功消費，將依據iBer Care軟體展示給閣下返還推廣服務費，即稱為iBer Coin。</p>
                        <p>閣下iBer Coin將可透過支票或銀行轉賬方式給閣下支付，按照1個iBer Coin等於1元港幣兌換。</p>
                        <p>iBer Coin亦可在iBer平台中有標註地方作消費之用。</p>
                        <p>iBer Coin提現時間將在醫療機構向iBer結算以及iBer公司內部財務處理之後再向閣下支付。</p>
                        <p>如果目標消費客戶產生退款，則閣下應退回相應iBer Coin或等值港幣。</p>
                        <br>
                    </li>
                    <li>
                        <p>5. 用戶隱私</p>
                        <p>iBer Care將會使用閣下資料以及登記的預定用戶資料訊息或提供給相應醫療機構，作為業務之用途。</p>
                        <br>
                    </li>
                    <li>
                        <p>6. 期限和終止契約</p>
                        <p>iBer Care可能在無特定理由的情況下，隨時終止閣下全部或者部分iBer Care服務，終止或部分修改『iBer Care會員協議』。</p>
                        <p>閣下如違反本協議約定，本公司有權終止本協議，并有權追回已產生的iBer Coin或已支付的款項。</p>
                        <br>
                    </li>
                    <li>
                        <p>7. 適用法律和司法管轄</p>
                        <p>本合約的條款按照中華人民共和國香港特别行政區(“香港”)的法律解釋。</p>
                        <p>香港法院對本合約具有排他管轄權。</p>
                    </li>
                </ul> 
            </article>
          `,
        };
    },
    watch: {
        show: {
            handler: function(value, oldvalue) {

            }
        }
    },
    mounted() {},
    methods: {
        open() {
            this.showPicker = true;
            setTimeout(() => {
                this.slideStyle = {
                    transform: 'translateY(0)'
                };
            }, 30);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
        },
        close() {
            this.slideStyle = {
                transform: 'translateY(110%)'
            };
            setTimeout(() => {
                this.showPicker = false;
            }, 300);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'auto');
        },
        agreeFn(boolean) {
            this.$emit('updateAgree', boolean);
            this.close();
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-date-picker-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-date-picker-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    transition: all 300ms;
}

.popup-date-picker {
    background-color: #fff;
    border-radius: .08rem;
    width: calc(100% - .8rem);
    height: calc(100% - 1rem);
    padding: .2rem;
    transition: all 100ms;
    transform: translateY(110%);
}

.popup-title {
    font-family: PingFangTC-Medium;
    font-size: .16rem;
    color: #333333;
    line-height: .2rem;
    text-align: center;
}

.service-agreement-content {
    width: 100%;
    height: calc(100% - 1rem);
    font-size: .12rem;
    color: #2A2A2A;
    line-height: .19rem;
    margin-top: .2rem;
}

.btn-box {
    margin-top: .2rem;
    height: .4rem;
}

.cancel-btn,
.agree-btn {
    float: left;
    width: calc(50% - .1rem);
    height: .4rem;
    line-height: .4rem;
    background-color: #F6F6F6;
    border-radius: .2rem;
    text-align: center;
    font-size: .14rem;
    color: #2A2A2A;
    margin-right: .2rem;
    cursor: pointer;
}

.agree-btn {
    background-color: #3364E4;
    color: #FFFFFF;
    margin-right: 0;
}
</style>
