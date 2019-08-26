<template>
    <!-- 预约表和编辑预约表公共组件 -->
    <div class="care-sign-up">
        <!-- 门店选择器 -->
        <select-picker ref="storePicker" :data="detailInfo.stores" :default="signUpInfo.store" :title="selectStoreTip" :value-key="'name'" @updateData="updateStore"></select-picker>
        <!-- 时间选择器 -->
        <care-date-picker ref="careDatePicker" :reserve-date="signUpInfo.reserve_date" :care-product-uuid="care_product_uuid" :care-order-uuid="care_order_uuid" :store-uuid="signUpInfo.store.care_company_store_uuid" @updateSelectDate="updateSelectDate"></care-date-picker>
        <!-- 年龄选择器 -->
        <select-picker ref="agePicker" :data="ages" :default="signUpInfo.reserve_age + (simply ? '岁' : '歲')" :title="selectAgeTip" @updateData="updateAge"></select-picker>
        <!-- 手机号前缀选择器 -->
        <select-picker ref="prePhonePicker" :data="mobile_pres" :default="signUpInfo.area + signUpInfo.mobile_pre" :title="selectMobilePreTip" @updateData="updatePrePhone"></select-picker>
        <!-- 是否保存框 -->
        <confirm-picker ref="confirmPicker" :title="simply ? '温馨提示' : '溫馨提示'" :content="reloadSaveTip" @updateConfirm="updateConfirm"></confirm-picker>
        <!-- 预览图片 -->
        <com-agent-album :params="comAAMData"></com-agent-album>
        <!-- 服务协议 -->
        <service-agreement ref="serviceAgreement" @updateAgree="updateAgree"></service-agreement>
        <!-- 手机号验证 -->
        <com-ibercare-login v-model="showiBerCareLogin" :params="iBerCareLogin" @change='updateConfirmMobile'></com-ibercare-login>
        <!-- 主体页面 -->
        <div v-show="isLoaded" class="care-sign-up-content com-scroll-y">
            <div class="banner-box">
                <img src="https://static.iberhk.com/v2/web/images/iber_care/sign-up-top-bg.png">
            </div>
            <div v-if="isEdit" class="top-title-box">
                <span>{{simply ? '重新预约，' : '重新預約，'}}</span><br>
                <span>{{simply ? '请修改就诊人的信息' : '請修改就診人的信息'}}</span>
            </div>
            <div v-else class="top-title-box">
                <span>{{simply ? '开始预约：' : '開始預約：'}}</span><br>
                <span>{{simply ? '请填写就诊人的信息' : '請填寫就診人的信息'}}</span>
            </div>
            <div class="product-detail-box">
                <img :src="detailInfo.banner_img">
                <div class="right-box">
                    <div class="title">{{detailInfo.name}}</div>
                    <div class="price">
                        <span>{{priceUnit}}</span>
                        <span>{{detailInfo.vip_price | formatMoney(0, '')}}</span>
                    </div>
                    <div class="coin">
                        <span>{{simply ? '预约定金' : '預約定金'}}</span>
                        <span>{{priceUnit}}</span>
                        <span>{{detailInfo.reserve_fee | formatMoney(0, '')}}</span>
                    </div>
                </div>
            </div>
            <div class="user-prompt">{{simply ? '支付定金后，需等待订单审核通过才可前往门店消费' : '支付定金後，需等待訂單審核通過才可前往門店消費'}}</div>
            <form class="sign-up-form">
                <!-- 预约门店 -->
                <div class="sign-up-form-block after-none" :style="{height: signUpInfo.store.name ? 'auto' : '.52rem'}" @click="showStorePicker">
                    <span v-if="!signUpInfo.store.name" class="gray-text">{{selectStoreTip}}</span>
                    <div v-else class="store-name">
                        {{signUpInfo.store.name}}<br>{{signUpInfo.store.addr}}
                    </div>
                    <i class="iconfonti right-arraw">&#xe66c;</i>
                </div>
                <!-- 预约时间 -->
                <div class="sign-up-form-block" @click="showCareDatePicker">
                    <span v-if="!signUpInfo.reserve_date.date" class="gray-text">{{selectTimeTip}}</span>
                    <span v-else>{{signUpInfo.reserve_date.date}} {{signUpInfo.reserve_date.weekday}} {{signUpInfo.reserve_date.section}} {{signUpInfo.reserve_date.slot}}</span>
                    <i class="iconfonti right-arraw">&#xe66c;</i>
                </div>
                <!-- 姓名 -->
                <div class="sign-up-form-block">
                    <input class="name-input" type="text" v-model="signUpInfo.reserve_name" :placeholder="selectNameTip" name="reserve_name" maxlength="50">
                </div>
                <!-- 预约年龄 -->
                <div class="sign-up-form-block" @click="showAgePicker">
                    <span v-if="signUpInfo.reserve_age === undefined || signUpInfo.reserve_age === ''" class="gray-text">{{selectAgeTip}}</span>
                    <div v-else class="store-name">
                        {{signUpInfo.reserve_age}}{{simply ? '岁' : '歲'}}
                    </div>
                    <i class="iconfonti right-arraw">&#xe66c;</i>
                </div>
                <!-- 后台动态配置项 -->
                <div class="sign-up-form-block" v-for="(item, index) in detailInfo.reserve_option" v-if="item.type !== 3 || (item.type === 3 && (!item.ext || (item.ext === 'is_vaccine' && (signUpInfo.reserve_age < 18))))">
                    <!-- 单行文本框 -->
                    <input v-if="item.type === 1" class="name-input" type="text" v-model="signUpInfo[item.care_product_reserve_info_uuid]" :placeholder="item.value" :name="item.care_product_reserve_info_uuid">
                    <!-- 多行文本框 -->
                    <textarea v-if="item.type === 4" class="sign-up-form-block textarea-input" type="text" v-model="signUpInfo[item.care_product_reserve_info_uuid]" :placeholder="item.value" :name="item.care_product_reserve_info_uuid"></textarea>
                    <!-- 选项 -->
                    <div v-if="item.type === 2">
                        <span>{{item.name}}</span>
                        <ul class="gender-select">
                            <li class="gender-select-block" v-for="(option, i) in item.value" :style="{'margin-right': i === item.value.length - 1 ? '0' : '.16rem'}">
                                <i v-if="signUpInfo[item.care_product_reserve_info_uuid] === option" class="iconfonti selected">&#xe66d;</i>
                                <i v-else class="iconfonti unselected" @click="changeOption(item.care_product_reserve_info_uuid, option)">&#xe66e;</i>
                                <span @click="signUpInfo.gender = 0">{{option}}</span>
                            </li>
                        </ul>
                    </div>
                    <!-- 上传附件 -->
                    <!-- 如果是疫苗本，小于18以下是必传项 -->
                    <div v-if="item.type === 3">
                        <span>{{item.name}}（{{signUpInfo[item.care_product_reserve_info_uuid].length}}/10）</span>
                        <span class="mobile-change" @click="openAlbum(item.value)">{{simply ? '查看样例' : '查看樣例'}}</span>
                        <div class="sample-box">
                            <div class="pic" v-for="(img, imgIndex) in signUpInfo['imageArr' + index]">
                                <i class="iconfonti delete-img" @click="deleteImgFn(item, index, imgIndex)">&#xe7ad;</i>
                                <div class="pic-inner">
                                    <img :ref="'uploadImg' + index + imgIndex" class="pic-block" :src="img.url" :style="{'width': img.isWidthLg ? 'auto' : '100%', 'height': img.isWidthLg ? '100%' : 'auto'}" @click="openAlbum(signUpInfo['imageArr' + index], imgIndex)">
                                </div>
                            </div>
                            <div v-if="signUpInfo[item.care_product_reserve_info_uuid].length < 10" class="pic">
                                <i class="iconfonti upload-icon" @click="uploadPicInApp(item, index)">&#xe769;</i>
                                <input v-if="!inApp && showUploadInput" :ref="'uploadInput' + index" class="upload-com" type="file" :name="item.care_product_reserve_info_uuid + 'Image'" accept="image/*" multiple="multiple" @change="uploadPicChange($event, item, index)">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 手机号码 -->
                <div class="sign-up-form-block">
                    <div class="mobile-pre" @click="showPrePhonePicker">
                        <span>{{signUpInfo.area}}{{signUpInfo.mobile_pre}}</span>
                        <i class="iconfonti mobile-pre-arraw">&#xe669;</i>
                    </div>
                    <div v-if="existPhone" class="mobile-input mobile-input-show" :style="{'right': signUpInfo.mobile_pre === '+86' ? '.48rem' : '.74rem'}" @click="changePhone">{{signUpInfo.mobile}}</div>
                    <input ref="mobileInput" class="mobile-input" type="text" v-model="signUpInfo.mobile" pattern="[0-9]*" name="mobile" maxlength="20" :placeholder="selectMobileTip" :style="{opacity: existPhone ? 0 : 1}">
                    <span v-show="isEdit && signUpInfo.mobile" class="mobile-change" @click="changePhone">更改</span>
                </div>
                <!-- 验证码 -->
                <div v-if="!inApp && !existPhone" class="sign-up-form-block">
                    <input class="code-input" type="text" v-model="signUpInfo.code" pattern="[0-9]*" name="mobileCode" maxlength="4" :placeholder="selectCodeTip">
                    <div v-show="codeState" class="phone-code" :style="{color: signUpInfo.mobile && '#3364E4'}" @click="getCode">{{codeAgainState ? (simply ? '重新获取' : '重新獲取') : (simply ? '发送验证码' : '發送驗證碼')}}</div>
                    <div v-show="!codeState" class="code-second">{{second}}s</div>
                </div>
            </form>
            <div class="attention-box">
                <div v-if="detailInfo.caution" class="title">{{simply ? '注意事项：' : '注意事項：'}}</div>
                <div v-if="detailInfo.caution" class="desc" style="margin-bottom: .24rem;">
                    <div v-for="(item, index) in detailInfo.cautionArr">{{item}}</div>
                </div>
                <div v-if="detailInfo.notice" class="title">{{simply ? '预约须知：' : '預約須知：'}}</div>
                <div v-if="detailInfo.notice" class="desc">
                    <div v-for="(item, index) in detailInfo.noticeArr">{{item}}</div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :target-uuid="care_product_uuid" :share-health="true" :from-type="share.target_type" style="background-color: transparent; padding: .16rem 0 1rem 0;"></consultant-card>
            <div class="care-sign-up-bottom-box"></div>
        </div>
        <div v-show="isLoaded" v-if="isEdit" class="bottom-btn-box">
            <div class="sm-btn lg-btn pay" @click="submitForm()">{{ simply ? '确认修改' : '確認修改'}}</div>
        </div>
        <div v-show="isLoaded" v-else class="bottom-btn-box">
            <i v-if="!selectProtocol" class="iconfonti select-protocol" @click="selectProtocol = true">&#xe66b;</i>
            <i v-else class="iconfonti select-protocol" style="color: #3364E4;" @click="selectProtocol = false">&#xe66a;</i>
            <div class="center-text" @click="showServiceAgreement()">
                <span>查看及同意</span><br>
                <span class="protocol-text">{{simply ? '《服务协议》' : '《服務協議》'}}</span>
            </div>
            <div class="sm-btn" :class="{'pay': selectProtocol}" @click="submitForm()">支付定金（{{priceUnit}}{{detailInfo.reserve_fee | formatMoney(0, '')}}）</div>
        </div>
    </div>
