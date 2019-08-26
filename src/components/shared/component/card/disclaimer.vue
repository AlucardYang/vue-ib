<!-- 免责声明 -->
<template>
    <div class="disclaimer-des" :style="{'padding-bottom': inApp ? '.12rem' : '.86rem'}">
        {{text}}
    </div>
</template>

<script>
export default {
    name: "Disclaimer",
    props: {
        text: {
            type: String,
            default: function() {
                return this.simply ? '免责声明：本资讯集自公开网络，iBer不保证讯息的完整性和准确性；也不代表iBer的观点和立场。如有疑问，请发邮件至邮箱：Service@iBerHK.com' : '免責聲明：本資訊集自公開網絡，iBer不保證訊息的完整性和準確性；也不代表iBer的觀點和立場。如有疑問，請發郵件至郵箱：Service@iBerHK.com';
            }
        }
    },
    data() {
        return {};
    },
    components: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.disclaimer-des {
    padding: .12rem .12rem .66rem .12rem;
    font-size: .12rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .22rem;
    background-color: #FFFFFF;
}
</style>
