<template>
    <div v-show="!inApp && (card !== 'hide') && agentInfo.nickname && agentInfo.share_show_business_card != 0" class="consultant-card-box" :style="{'padding-top': agentInfo.template === '/user/a-a-c' ? '.34rem' : '.16rem'}">
        <div v-if="topTip" class="top-tip">{{topTip}}</div>
        <div class="share-from-tip-box">
            <div v-if="shareFrom" class="top"><span style="color: #ddd">————</span><span :class="pageName">&nbsp;分享自&nbsp;</span><span style="color: #ddd">————</span></div>
            <div v-if="shareHealth" class="top"><span style="color: #ddd">————</span><span>&nbsp;{{simply ? '健康顾问' : '健康顧問'}}&nbsp;</span><span style="color: #ddd">————</span></div>
        </div>
    
    
        <!-- 默认个人主页 -->
        <div v-if="agentInfo.template === '/user/index'" class="consultant-card" :style="{'background-position': (card !== 'full') ? '0 0' : 'center center','min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn">
                <li id="button_personhomepage" class="bottom-btn-style left" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 黑色商务 -->
        <div v-if="agentInfo.template === '/user/a-a-a'" class="consultant-card a-a-a" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-a">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-a">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-a">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-a">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-a" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-a" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 绿色化 -->
        <div v-if="agentInfo.template === '/user/a-a-b'" class="consultant-card a-a-b" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem', 'margin-top': agentInfo.template === '/user/a-a-b' ? '.4rem' : '0'}">
            <img class="a-a-b-left-leaf" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-b/left-leaf.png">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-b" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-b">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-b">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-b">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-b">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-b">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-b" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-b" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 圣诞 -->
        <div v-if="agentInfo.template === '/user/a-a-c'" class="consultant-card a-a-c" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <img class="a-a-c-antlers" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-c/antlers.png">
            <div class="consultant-card-top a-a-c" :style="{'border-radius': card !== 'full' ? '0.08rem' : '0.08rem 0.08rem 0 0'}">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-c" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-c">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box a-a-c" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-c">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-c">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-c">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-c" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-c" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 元旦 -->
        <div v-if="agentInfo.template === '/user/a-a-d'" class="consultant-card a-a-d" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <img class="a-a-d-cloud" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-d/cloud.png">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-d" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-d">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-d">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-d">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-d">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-d">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-d" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-d" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 老少平安 -->
        <div v-if="agentInfo.template === '/user/a-a-e'" class="consultant-card a-a-e" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-e" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-e">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-e">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-e">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-e">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-e">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-e" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-e" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 白色商务 -->
        <div v-if="agentInfo.template === '/user/a-a-f'" class="consultant-card a-a-f" :style="{'background-position': ((!isAlwaysSimple && card === 'full') || isAlwaysFull) && 'top center', 'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-f" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-f">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-f">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-f">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-f">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-f" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-f" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 新年 -->
        <div v-if="agentInfo.template === '/user/a-a-g'" class="consultant-card a-a-g" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-g" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-g">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-g">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-g">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-g">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-g">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-g" @click="goAgentPage">
                    <img class="a-a-g-icon" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-g/door.png">
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-g" @click="goConsultAgent">
                    <img class="a-a-g-icon" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-g/lion.png">
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 怪兽 -->
        <div v-if="agentInfo.template === '/user/a-a-h'" class="consultant-card a-a-h" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top a-a-h">
                <div class="head-image a-a-h">
                    <a id="button_avatar" class="head-image-a a-a-h" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-h" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-h">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-h">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-h">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-h">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-h">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-h" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-h" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- 紫色星空 -->
        <div v-if="agentInfo.template === '/user/a-a-i'" class="consultant-card a-a-i" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-i" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-i">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-i">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-i">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-i">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-i">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-i" @click="goAgentPage">
                    <img class="a-a-i-icon" style="width: .19rem; margin-top: -.02rem" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-i/home.png">
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-i" @click="goConsultAgent">
                    <img class="a-a-i-icon" src="https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-i/consult.png">
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- a-a-j -->
        <div v-if="agentInfo.template === '/user/a-a-j'" class="consultant-card a-a-j" :class="agentInfo.skin_identity" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-j" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-j">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-j">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-j">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-j">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-j">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-j" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-j" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- a-a-k -->
        <div v-if="agentInfo.template === '/user/a-a-k'" class="consultant-card a-a-k" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-k" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-k">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-k">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-k">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-k">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-k">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-k" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-k" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- a-a-l -->
        <div v-if="agentInfo.template === '/user/a-a-l'" class="consultant-card a-a-l" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-l" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-l">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-l">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-l">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-l">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-l">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-l" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-l" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!-- a-a-m -->
        <div v-if="agentInfo.template === '/user/a-a-m'" class="consultant-card a-a-m" :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar a-a-m" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-m">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box a-a-m">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
                    <i class="iconfont qrcode-icon a-a-m">&#xe7ad;</i>
                </div>
            </div>
            <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-m">
                <div v-for="item in agentInfo.signatures">{{item}}</div>
            </div>
            <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-m">
                <li id="button_personhomepage" class="bottom-btn-style left a-a-m" @click="goAgentPage">
                    <i class="iconfont">&#xe6cb;</i>
                    <span>{{visit_homepage}}</span>
                </li>
                <li id="button_askrightnow" class="bottom-btn-style a-a-m" @click="goConsultAgent">
                    <i class="iconfont">&#xe6cc;</i>
                    <span>{{consult_now}}</span>
                </li>
            </ul>
        </div>
    
        <!--a-a-n-->
        <div v-if="agentInfo.template === '/user/a-a-n'" class="consultant-card a-a-n"
          :style="{'min-height': ((card !== 'full') || agentInfo.signature) ? '.96rem' : '1.5rem'}">
          <div class="consultant-card-top">
            <div class="head-image">
              <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                <div v-if="agentInfo.avatar" class="head-image-avatar a-a-n"
                  :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar a-a-m">&#xe685;</i>
              </a>
              <i v-if="agentInfo.realname_verified === '0'" class="iconfont head-image-vip gray">&#xe6ca;</i>
              <img v-else class="head-image-vip" style="width:.2rem;border:0;" src="https://static.iberhk.com/v2/home/a-a-n_vip.png" alt="">
            </div>
            <div class="name-number-box a-a-n">
              <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
            </div>
            <div id="button_codeset" v-if="agentInfo.qrcode" class="qrcode-box" @click="openWxQrcode">
              <img src="https://static.iberhk.com/v2/home/a-a-n_qr.png" style='margin-top:.12rem;' alt="">
              <!--<i class="iconfont qrcode-icon a-a-n">&#xe7ad;</i>-->
              <!--<img src="https://static.iberhk.com/v2/home/a-a-n_qr.png" alt="">-->
            </div>
          </div>
          <div v-if="((!isAlwaysSimple && card === 'full') || isAlwaysFull) && agentInfo.signature" class="signature-box a-a-n">
            <div v-for="item in agentInfo.signatures">{{item}}</div>
          </div>
          <ul v-if="(!isAlwaysSimple && card === 'full') || isAlwaysFull" class="bottom-btn a-a-n">
            <li id="button_personhomepage" class="bottom-btn-style left a-a-n" @click="goAgentPage">
              <i class="iconfonti">&#xe726;</i>
              <span>{{visit_homepage}}</span>
            </li>
            <li id="button_askrightnow" class="bottom-btn-style a-a-n" @click="goConsultAgent">
              <i class="iconfont">&#xe6cc;</i>
              <span>{{consult_now}}</span>
            </li>
          </ul>
        </div>
    
    
    </div>