</template>

<script>
import cmn from "@/components/ibercare/common.js";
import CommonJS from '@/components/shared/service/common.js';
import '@/components/ibercare/exif.js';

import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";
import CareDatePicker from "@/components/shared/component/popup/caredatepicker.vue";
import ConfirmPicker from "@/components/shared/component/popup/confirmpicker.vue";
import ServiceAgreement from "@/components/shared/component/popup/serviceagreement.vue";
import comIbercareLogin from "@/components/component/com_ibercare_login.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import comAgentAlbum from "@/components/component/com_agent_album.vue";


export default {
    name: "ProductReserve",
    data() {
        return {
            care_product_uuid: this.$route.query['care_product_uuid'] ? this.$route.query['care_product_uuid'] : (this['urlParams'] ? this.urlParams['care_product_uuid'] : ''),
            care_order_uuid: this.$route.query['care_order_uuid'] ? this.$route.query['care_order_uuid'] : (this['urlParams'] ? this.urlParams['care_order_uuid'] : ''),
            isLoaded: false,
            isEdit: /order-reserve-info/.test(window.location.href),
            share: {},
            shareSetting: {
                hide_platform: [],
                language: 'auto',
                auth: 'force',
                card: 'full',
                comment: 'null',
                moreShare: 'null'
            },
            showiBerCareLogin: false,
            iBerCareLogin: {
                mobile: '',
                mobile_pre: ''
            },
            priceUnit: this.inApp ? 'HK$' : (this.simply ? '港币' : '港幣'),
            signUpInfo: {
                reserve_name: '',
                reserve_age: undefined,
                mobile: this.inApp ? '' : (localStorage.getItem('preserve_mobile') ? localStorage.getItem('preserve_mobile') : ''),
                mobile_pre: localStorage.getItem('preserve_mobile_pre') ? ('+' + localStorage.getItem('preserve_mobile_pre')) : '+86',
                area: localStorage.getItem('preserve_mobile_pre') === '852' ? '香港' : (localStorage.getItem('preserve_mobile_pre') === '853' ? (this.simply ? '澳门' : '澳門') : (this.simply ? '中国大陆' : '中國大陸')),
                code: '',
                // gender: 0, // 0 男 1 女
                // age: undefined,
                store: {
                    name: '',
                    care_company_store_uuid: ''
                },
                reserve_date: {
                    date: '', // 日期
                    slot: '', // 时间段
                    weekday: '1', // 周几
                    section: '' // 上午 下午
                }
            },
            detailInfo: {
                share: {}
            },
            reloadSaveTip: this.simply ? '预约尚未完成，现在退出您填写的信息将不被保存' : '預約尚未完成，現在退出您填寫的信息將不被保存',
            selectNameTip: this.simply ? '填写就诊人姓名' : '填寫就診人姓名',
            selectMobileTip: this.simply ? '填写手机号码' : '填寫手機號碼',
            selectMobilePreTip: this.simply ? '请选择区号' : '請選擇區號',
            selectCodeTip: this.simply ? '输入手机验证码' : '輸入手機驗證碼',
            selectAgeTip: this.simply ? '选择年龄' : '選擇年齡',
            selectStoreTip: this.simply ? '选择预约门店' : '選擇預約門店',
            selectTimeTip: this.simply ? '选择预约时间' : '選擇預約時間',
            second: 60,
            codeInterval: null,
            codeState: true,
            existPhone: false,
            codeAgainState: false,
            mobile_pres: [(this.simply ? '中国大陆' : '中國大陸') + '+86', '香港+852', (this.simply ? '澳门' : '澳門') + '+853'],
            // preSelectDefalut: (this.simply ? '中国大陆' : '中國大陸') + '+86',
            ages: [],
            selectProtocol: false,
            comAAMData: {
                layer: 0,
                name: "comAAMData",
                id: "",
                imgArray: [],
                index: 0
            },
            showUploadInput: true,
            formPass: true,
            getCoded: true,
        };
    },
    components: {
        SelectPicker,
        CareDatePicker,
        ConfirmPicker,
        ServiceAgreement,
        ConsultantCard,
        comAgentAlbum,
        comIbercareLogin,
    },
    created() {
        this.$root.blueLoadingParams.show = false;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: false, // 分享上报，不上报可不传
            care_product_uuid: this.care_product_uuid,
            care_order_uuid: this.care_order_uuid,
            target_type: '61',
            router: window.location.pathname,
            url: '',
        };

        // 获取公共用户信息
        this.getUserInfoFn();
        // 重新预约判断手机号是否是当前用户的，填写预约表获取产品详情
        !this.isEdit && this.getDetailInfo();
        // 生成年龄数组
        this.createAgesArr();
    },
    mounted() {
        // 绑定后退事件
        this.bindBackFn();
        // 绑定刷新事件
        // this.bindRefreshFn();
        // 检测表单是否为空
        this.checkFormEmpty();

    },
    destroyed() {
        window.removeEventListener('popstate', this.goBack, false);

        window.removeEventListener('beforeunload', this.refreshOpenTip);
    },
    methods: {
        // 绑定后退事件
        bindBackFn() {
            setTimeout(() => {
                if (window.history && window.history.pushState) {
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', this.goBack, false);
                }
            }, 500);
        },
        // 绑定刷新事件
        bindRefreshFn() {
            window.addEventListener('beforeunload', this.refreshOpenTip);
        },
        // 刷新提示
        refreshOpenTip(e) {
            e.preventDefault();
            var message = this.reloadSaveTip;
            e = e || window.event;
            if (e) {
                e.returnValue = message;
            }
            return message;
        },
        // 后退提示框
        goBack() {
            // 表单为空的可以后退
            if (window.checkFormEmpty()) {
                this.updateConfirm(true);
            } else {
                this.$refs.confirmPicker.open();
            }
        },
        // 检测表单是否为空
        checkFormEmpty() {
            const _this = this;
            window.checkFormEmpty = function() {
                let empty = true;
                if (this.isEdit) {
                    empty = false;
                } else {
                    if (_this.signUpInfo.reserve_name || _this.signUpInfo.reserve_date.date || _this.signUpInfo.store.care_company_store_uuid || _this.signUpInfo.mobile !== (this.inApp ? '' : (localStorage.getItem('preserve_mobile') ? localStorage.getItem('preserve_mobile') : '')) || (_this.signUpInfo.mobile_pre !== (localStorage.getItem('preserve_mobile_pre') ? ('+' + localStorage.getItem('preserve_mobile_pre')) : '+86'))) {
                        empty = false;
                    }
                    for (let i = 0; i < _this.detailInfo.reserve_option.length; i++) {
                        let item = _this.detailInfo.reserve_option[i];
                        if (item.type === 2 && item.value && (item.value.length > 0) && (_this.signUpInfo[item.care_product_reserve_info_uuid] !== item.value[0])) {
                            empty = false;
                            break;
                        } else if ((item.type !== 2 && (item.type !== 3) && _this.signUpInfo[item.care_product_reserve_info_uuid]) || (item.type === 3 && _this.signUpInfo[item.care_product_reserve_info_uuid].length !== 0)) {
                            empty = false;
                            break;
                        }
                    }
                }

                if (_this.inApp) {
                    _this.appFn.commonFn('backCheck', {
                        status: empty
                    });
                }
                return empty;
            }
        },
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                let firstReportParam = {
                    care_product_uuid: this.care_product_uuid
                };
                this.userUuid && this.getRootUserInfo(firstReportParam).finally(() => {
                    // 获取订单预订手机号
                    this.getReserveMobile();
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // 顶部消息提醒
                    this.$root.getAgentMsg();
                });
            } else {
                // app内重新预约直接打开页面
                this.isEdit && this.getOrderInfo();
            }
        },
        // 获取产品详情
        getDetailInfo() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/iber-care/product-reserve', {
                care_product_uuid: this.care_product_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.detailInfo = res.data.detail;
                    // 页面顶部分享信息
                    this.detailInfo.share = res.data.share;
                    // 自定义表单
                    this.detailInfo.reserve_option.forEach((item, index) => {
                        if (item.type === 2 && item.value && item.value.length > 0) {
                            this.signUpInfo[item.care_product_reserve_info_uuid] = item.value[0];
                        } else if (item.type === 3) {
                            this.signUpInfo[item.care_product_reserve_info_uuid] = [];
                            this.signUpInfo['imageArr' + index] = [];
                        }
                    });
                    // 注意事项
                    this.detailInfo.cautionArr = this.detailInfo.caution.split('\n');
                    // 预约须知
                    this.detailInfo.noticeArr = this.detailInfo.notice.split('\n');
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?care_product_uuid=' + this.care_product_uuid + '&user_uuid=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                } else if (res && (res.code === 1000)) {
                    window.location.href = window.baseUrl + '/error/notfound?tip=' + res['msg'];
                } else {
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                }
            }, err => {
                this.$root.pageLoading.layer = 2;
            });
        },
        // 获取预约订单详情
        getOrderInfo() {
            this.$root.blueLoadingParams.show = true;
            this.existPhone = true;
            this.$http.get('/iber-care/order-reserve-info', {
                care_order_uuid: this.care_order_uuid,
                mobile: localStorage.getItem('care_verify_mobile'),
                mobile_pre: localStorage.getItem('care_verify_mobile_pre'),
                code: localStorage.getItem('care_verify_code')
            }).then(res => {
                if (res && res.code === 0) {
                    this.detailInfo = res.data.detail;
                    // 产品的uuid
                    this.care_product_uuid = this.detailInfo.care_product_uuid;
                    // 重置门店
                    this.detailInfo.stores.forEach((item, index) => {
                        if (item.care_company_store_uuid === this.detailInfo.care_company_store_uuid) {
                            this.signUpInfo.store = item;
                        }
                    });
                    // 重置日期
                    this.signUpInfo.reserve_date = this.detailInfo.reserve_date;
                    this.signUpInfo.reserve_date.weekday = this.transformWeek(this.signUpInfo.reserve_date.weekday);
                    // 重置名字
                    this.signUpInfo.reserve_name = this.detailInfo.reserve_name;
                    // 重置年龄
                    this.signUpInfo.reserve_age = this.detailInfo.reserve_age;
                    // 重置手机前缀
                    this.signUpInfo.mobile_pre = '+' + this.detailInfo.mobile_pre;
                    // 重置手机号
                    this.signUpInfo.mobile = this.detailInfo.mobile;
                    // 重置手机号地区
                    this.signUpInfo.area = (this.detailInfo.mobile_pre === '852' ? '香港' : (this.detailInfo.mobile_pre === '853' ? (this.simply ? '澳门' : '澳門') : (this.simply ? '中国大陆' : '中國大陸'))),
                        // 页面顶部分享信息
                        this.detailInfo.share = res.data.share;
                    // 自定义表单
                    this.detailInfo.reserve_option.forEach((item, index) => {
                        if (item.type === 2 && item.value && item.value.length > 0) {
                            this.signUpInfo[item.care_product_reserve_info_uuid] = item.value[0];
                        } else if (item.type === 3) {
                            this.signUpInfo[item.care_product_reserve_info_uuid] = [];
                            this.signUpInfo['imageArr' + index] = [];
                            let imgArr = this.detailInfo.reserve_field[item.care_product_reserve_info_uuid];
                            if (imgArr && imgArr.constructor === Array) {
                                imgArr.forEach((img, i) => {
                                    this.signUpInfo['imageArr' + index].push({
                                        url: img
                                    });
                                });
                            }
                        }
                        if (this.detailInfo.reserve_field[item.care_product_reserve_info_uuid]) {
                            this.signUpInfo[item.care_product_reserve_info_uuid] = this.detailInfo.reserve_field[item.care_product_reserve_info_uuid];
                        }
                    });
                    // 注意事项
                    this.detailInfo.cautionArr = this.detailInfo.caution.split('\n');
                    // 预约须知
                    this.detailInfo.noticeArr = this.detailInfo.notice.split('\n');
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?care_order_uuid=' + this.care_order_uuid + '&user_uuid=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                    this.dealImgWidth();
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound?tip=' + res['msg'];
                } else {
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                    this.dealImgWidth();
                }
            }, err => {
                this.$root.pageLoading.layer = 2;
            });
        },
        // 图片长宽判断
        dealImgWidth() {
            setTimeout(() => {
                this.detailInfo.reserve_option.forEach((item, index) => {
                    if (item.type === 3) {
                        this.signUpInfo['imageArr' + index].forEach((img, i) => {
                            let currentImg = this.$refs['uploadImg' + index + i] && this.$refs['uploadImg' + index + i][0];
                            img.isWidthLg = (currentImg.clientWidth > currentImg.clientHeight);
                        });
                        // console.log(this.signUpInfo['imageArr' + index]);
                    }
                });
                this.$forceUpdate();
            }, 100);
        },
        // 验证本地缓存手机验证码
        verifySmsCode() {
            if (!this.inApp && this.isEdit && localStorage.getItem('care_verify_mobile') && localStorage.getItem('care_verify_mobile_pre') && localStorage.getItem('care_verify_code')) {
                this.$http.post('iber-care/verify-sms-code', {
                    mobile: localStorage.getItem('care_verify_mobile'),
                    mobile_pre: localStorage.getItem('care_verify_mobile_pre'),
                    code: localStorage.getItem('care_verify_code'),
                }).then((res) => {
                    if (res && res.code === 0) {
                        this.getOrderInfo();
                    } else {
                        this.checkCUserMobile();
                    }
                });
            } else {
                this.checkCUserMobile();
            }
        },
        // 获取订单预订手机号
        getReserveMobile() {
            if (!this.inApp && this.isEdit) {
                if (this.rootUserInfo['c_user_uuid']) {
                    this.$http.get('/iber-care/get-reserve-mobile', {
                        care_order_uuid: this.care_order_uuid
                    }).then((res) => {
                        if (res && res.code === 0) {
                            this.iBerCareLogin.mobile = res.data.mobile;
                            this.iBerCareLogin.mobile_pre = res.data.mobile_pre;

                            // 设置本地缓存
                            localStorage.setItem('care_verify_mobile', res.data.mobile);
                            localStorage.setItem('care_verify_mobile_pre', res.data.mobile_pre.replace(/\+/, ''));

                            // 验证本地缓存手机验证码
                            this.verifySmsCode();
                        } else {
                            // this.$toast(res.msg);
                            window.location.href = window.baseUrl + '/error/notfound?tip=' + res['msg'];
                        }
                    });
                }
            }
        },
        // 判断手机号是否是当前用户的
        checkCUserMobile() {
            this.$http.get('/c-user/check-c-user-mobile', {
                c_user_uuid: this.rootUserInfo['c_user_uuid'],
                mobile: this.iBerCareLogin.mobile,
                mobile_pre: this.iBerCareLogin.mobile_pre
            }).then((res) => {
                if (res && res.code === 0) {
                    this.showiBerCareLogin = !res.data.checked;
                } else {
                    this.showiBerCareLogin = true;
                }
            });
        },
        // 验证手机号和验证码弹窗回传
        updateConfirmMobile($event) {
            this.getOrderInfo();
        },
        // 更改手机号
        changePhone() {
            this.existPhone = false;
            this.signUpInfo.mobile = '';
            this.signUpInfo.code = '';
            this.$refs.mobileInput.focus();
        },
        // 获取验证码
        getCode() {
            if (this.getCoded) {
                this.getCoded = false;

                let area = this.signUpInfo.mobile_pre.split("+");
                // 无区号提示
                if (!area[1]) {
                    this.getCoded = true;
                    this.$toast(this.simply ? "请选择区号" : "請選擇區號");
                    return;
                }
                // 无手机号码提示
                if (!this.signUpInfo.mobile) {
                    this.getCoded = true;
                    this.$toast(this.simply ? "请填写手机号" : "請填寫手機號");
                    return;
                }
                this.$http.post('/iber-care/care-sms-code', {
                    mobile_pre: this.signUpInfo.mobile_pre.replace(/\+/, ''),
                    mobile: this.signUpInfo.mobile,
                    type: 'IBERCARE_RESERVE_CODE'
                }).then((res) => {
                    if (res && res.code === 0) {
                        //业务模型 
                        this.$toast(this.simply ? "验证码已发送" : "驗證碼已發送");
                        this.codeState = false;
                        let time = 60;
                        this.codeInterval = window.setInterval(() => {
                            if (time == 0) {
                                this.second = 60;
                                this.codeState = true;
                                this.codeAgainState = true;
                                window.clearInterval(this.codeInterval);
                                return;
                            }
                            time--;
                            this.second = time;
                        }, 1000);
                    } else {
                        this.$toast(res.msg);
                    }
                    this.getCoded = true;
                }, err => {
                    this.getCoded = true;
                });
            }
        },
        // 改变单选选项
        changeOption(care_product_reserve_info_uuid, option) {
            this.signUpInfo[care_product_reserve_info_uuid] = option;
            console.log(this.signUpInfo);
            this.$forceUpdate();
        },
        // 展示区号选择器
        showPrePhonePicker() {
            this.$refs.prePhonePicker.open();
        },
        // 更新区号
        updatePrePhone(event) {
            // this.preSelectDefalut = event;
            if (/\+852/.test(event)) {
                this.signUpInfo.mobile_pre = '+852';
                this.signUpInfo.area = '香港';
            } else if (/\+853/.test(event)) {
                this.signUpInfo.mobile_pre = '+853';
                this.signUpInfo.area = this.simply ? '澳门' : '澳門';
            } else if (/\+86/.test(event)) {
                this.signUpInfo.mobile_pre = '+86';
                this.signUpInfo.area = this.simply ? '中国大陆' : '中國大陸';
            }
        },
        // 生成年龄数组
        createAgesArr() {
            for (let i = 0; i <= 100; i++) {
                this.ages.push(i + (this.simply ? '岁' : '歲'));
            }
        },
        // 展示年龄选择器
        showAgePicker() {
            this.$refs.agePicker.open();
        },
        // 更新年龄
        updateAge(event) {
            if (!/undefined/.test(event)) {
                this.signUpInfo.reserve_age = parseInt(event);
            }
        },
        // 展示门店选择器
        showStorePicker() {
            this.$refs.storePicker.open();
        },
        // 更新门店
        updateStore(event) {
            this.signUpInfo.store = event;
            // 清空时间选择
            this.signUpInfo.reserve_date = {
                date: '', // 日期
                slot: '', // 时间段
                weekday: '1', // 周几
                section: '' // 上午 下午
            };
        },
        // 展示时间选择器
        showCareDatePicker() {
            if (!this.signUpInfo.store.care_company_store_uuid) {
                this.$toast(this.simply ? "请先选择预约门店" : "請先選擇預約門店");
            } else {
                this.$refs.careDatePicker.open();
            }
        },
        // 更新显示时间
        updateSelectDate($event) {
            this.signUpInfo.reserve_date = $event;
        },
        // 预览图片
        openAlbum(url, index) {
            if (url.constructor !== Array) {
                url = [{ url: url }];
            }

            if (this.inApp) {
                plug.getAgentAlbum(url, index ? index : 0);
                return;
            }

            if (plug.wx.platform) {
                plug.wxAlbum(url, index ? index : 0);
                return;
            }
            this.comAAMData.imgArray = url;
            this.comAAMData.index = index ? index : 0;
            this.comAAMData.layer = 1;
        },
        // 打开服务协议
        showServiceAgreement() {
            this.$refs.serviceAgreement.open();
        },
        // 更新协议状态
        updateAgree($event) {
            this.selectProtocol = $event;
        },
        // 删除图片
        deleteImgFn(item, index, imgIndex) {
            this.signUpInfo[item.care_product_reserve_info_uuid].splice(imgIndex, 1);
            this.signUpInfo['imageArr' + index].splice(imgIndex, 1);
            this.$forceUpdate();
            console.log(this.signUpInfo);
        },
        // 更新是否保存框(不保存)
        updateConfirm($event) {
            if ($event) {
                // 浏览器自动后退
                window.history.back();

                // if (this.isEdit) {
                //     this.$router.push({
                //         path: '/iber-care/order-detail',
                //         query: {
                //             user_uuid: this.userUuid,
                //             care_order_uuid: this.care_order_uuid
                //         }
                //     });
                // } else {
                //     this.$router.push({
                //         path: '/iber-care/product-detail',
                //         query: {
                //             user_uuid: this.userUuid,
                //             care_product_uuid: this.care_product_uuid
                //         }
                //     });
                // }
                // if (sessionStorage.getItem('redirct_url')) {
                //     window.location.href = sessionStorage.getItem('redirct_url');
                // } else {
                //     window.history.back();
                // }
            } else {
                this.bindBackFn();
            }
        },
        // app内上传图片处理
        uploadPicInApp(item, index) {
            if (this.inApp) {
                const _this = this;
                // 最多只能上傳10張圖片
                if (_this.signUpInfo[item.care_product_reserve_info_uuid].length <= 9) {
                    // 获取App回调图片方法
                    window.getAppUploadPic = function(arrStr) {
                        if (arrStr) {
                            let picArr = arrStr.split(',');
                            picArr.forEach((img, i) => {
                                // 传给后端数据
                                _this.signUpInfo[item.care_product_reserve_info_uuid].push(img);
                                // 页面渲染数据
                                _this.signUpInfo['imageArr' + index].push({
                                    url: img
                                });
                                _this.$forceUpdate();
                                // 图片长宽判断
                                _this.dealImgWidth();
                            });
                        }
                    };
                    // 进入app上传
                    _this.appFn.commonFn('selectPictures', { number: 10 - _this.signUpInfo[item.care_product_reserve_info_uuid].length });
                } else {
                    _this.$toast(_this.simply ? "最多只能上传10张图片" : "最多只能上傳10張圖片");
                }
            }
        },
        // 上传的图片处理
        uploadPicChange(event, item, index) {
            const _this = this;
            if (_this.signUpInfo[item.care_product_reserve_info_uuid].length <= 9) {
                // 全局对象，不同function使用传递数据
                const imgFile = {};

                //图片方向角 added by lzk
                var Orientation = null;

                // 多圖上傳
                for (let i = 0; i < event.target.files.length; i++) {
                    const file = event.target.files[i];
                    if (file) {
                        // 获取完file就销毁上传元素
                        _this.showUploadInput = false;
                        const imgMasSize = 1024 * 1024 * 10; // 10MB

                        // EXIF js 可以读取图片的元信息  https://github.com/exif-js/exif-js
                        EXIF.getData(file, function() {
                            EXIF.getAllTags(this);
                            Orientation = EXIF.getTag(this, 'Orientation');
                            console.log(Orientation);
                        });

                        // 检查文件类型
                        if (['jpeg', 'png', 'gif', 'jpg'].indexOf(file.type.split("/")[1]) < 0) {
                            // 自定义报错方式
                            _this.$toast(_this.simply ? "文件类型仅支持 jpeg/png/gif" : "文件類型僅支持 jpeg/png/gif");
                            // 读取完重新生成上传元素
                            setTimeout(() => {
                                _this.showUploadInput = true;
                            });
                        } else if (file.size > imgMasSize) {
                            // 文件大小限制
                            console.log('图片大小：' + file.size);
                            // 文件大小自定义限制
                            _this.$toast(_this.simply ? "文件大小不能超过10MB" : "文件大小不能超過10MB");
                            // 读取完重新生成上传元素
                            setTimeout(() => {
                                _this.showUploadInput = true;
                            });
                        } else {
                            // 图片压缩之旅
                            transformFileToDataUrl(file);
                        }
                    }
                }

                // 将file转成dataUrl
                function transformFileToDataUrl(file) {
                    _this.$root.blueLoadingParams.show = true;

                    const imgCompassMaxSize = 400 * 1024; // 超过 400k 就压缩

                    // 存储文件相关信息
                    imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
                    imgFile.size = file.size;
                    imgFile.name = file.name;
                    imgFile.lastModifiedDate = file.lastModifiedDate;

                    // 封装好的函数
                    const reader = new FileReader();

                    // file转dataUrl是个异步函数，要将代码写在回调里
                    reader.onload = function(e) {
                        const result = e.target.result;

                        if (result.length < imgCompassMaxSize) {
                            compress(result, false); // 图片不压缩
                        } else {
                            compress(result); // 图片压缩
                        }
                    };

                    reader.readAsDataURL(file);
                }

                // 使用canvas绘制图片并压缩
                function compress(dataURL, shouldCompress = true) {
                    const img = new window.Image();

                    img.src = dataURL;

                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (Orientation != undefined && Orientation != "" && Orientation != 1) {
                            // 旋转处理
                            switch (Orientation) {
                                case 6: //需要顺时针（向左）90度旋转
                                    rotateImg(this, 'left', canvas);
                                    break;
                                case 8: //需要逆时针（向右）90度旋转
                                    rotateImg(this, 'right', canvas);
                                    break;
                                case 3: //需要180度旋转
                                    rotateImg(this, 'right', canvas); //转两次
                                    rotateImg(this, 'right', canvas);
                                    break;
                            }
                        } else {
                            canvas.width = img.width;
                            canvas.height = img.height;

                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        }

                        let compressedDataUrl;

                        if (shouldCompress) {
                            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.1);
                            console.log('压缩后图片：' + compressedDataUrl.length);
                        } else {
                            compressedDataUrl = canvas.toDataURL('image/jpeg', 1);
                        }

                        // 最多只能上傳10張圖片
                        if (_this.signUpInfo[item.care_product_reserve_info_uuid].length <= 9) {
                            // 传给后端数据
                            _this.signUpInfo[item.care_product_reserve_info_uuid].push(compressedDataUrl);
                            // 页面渲染数据
                            _this.signUpInfo['imageArr' + index].push({
                                url: compressedDataUrl,
                                imgWigth: img.width,
                                imgHeight: img.height,
                                isWidthLg: img.width > img.height
                            });
                        } else {
                            _this.$toast(_this.simply ? "最多只能上传10张图片" : "最多只能上傳10張圖片");
                        }
                        // 截取保留10张
                        _this.signUpInfo[item.care_product_reserve_info_uuid].slice(9);
                        console.log(_this.signUpInfo[item.care_product_reserve_info_uuid]);
                        _this.signUpInfo['imageArr' + index].slice(9);
                        console.log(_this.signUpInfo['imageArr' + index]);

                        // _this.signUpInfo[item.care_product_reserve_info_uuid].push(file);

                        // 读取完重新生成上传元素
                        _this.showUploadInput = true;
                        _this.$root.blueLoadingParams.show = false;

                        _this.$forceUpdate();

                        // console.log(_this.signUpInfo[item.care_product_reserve_info_uuid]);
                        // console.log(_this.signUpInfo['imageArr' + index]);
                    }
                }

                //对图片旋转处理 added by lzk
                function rotateImg(img, direction, canvas) {
                    // 最小与最大旋转方向，图片旋转4次后回到原方向  
                    var min_step = 0;
                    var max_step = 3;
                    // var img = document.getElementById(pid);  
                    if (img == null) return;
                    // img的高度和宽度不能在img元素隐藏后获取，否则会出错  
                    var height = img.height;
                    var width = img.width;
                    // var step = img.getAttribute('step');  
                    var step = 2;
                    if (step == null) {
                        step = min_step;
                    }
                    if (direction == 'right') {
                        step++;
                        //旋转到原位置，即超过最大值  
                        step > max_step && (step = min_step);
                    } else {
                        step--;
                        step < min_step && (step = max_step);
                    }
                    //旋转角度以弧度值为参数  
                    var degree = step * 90 * Math.PI / 180;
                    var ctx = canvas.getContext('2d');
                    switch (step) {
                        case 0:
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0);
                            break;
                        case 1:
                            canvas.width = height;
                            canvas.height = width;
                            ctx.rotate(degree);
                            ctx.drawImage(img, 0, -height);
                            break;
                        case 2:
                            canvas.width = width;
                            canvas.height = height;
                            ctx.rotate(degree);
                            ctx.drawImage(img, -width, -height);
                            break;
                        case 3:
                            canvas.width = height;
                            canvas.height = width;
                            ctx.rotate(degree);
                            ctx.drawImage(img, -width, 0);
                            break;
                    }
                }
            } else {
                _this.$toast(_this.simply ? "最多只能上传10张图片" : "最多只能上傳10張圖片");
                // 读取完重新生成上传元素
                _this.showUploadInput = true;
            }

        },
        // 提交表单
        submitForm() {
            if (this.selectProtocol || this.isEdit) {
                this.$root.blueLoadingParams.show = true;
                const formData = {};
                // 来源 1=顾问下单；2=客户下单；3=客户付款；4=iber后台
                formData.source = (this.inApp ? 1 : 2);
                // c端用户uuid
                formData.c_user_uuid = this.rootUserInfo['c_user_uuid'];

                if (this.isEdit) {
                    // 订单uuid
                    formData.care_order_uuid = this.care_order_uuid;
                } else {
                    // 产品uuid
                    formData.care_product_uuid = this.care_product_uuid
                }

                // 分店uuid
                if (!this.signUpInfo.store.care_company_store_uuid) {
                    this.formPass = false;
                    this.$toast(this.selectStoreTip);
                    this.$root.blueLoadingParams.show = false;
                    return;
                } else {
                    this.formPass = true;
                    formData.care_company_store_uuid = this.signUpInfo.store.care_company_store_uuid;
                }

                // 预约时间
                if (!this.signUpInfo.reserve_date.date || !this.signUpInfo.reserve_date.slot) {
                    this.formPass = false;
                    this.$toast(this.selectTimeTip);
                    this.$root.blueLoadingParams.show = false;
                    this.$refs.careDatePicker.open();
                    return;
                } else {
                    this.formPass = true;
                    // 预约日期
                    formData.reserve_date = this.signUpInfo.reserve_date.date;
                    // 预约时间段
                    formData.reserve_time = this.signUpInfo.reserve_date.slot;
                }

                // 预约姓名
                if (!this.signUpInfo.reserve_name) {
                    this.formPass = false;
                    this.$toast(this.selectNameTip);
                    this.$root.blueLoadingParams.show = false;
                    return;
                } else {
                    this.formPass = true;
                    formData.reserve_name = this.signUpInfo.reserve_name;
                }

                // 预约年龄
                if (this.signUpInfo.reserve_age === undefined) {
                    this.formPass = false;
                    this.$toast(this.selectAgeTip);
                    this.$root.blueLoadingParams.show = false;
                    return;
                } else {
                    this.formPass = true;
                    formData.reserve_age = this.signUpInfo.reserve_age;
                }

                // 预约手机号码前缀
                formData.mobile_pre = this.signUpInfo.mobile_pre.replace(/\+/, '');

                // 预约手机号码
                if (!this.signUpInfo.mobile) {
                    this.formPass = false;
                    this.$toast(this.selectMobileTip);
                    this.$root.blueLoadingParams.show = false;
                    return;
                } else {
                    this.formPass = true;
                    formData.mobile = this.signUpInfo.mobile;
                }

                // 预约手机验证码
                if (!this.inApp && !this.existPhone && !this.signUpInfo.code) {
                    this.formPass = false;
                    this.$toast(this.selectCodeTip);
                    this.$root.blueLoadingParams.show = false;
                    return;
                } else {
                    this.formPass = true;
                    formData.code = this.signUpInfo.code;
                }

                // 自定义选项封装在reserve_info
                if (this.detailInfo.reserve_option && (this.detailInfo.reserve_option.length > 0)) {
                    formData.reserve_info = {};
                    for (let i = 0; i < this.detailInfo.reserve_option.length; i++) {
                        let item = this.detailInfo.reserve_option[i];
                        if (!this.signUpInfo[item.care_product_reserve_info_uuid] || (item.type === 3 && (!item.ext || (item.ext === 'is_vaccine' && (this.signUpInfo.reserve_age < 18))) && this.signUpInfo[item.care_product_reserve_info_uuid].length === 0)) {
                            this.formPass = false;
                            if (item.type === 3) {
                                this.$toast(item.name);
                            } else {
                                this.$toast(item.value);
                            }
                            this.$root.blueLoadingParams.show = false;
                            break;
                            return;
                        } else {
                            this.formPass = true;
                            formData.reserve_info[item.care_product_reserve_info_uuid] = this.signUpInfo[item.care_product_reserve_info_uuid];
                        }
                    }
                    formData.reserve_info = JSON.stringify(formData.reserve_info);
                }

                console.log(formData);

                // 通过以上全部必填项才发请求
                if (this.formPass) {
                    this.$http.post(this.isEdit ? 'iber-care/edit-reserve-info' : '/iber-care/submit-reserve-info', formData).then((res) => {
                        if (res && res.code === 0) {
                            // 手机号存储本地
                            localStorage.setItem('preserve_mobile', formData.mobile);
                            localStorage.setItem('preserve_mobile_pre', formData.mobile_pre);

                            // 存储验证码和手机号，可以查看列表和对应订单
                            formData.mobile && localStorage.setItem('care_verify_mobile', formData.mobile);
                            formData.mobile_pre && localStorage.setItem('care_verify_mobile_pre', formData.mobile_pre);
                            formData.code && localStorage.setItem('care_verify_code', formData.code);

                            if (this.isEdit) {
                                //小程序
                                if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                                    cmn.miniPagePath({
                                        object: this,
                                        route: "/pages/frame/detail",
                                        path: "/iber-care/order-detail",
                                        title: plug.sm(this.simply, '订单详情'),
                                        query: {
                                            user_uuid: this.userUuid,
                                            care_order_uuid: res.data.care_order_uuid
                                        }
                                    });
                                    return;
                                }

                                if (this.inApp) {
                                    // 进入订单详情页
                                    this.appFn.commonFn('orderEditorSuccess');
                                } else {
                                    // 进入H5订单详情页
                                    // this.$router.push({
                                    //     path: "/iber-care/order-detail",
                                    //     query: {
                                    //         user_uuid: this.userUuid,
                                    //         care_order_uuid: res.data.care_order_uuid
                                    //     }
                                    // });
                                    window.location.href = window.baseUrl + '/iber-care/order-detail?care_order_uuid=' + res.data.care_order_uuid + '&user_uuid=' + this.userUuid + '&in_app=0&auth=' + window.auth + '&card=' + this.card;
                                }
                            } else {
                                //小程序支付
                                if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                                    cmn.miniWxPay({
                                        object: this,
                                        type: 'redirectTo',
                                        user_uuid: this.userUuid,
                                        care_order_uuid: res.data.care_order_uuid,
                                        page_back: "page-reserve"
                                    });
                                    this.$root.blueLoadingParams.show = false;
                                    return;
                                }
                                if (this.inApp) {
                                    //进入app支付
                                    this.appFn.commonFn('iBerCarePay', {
                                        care_order_uuid: res.data.care_order_uuid,
                                        mobile_pre: formData.mobile_pre,
                                        mobile: formData.mobile
                                    });
                                } else {
                                    //进入H5支付
                                    // this.$router.push({
                                    //     path: "/iber-care/pay-select",
                                    //     query: {
                                    //         user_uuid: this.userUuid,
                                    //         care_order_uuid: res.data.care_order_uuid,
                                    //         mobile_pre: formData.mobile_pre,
                                    //         mobile: formData.mobile
                                    //     }
                                    // });
                                    window.location.href = window.baseUrl + '/iber-care/pay-select?care_order_uuid=' + res.data.care_order_uuid + '&user_uuid=' + this.userUuid + '&in_app=0&auth=' + window.auth + '&mobile=' + formData.mobile + '&mobile_pre=' + formData.mobile_pre + '&language=' + this.lang;
                                }
                            }
                        } else {
                            this.$toast(res.msg);
                        }
                        this.$root.blueLoadingParams.show = false;
                    }, err => {
                        this.$root.blueLoadingParams.show = false;
                    });
                }
            } else if (!this.selectProtocol) {
                this.$toast(this.simply ? '请阅读并同意服务协议' : '請閱讀並同意服務協議');
            }
        },
        // 转换星期几
        transformWeek(week) {
            let weekCn = '';
            week = parseInt(week);
            switch (week) {
                case 0:
                    weekCn = '星期日';
                    break;
                case 1:
                    weekCn = '星期一';
                    break;
                case 2:
                    weekCn = '星期二';
                    break;
                case 3:
                    weekCn = '星期三';
                    break;
                case 4:
                    weekCn = '星期四';
                    break;
                case 5:
                    weekCn = '星期五';
                    break;
                case 6:
                    weekCn = '星期六';
            }
            return weekCn;
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
    outline: none;
    border: none;
    padding: 0;
}

