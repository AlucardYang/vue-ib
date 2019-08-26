<template>
    <div class="product-list com-scroll-y">
        <ul v-if="illnessInfo.list && (illnessInfo.list.length > 0)" class="list-block">
            <li v-for="(item, index) in illnessInfo.list">
                <div class="list-company">{{item.company_name}}</div>
                <div class="list-detail">
                    <div v-for="(item1, index1) in item.product_list" class="list-detail-inner" :style="{'border-bottom': (index1 === item.product_list.length - 1) ? 'none' : '1px solid #E8E8E8'}" @click="goProductDetail(item1)">
                        <img :src="item1.thumbnail" class="list-img">
                        <div class="list-content">
                            <div class="list-title">
                                <span v-show="item1.customer_case" class="list-example">例</span>
                                <span class="list-title-span com-nowrap">{{item1.name}}</span>
                            </div>
                            <div class="list-desc">{{item1.short_abstract}}</div>
                            <ul class="list-tags">
                                <!-- <li class="list-tags-li" v-for="(item2, index2) in item1.tags && item1.tags.split(',')">{{item2}}</li> -->
                                <li class="list-tags-li" v-for="(item2, index2) in item1.category_name" :style="{color: item2.text_color, 'background-color': item2.bg_color}">{{item2.name}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "IllnessGetShareList",
    data() {
        return {
            illness_uuid: this.$route.query['illness_uuid'] ? this.$route.query['illness_uuid'] : (this['urlParams'] ? this.urlParams['illness_uuid'] : ''),
            share_link: decodeURIComponent(this.$route.query['share_link']),
            share: {},
            illnessInfo: {}
        };
    },
    components: {},
    created() {
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            illness_uuid: this.illness_uuid,
            target_type: '13',
            router: window.location.pathname
        };
    },
    mounted() {
        this.getShareList();
    },
    methods: {
        // 获取疾病关联产品列表
        getShareList() {
            this.$http.get('/illness/get-share-list', {
                illness_uuid: this.illness_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.illnessInfo = res.data;
                    // 设置分享信息
                    this.share.title = this.illnessInfo.share.title;
                    this.share.thumbImage = this.illnessInfo.share.thumbImage;
                    this.share.desc = this.illnessInfo.share.desc;
                    this.share.link = this.share_link;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                }
            }, err => {});
        },
        goProductDetail(item) {
            window.location.href = window.baseUrl + '/product/detail?product_uuid=' + item.product_uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-list {
    width: 100%;
    background-color: #F6F6F6;
}

.list-block {
    width: 100%;
}

.list-company {
    height: .41rem;
    line-height: .41rem;
    font-size: .14rem;
    color: #999999;
    padding: 0 .12rem;
}

.list-detail {
    padding: 0 .12rem;
    background-color: #FFFFFF;
}

.list-detail-inner {
    border-bottom: 1px solid #E8E8E8;
    overflow: hidden;
    padding: .16rem 0;
    cursor: pointer;
}

.list-detail-inner:hover {
    opacity: 0.7;
}

.list-img {
    width: .88rem;
    margin-left: -.12rem;
    float: left;
}

.list-content {
    width: calc(100% - .76rem);
    float: left;
}

.list-title {
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .16rem;
    overflow: hidden;
    cursor: pointer;
}

.list-title span {
    float: left;
}

.list-example {
    width: .18rem;
    height: .16rem;
    background-color: #3364E4;
    border-radius: .02rem;
    text-align: center;
    font-size: .1rem;
    color: #FFFFFF;
    line-height: .16rem;
    margin-right: .04rem;
}

.list-title-span {
    width: calc(100% - .22rem);
}

.list-desc {
    margin: .07rem 0 .04rem 0;
    width: 100%;
    height: .34rem;
    font-size: .13rem;
    color: #999999;
    line-height: .17rem;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.list-tags {
    width: 100%;
    overflow: hidden;
}

.list-tags-li {
    border-radius: .02rem;
    font-size: .1rem;
    color: #999999;
    line-height: .12rem;
    padding: .03rem .08rem;
    float: left;
    margin-right: .08rem;
    margin-top: .08rem;
}
</style>