</template>

<script>
import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';

import AgentWechat from "@/components/shared/component/card/agentwechat.vue";

export default {
    name: "ConsultantCard",
    props: {
      pageName: {
        type: String,
        default() {
          return '';
        }
      },
        userUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 来源的uuid，咨询顾问用
        targetUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 显示顶部提示，例如计算器
        topTip: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 显示分享至
        shareFrom: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 显示健康顾问
        shareHealth: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 分享类型，咨询顾问需用到
        fromType: {
            type: String,
            default: function() {
                return '11';
            }
        },
        // 总是显示整张卡片
        isAlwaysFull: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 总是显示简易卡片
        isAlwaysSimple: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
    },
    data() {
        return {
            agentInfo: {
                avatar: '',
                nickname: '',
                realname_verified: '0',
                signature: '',
                wechat_num: '',
                wx_qrcode: ''
            },
            // 显示完整名片
            card: this.$route.query['card'] ? this.$route.query['card'] : ((this['urlParams'] && this.urlParams['card']) ? this.urlParams['card'] : 'full'),
            visit_homepage: this.simply ? '访问主页' : '訪問主頁',
            consult_now: this.simply ? '立即咨询' : '立即諮詢',
        };
    },
    components: {
        AgentWechat
    },
    watch: {
        userUuid: {
            handler: function(value, oldvalue) {
                this.getAgentInfo();
            }
        },
        targetUuid(val, oldVal) {
        //   console.log("targetUuid: " + val);
          this.$root.agentCardInfo.targetUuid = this.targetUuid;
        //   console.log(this.$root.agentCardInfo);
        }
    },
    mounted() {
        this.getAgentInfo();
    },
    created() {
      //console.log("targetUuid: " + this.targetUuid);
    },
    methods: {
        getAgentInfo() {
            if (this.userUuid) {
                this.$http.get('/user/get-agent-card', {
                    user_uuid: this.userUuid
                }).then(res => {
                    if (res && res.code === 0) {
                        this.agentInfo = res.data;
                        window.agentInfo = res.data;
                        // rich_agent_card新底部卡片模板是否上线线上环境
                        !this.agentInfo.template && (this.agentInfo.template = '/user/index');
                        // this.agentInfo.signature = '';
                        this.agentInfo.signatures = this.agentInfo.signature.split('\n');

                        //模板类型
                        let colorList = ["orange", "green", "yellow", "red", "cyan", "pink", "blue"]
                        this.agentInfo.skin_identity = plug.valueValid(res.data.skin_identity) ? res.data.skin_identity : colorList[6];

                        // agent信息
                        this.$root.agentCardInfo.targetUuid = this.targetUuid;
                        this.$root.agentCardInfo.nickname = this.agentInfo.nickname;
                        this.$root.agentCardInfo.mobile = this.agentInfo.mobile;
                        // console.log(this.$root.agentCardInfo);

                        // 微信弹窗信息
                        // qrcode_type: 1 微信二维码，2 facebook二维码 3 个人主页二维码 
                        this.$root.agentCardInfo.qrcode_type = this.agentInfo.qrcode_type;
                        // this.$root.agentCardInfo.qrcode_type = 3;
                        this.$root.agentCardInfo.qrcode = this.agentInfo.qrcode;
                        // this.$root.agentCardInfo.qrcode = '';
                        this.$root.agentCardInfo.wechat_num = this.agentInfo.wechat_num;
                        // this.$root.agentCardInfo.wechat_num = '';

                        this.agentInfo.card = this.card;
                        this.$emit('getAgentInfo', this.agentInfo);
                    }
                })
            }
        },
        // 打开顾问设定的二维码
        openWxQrcode() {
            // 点击顾问二维码埋点统计
            CommonJS.youmengTrackEvent('底部名片', '底部名片-QR Code', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_codeset');

            plug.openAgentQrcode({
                object: this,
                qrcode_type: window.agentInfo.qrcode_type,
                qrcode: window.agentInfo.qrcode,
                wechat_num: window.agentInfo.wechat_num
            })
        },
        // 联系顾问
        goConsultAgent() {
            // 点击咨询顾问埋点统计
            CommonJS.youmengTrackEvent('底部名片', '底部名片-立即咨询', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_askrightnow');

            // 小程序环境
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                plug.authAddress({
                    object: this, //Vue对象或子对象，注意作用域
                    user_uuid: this.userUuid,
                    answer_uuid: this.targetUuid,
                    from_type: this.$root.fromType
                });
            } else {
                // 打开留言流程弹窗
                plug.openGuestBook({
                    object: this,
                    wx_qrcode: window.agentInfo.wx_qrcode,
                    wechat_num: window.agentInfo.wechat_num
                });
            }
        },
        // 跳转顾问个人主页
        goAgentPage(type) {
            const _this = this;
            if (window.__wxjs_environment == "miniprogram" || (window.platform === 7)) {
                //  || /wechatdevtools/.test(navigator.userAgent.toLowerCase())  微信工具调试查看
                const wxSdk = require('weixin-js-sdk');
                setTimeout(() => {
                    wxSdk.miniProgram.switchTab({
                        url: '/pages/broker/broker?scene=' + _this.userUuid
                    });
                }, 500);
            } else {
                // 点击个人主页埋点统计
                if (type === 'avatar') {
                    CommonJS.youmengTrackEvent('底部名片', '底部名片-头像', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_avatar');
                } else {
                    CommonJS.youmengTrackEvent('底部名片', '底部名片-顾问主页', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_personhomepage');
                }
                // 进入个人主页
                !this.inApp && plug.addrDeclare({
                    object: this, //Vue对象或子对象，注意作用域
                    app: this.inApp,
                    page: /page./ig.test(window.location.host) ? this.agentInfo.home_page_url + '&is_share=1' : this.agentInfo.home_page_url, //申报地址成功后跳转URL
                    user_uuid: this.userUuid //agent ID
                });
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.consultant-card-box {
    box-sizing: border-box;
    width: 100%;
    padding: 0.16rem 0.12rem;
    min-height: 1.28rem;
    background-color: #fff;
}

.top-tip {
    color: #CCCCCC;
    font-size: 0.15rem;
    line-height: 0.18rem;
    margin-bottom: .14rem;
}

.consultant-card {
    position: relative;
    width: 100%;
    min-height: 0.92rem;
    background: #FFFFFF;
    box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.10);
    border-radius: .08rem;
    padding: 0.17rem 0.16rem;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/index/bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
}

.ibercare-order-detail .consultant-card {
  box-shadow: none;
  background-image: none;
}

.consultant-card.a-a-a {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-a/bg.png');
}

.consultant-card.a-a-b {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-b/flower.png');
    background-size: calc(100% - .4rem) calc(100% - .4rem);
    background-position: .2rem .2rem;
}

.consultant-card.a-a-c {
    background-image: none;
    padding: 0;
    margin-top: .2rem;
}

.consultant-card.a-a-d {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-d/bg.png');
}

.consultant-card.a-a-e {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-e/bg.png');
    background-position: center center;
    background-size: 58%;
}

.consultant-card.a-a-f {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-f/bg.png');
}

.consultant-card.a-a-g {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-g/bg.png');
    background-repeat: repeat-y;
}

.consultant-card.a-a-h {
    background-image: none;
}

.consultant-card.a-a-i {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-i/bg.png');
    background-repeat: repeat-y;
    background-size: 74%;
    background-position: top right;
}

.consultant-card.a-a-n {
    background-image: none;
}

.consultant-card-top {
    position: relative;
    height: .6rem;
    z-index: 2;
}

.consultant-card-top.a-a-c {
    padding: .17rem .16rem;
    border-radius: .08rem .08rem 0 0;
    height: .96rem;
}

.consultant-card-top.a-a-h {
    height: .56rem;
}

.head-image {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    height: 0.6rem;
    width: 0.6rem;
    border-radius: 50%;
    background: #fff;
}

.head-image.a-a-h {
    height: 0.56rem;
    width: 0.56rem;
}

.head-image-a {
    display: inline-block;
    height: 0.6rem;
    width: 0.6rem;
    cursor: pointer;
}

.head-image-a.a-a-h {
    height: 0.56rem;
    width: 0.56rem;
}

.head-image-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: 100%;
    background-position: center center;
    font-size: .6rem;
    color: #DDDDDD;
    line-height: 0.6rem;
}

.head-image-avatar.a-a-b {
    border: .02rem solid #FFFFFF;
}

.head-image-avatar.a-a-c {
    border: .02rem solid #5D2807;
}

.head-image-avatar.a-a-h {
    border: .02rem solid #FFFFFF;
}

.head-image-avatar.a-a-i {
    border: .02rem solid #FFFFFF;
}

.head-image-vip {
    position: absolute;
    right: -0.06rem;
    bottom: 0;
    color: #FF2700;
    line-height: 0.16rem;
    font-size: .16rem;
    z-index: 3;
    border: .02rem solid #fff;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: #FFFFFF;
    text-align: center;
}

.name-number-box {
    width: calc(100% - 1.22rem);
    height: .48rem;
    font-size: .17rem;
    color: #2A2A2A;
    line-height: .24rem;
    font-weight: bold;
    word-break: break-all;
    position: absolute;
    top: .07rem;
    left: .74rem;
}

.name-number-box.a-a-b {
    color: #1E3C1E;
}

.name-number-box.a-a-c {
    max-width: calc(100% - 1.42rem);
    left: .92rem;
    top: .24rem;
}

.name-number-box.a-a-g {
    color: #56201E;
}

.name-number-box span {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    max-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.qrcode-box {
    width: 0.6rem;
    text-align: center;
    position: absolute;
    top: 0;
    right: -.12rem;
}

.qrcode-box.a-a-c {
    right: 0;
    top: .16rem;
}

.qrcode-box img {
    margin-top: .15rem;
    display: inline-block;
    width: .32rem;
    height: .32rem;
    cursor: pointer;
}

.qrcode-box span {
    display: inline-block;
    font-size: .12rem;
    color: #999999;
    line-height: .15rem;
}

.qrcode-icon {
    color: #3669DD;
    font-size: .31rem;
    line-height: .6rem;
    cursor: pointer;
}

.qrcode-icon.a-a-a {
    color: #2A2A2A;
}

.qrcode-icon.a-a-b {
    color: #54A456;
}

.qrcode-icon.a-a-c {
    color: #D50F12;
}

.qrcode-icon.a-a-d {
    color: #E20C0F;
}

.qrcode-icon.a-a-e {
    color: #BD5A13;
}

.qrcode-icon.a-a-f {
    color: #E8B875;
}

.qrcode-icon.a-a-g {
    color: #E53803;
}

.qrcode-icon.a-a-h {
    color: #9554CD;
}

.qrcode-icon.a-a-i {
    color: #3D2967;
}

.signature-box {
    font-size: .15rem;
    color: #4B4B4B;
    line-height: .2rem;
    margin: .18rem 0 .56rem 0;
    text-align: left;
}

.signature-box.a-a-b {
    color: #1E3C1E;
    margin: .14rem 0 .56rem 0;
}

.signature-box.a-a-c {
    padding: 0 .16rem .72rem .16rem;
    margin: -.02rem 0 0 0;
}

.signature-box.a-a-d {
    color: #2A2A2A;
}

.signature-box.a-a-e {
    color: #2A2A2A;
}

.signature-box.a-a-f {
    color: #2A2A2A;
}

.bottom-btn {
    position: absolute;
    width: calc(100% - .32rem);
    bottom: .16rem;
    left: .16rem;
    height: .4rem;
    line-height: .4rem;
    border-radius: 0 0 .07rem .07rem;
    font-size: .15rem;
    color: #FFFFFF;
}

.bottom-btn.a-a-a {
    background-color: #FFFFFF;
}

.bottom-btn-style {
    position: absolute;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    top: 0;
    right: .12rem;
    width: 1.32rem;
    height: .4rem;
    line-height: .4rem;
    border-radius: .2rem;
    background-image: linear-gradient(-180deg, #5494F0 0%, #2D5CD8 100%);
    box-shadow: 0 8px 10px 0 rgba(73, 132, 232, 0.20);
    transition: all 300ms;
}

.bottom-btn-style:hover {
    opacity: 0.8;
}

.bottom-btn-style.left {
    left: .12rem;
}

.bottom-btn-style.a-a-a {
    background-image: linear-gradient(-180deg, #545454 0%, #2A2A2A 100%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
}

.bottom-btn-style.a-a-b {
    background-image: linear-gradient(90deg, #63E185 0%, #34C04D 100%);
    box-shadow: 0 4px 10px 0 rgba(9, 94, 22, 0.16);
}

.bottom-btn-style.a-a-c {
    background-image: linear-gradient(-180deg, #EC2329 0%, #D50F12 100%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.bottom-btn-style.a-a-d {
    background-image: linear-gradient(-180deg, #E53B3E 2%, #E20C0F 98%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.bottom-btn-style.a-a-e {
    background-image: linear-gradient(-180deg, #D58D29 0%, #BD5A13 100%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.bottom-btn-style.a-a-f {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-f/right-btn.png');
    background-size: 100% 100%;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
}

.bottom-btn-style.a-a-f.left {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-f/left-btn.png');
}

.bottom-btn-style.a-a-g {
    background-image: linear-gradient(-179deg, #F45907 0%, #E53803 100%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.bottom-btn-style.a-a-h {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-h/right-btn.png');
    background-size: 100% 100%;
    box-shadow: 0 4px 10px 0 rgba(122, 56, 179, 0.20);
}

.bottom-btn-style.a-a-h.left {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-h/left-btn.png');
}

.bottom-btn-style.a-a-i {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-i/right-btn.png');
    background-size: 100% 100%;
    box-shadow: 0 4px 10px 0 rgba(97, 67, 160, 0.20);
}

.bottom-btn-style.a-a-i.left {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-i/left-btn.png');
}

.bottom-btn-style.a-a-j {
    background-image: none;
}

.bottom-btn-style.a-a-n {
  background-image: linear-gradient(101deg, #FD8F61 0%, #F84B62 56%, #74398A 100%);
  box-shadow: 0 .1rem .2rem 0 #FFCBCD;
}

div.consultant-card.a-a-j.orange i.head-image-vip {
    color: #ff7842;
}

div.consultant-card.a-a-j.green i.head-image-vip {
    color: #0FCA42;
}

div.consultant-card.a-a-j.yellow i.head-image-vip {
    color: #FFCB27;
}

div.consultant-card.a-a-j.red i.head-image-vip {
    color: #F92C2C;
}

div.consultant-card.a-a-j.cyan i.head-image-vip {
    color: #09BFDB;
}

div.consultant-card.a-a-j.pink i.head-image-vip {
    color: #FF2196;
}

div.consultant-card.a-a-j.blue i.head-image-vip {
    color: #3364e4;
}

div.consultant-card.a-a-j.orange i.qrcode-icon {
    color: #ff7842;
}

div.consultant-card.a-a-j.green i.qrcode-icon {
    color: #0FCA42;
}

div.consultant-card.a-a-j.yellow i.qrcode-icon {
    color: #FFCB27;
}

div.consultant-card.a-a-j.red i.qrcode-icon {
    color: #F92C2C;
}

div.consultant-card.a-a-j.cyan i.qrcode-icon {
    color: #09BFDB;
}

div.consultant-card.a-a-j.pink i.qrcode-icon {
    color: #FF2196;
}

div.consultant-card.a-a-j.blue i.qrcode-icon {
    color: #3364e4;
}

div.consultant-card.a-a-j.orange .bottom-btn-style {
    background-color: #ff7842;
}

div.consultant-card.a-a-j.green .bottom-btn-style {
    background-color: #0FCA42;
}

div.consultant-card.a-a-j.yellow .bottom-btn-style {
    background-color: #FFCB27;
}

div.consultant-card.a-a-j.red .bottom-btn-style {
    background-color: #F92C2C;
}

div.consultant-card.a-a-j.cyan .bottom-btn-style {
    background-color: #09BFDB;
}

div.consultant-card.a-a-j.pink .bottom-btn-style {
    background-color: #FF2196;
}

div.consultant-card.a-a-j.blue .bottom-btn-style {
    background-color: #3364e4;
}

div.consultant-card.a-a-k i.head-image-vip {
    color: #0E89D6;
}

div.consultant-card.a-a-k i.qrcode-icon {
    color: #0E89D6;
}

div.consultant-card.a-a-k .bottom-btn-style {
    background-image: linear-gradient(135deg, #30AAF7 0%, #0E89D6 100%);
    box-shadow: 0 8px 24px 0 rgba(7, 126, 173, 0.41);
}

div.consultant-card.a-a-l i.head-image-vip {
    color: #ff4722;
}

div.consultant-card.a-a-l i.qrcode-icon {
    color: #ff4722;
}

div.consultant-card.a-a-l .bottom-btn-style {
    background-image: none;
    background-color: #ff4722;
}

div.consultant-card.a-a-m i.head-image-vip {
    color: #111;
}

div.consultant-card.a-a-m i.qrcode-icon {
    color: #111;
}

div.consultant-card.a-a-m .bottom-btn-style {
    background-image: none;
    background-color: #111;
}

.share-from-tip-box {
    width: 100%;
    text-align: center;
    font-size: .13rem;
    color: #999999;
    line-height: .16rem;
    padding: 0 0 .2rem 0;
}

.a-a-b-left-leaf {
    position: absolute;
    width: 40%;
    top: -.31rem;
    left: -0.1rem;
    z-index: 1;
}

.a-a-c-antlers {
    position: absolute;
    width: .91rem;
    top: -.31rem;
    left: .03rem;
    z-index: 3;
}

.a-a-d-new-year {
    position: absolute;
    width: 2.23rem;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.a-a-d-cloud {
    position: absolute;
    width: .51rem;
    top: .55rem;
    left: .04rem;
    z-index: 3;
}

.a-a-g-icon {
    width: .28rem;
}

.a-a-i-icon {
    width: .24rem;
}

.agent-name-span {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #FFFFFF;
    display: inline-block;
    padding: 0 .11rem 0 .03rem;
}

.agent-name-span.index {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/index/bg.png');
    background-size: 3.47rem auto;
    background-position: center center;
}

.agent-name-span.a-a-d {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-d/bg.png');
    background-size: 3.47rem auto;
}

.agent-name-span.a-a-g {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-g/bg.png');
    background-size: 3.47rem auto;
}
.head-image-vip.gray {
  color: #ddd !important;
}


/*分享至*/
div.share-from-tip-box span.disease {
  color: #fff;
}
</style>