input::-webkit-input-placeholder {
    font-size: .15rem;
    color: #999999;
    font-family: PingFangSC-Regular;
}

input:-moz-placeholder {
    font-size: .15rem;
    color: #999999;
    font-family: PingFangSC-Regular;
}

input:-ms-input-placeholder {
    font-size: .15rem;
    color: #999999;
    font-family: PingFangSC-Regular;
}

input:-internal-autofill-selected {
    background-color: rgb(255, 255, 255) !important;
}

.separate-line {
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #E8E8E8;
    display: block;
    z-index: 15;
    transform: scaleY(0.5);
}

.care-sign-up {
    font-family: PingFangSC-Regular;
    width: 100%;
}

.care-sign-up-content {
    width: 100%;
    background-color: #F6F6F6;
    padding: 0 .12rem 0 .12rem;
}

.care-sign-up-bottom-box {
    height: .44rem;
    width: 100%;
}

.banner-box {
    width: 100%;
    height: 1.52rem;
    background-image: linear-gradient(270deg, #4C7FFF 0%, #3863FF 100%);
    position: absolute;
    top: 0;
    left: 0;
}

.banner-box img {
    width: 100%;
}

.top-title-box {
    font-family: PingFangSC-Medium;
    font-size: .22rem;
    color: #FFFFFF;
    line-height: .3rem;
    margin: .16rem;
}

.product-detail-box {
    background-color: #FFFFFF;
    box-shadow: 0 .01rem .08rem 0 rgba(29, 29, 29, 0.06);
    border-radius: .06rem;
    width: 100%;
    height: 1.04rem;
    padding: .12rem;
}

.product-detail-box img {
    width: 1.08rem;
    height: .8rem;
    float: left;
    border-radius: .04rem;
}

.product-detail-box .right-box {
    width: calc(100% - 1.08rem);
    height: .8rem;
    float: right;
    padding-left: .12rem;
}

.product-detail-box .right-box .title {
    font-family: PingFangSC-Medium;
    font-size: .15rem;
    color: #333333;
    line-height: .2rem;
    width: 100%;
    height: .4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.product-detail-box .right-box .price {
    margin-top: .05rem;
    font-family: PingFangSC-Medium;
    font-size: .14rem;
    color: #FF3B23;
    line-height: .17rem;
}

.product-detail-box .right-box .coin {
    margin-top: .04rem;
    font-size: .13rem;
    color: #666666;
    line-height: .16rem;
}

.user-prompt {
    width: 100%;
    height: .36rem;
    color: #FBFBFB;
    line-height: .36rem;
    background-image: linear-gradient(270deg, #4C7FFF 0%, #3863FF 100%);
    box-shadow: 0 .01rem .02rem 0 rgba(0, 0, 0, 0.16);
    border-radius: .06rem;
    margin-top: .12rem;
    text-align: center;
}

.sign-up-form {
    background: #FFFFFF;
    box-shadow: 0 .01rem .08rem 0 rgba(29, 29, 29, 0.06);
    border-radius: .08rem;
    width: 100%;
    padding: 0 .12rem;
    margin-top: .12rem;
}

.sign-up-form-block {
    width: 100%;
    min-height: .5rem;
    line-height: .5rem;
    /* border-bottom: 1px solid #E8E8E8; */
    font-size: .15rem;
    color: #2A2A2A;
    cursor: pointer;
    overflow: hidden;
}

.sign-up-form-block:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 1px;
    width: 100%;
    background-color: #E8E8E8;
    display: block;
    z-index: 15;
    transform: scaleY(0.5);
}

.sign-up-form-block.after-none:after {
    height: 0;
}

.name-input {
    width: 100%;
    height: .25rem;
    line-height: .25rem;
    margin-top: .115rem;
    margin: .12rem 0;
    display: inline-block;
    font-size: .15rem;
}

.textarea-input {
    border: 1px solid #E8E8E8;
    border-radius: .08rem;
    width: calc(100% - 1px);
    margin-left: 1px;
    height: 1.2rem;
    resize: none;
    padding: .1rem .12rem;
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .22rem;
    margin: .16rem 0;
    display: block;
}

.mobile-pre {
    float: left;
    height: .5rem;
    cursor: pointer;
}

.mobile-pre-arraw {
    font-size: .13rem;
}

.mobile-input {
    float: left;
    width: calc(100% - 1.62rem);
    height: .24rem;
    line-height: .24rem;
    font-size: .15rem;
    margin-top: .12rem;
    padding: 0 .12rem;
    background-color: #FFFFFF;
}

.mobile-input-show {
    z-index: 1000;
    position: absolute;
    right: .48rem;
    top: 0;
}

.mobile-change {
    float: right;
    color: #3364E4;
    cursor: pointer;
}

.code-input {
    float: left;
    width: calc(100% - .94rem);
    height: .24rem;
    line-height: .24rem;
    font-size: .15rem;
    margin-top: .11rem;
}

.phone-code {
    float: right;
    color: #999999;
    line-height: .5rem;
    width: .94rem;
    cursor: pointer;
    text-align: right;
}

.code-second {
    float: right;
    width: .94rem;
    font-size: .15rem;
    color: #CCCCCC;
    text-align: right;
    line-height: .5rem;
}

.gender-select {
    float: right;
    height: .49rem;
}

.gender-select .selected {
    color: #3364E4;
    cursor: pointer;
}

.gender-select .unselected {
    color: #999999;
    cursor: pointer;
}

.gender-select-block {
    float: left;
    margin-right: .16rem;
}

.gray-text {
    color: #999999;
}

.right-arraw {
    float: right;
    color: #979797;
    font-size: .1rem;
}

.store-name {
    width: calc(100% - .2rem);
    line-height: .26rem;
    float: left;
    margin: .1rem 0;
}

.sample-box {
    overflow: hidden;
    margin-top: -.07rem;
    width: 100%;
    float: left;
    padding-left: 1px;
}

.sample-box .pic {
    float: left;
    width: .74rem;
    height: .74rem;
    margin: .08rem .24rem .16rem 0;
}

.sample-box .pic .upload-icon {
    line-height: .74rem;
    font-size: .74rem;
    color: #999999;
    cursor: pointer;
}

.sample-box .pic .upload-com {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    cursor: pointer;
}

.sample-box .pic-inner {
    width: 100%;
    height: 100%;
    border-radius: .04rem;
    overflow: hidden;
}

.sample-box .pic-block {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 100%;
}

.sample-box .delete-img {
    position: absolute;
    top: -0.07rem;
    right: -0.07rem;
    font-size: .14rem;
    line-height: .14rem;
    color: #FF0D0D;
    z-index: 2;
}

.attention-box {
    width: 100%;
    margin-top: .12rem;
    padding: .16rem .12rem;
    font-size: .14rem;
    color: #999999;
    line-height: .23rem;
    background-color: #FFFFFF;
    box-shadow: 0 .01rem .08rem 0 rgba(29, 29, 29, 0.06);
    border-radius: .08rem;
    margin-bottom: .24rem;
}

.attention-box .title {
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .2rem;
}

.attention-box .desc {
    margin-top: .12rem;
}

.bottom-btn-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .54rem;
    background-color: #FFFFFF;
    padding: .08rem .16rem;
    z-index: 20;
}

.select-protocol {
    font-size: .16rem;
    color: #999999;
    line-height: .38rem;
    float: left;
    cursor: pointer;
}

.center-text {
    float: left;
    text-align: center;
    line-height: .19rem;
    font-size: .13rem;
    color: #999999;
    margin-left: .04rem;
}

.center-text .protocol-text {
    color: #3364E4;
    cursor: pointer;
}

.bottom-btn-box .sm-btn {
    float: right;
    width: 2.2rem;
    height: .38rem;
    line-height: .38rem;
    border-radius: .19rem;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: .15rem;
    color: #FFFFFF;
    background-color: #DDDDDD;
    cursor: pointer;
}

.bottom-btn-box .sm-btn.pay {
    background-color: #3364E4;
}

.bottom-btn-box .lg-btn {
    width: 100%;
}
</style>
