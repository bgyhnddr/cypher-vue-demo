<template>
<!--Home Page-->
<div class="homePage-bac" v-if="showHomePageModel">
  <div class="homepage-head">
    <group>
      <table border="0" class="platform-message" cellspacing=0 cellpadding=0>
        <tbody>
          <tr>
            <td width="22%">
              <img class="vux-x-img ximg-demo" src="/static/TestIMG/brand_logo_href.png" alt="用户头像" />
            </td>
            <td>{{user.brandName}}</td>
            <td> </td>
            <td style="display:none">
              <p>存款&nbsp;:&nbsp;
                <label>金额数</label>
              </p>
              <p>存货&nbsp;:&nbsp;
                <label>存货数量</p>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </group>
    <group>
      <div class="search">
        <x-input class="weui_cell_primary" title="" :value.sync="keyword" placeholder="输入需要查看的功能名称" :show-clear=false :required="false"></x-input>
        <div class="search-button">
          <button class="weui_btn weui_btn_primary" @click="search">.</button>
        </div>
      </div>
    </group>
  </div>
  <div v-if="showFuncList" class="homepage-icon">
    <flexbox :gutter="0" wrap="wrap">
      <flexbox-item :span="1/3" v-for="item in btn_list">
        <div class="flex-demo">
          <button @click="goto(item)">
            <img :src.sync="item.iconhref" alt="icon">
            <h4 class="weui_media_title">{{item.title}}</h4>
          </button>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</div>
<!--Home Page Search-->
<div class="homePage-list">
  <home-page-search :show-home-page-model.sync="showHomePageModel" :keyword.sync="keyword" :user-level.sync="user.userLevel"></home-page-search>
  <div>

    <alert :show.sync="showErrorNoHandled" button-text="确认">{{errorMsgNoHandled}}</alert>
    <alert :show.sync="showCatchError" button-text="确认" @on-hide="onHide">{{catchErrorMsg}}</alert>
  </div>
</div>
<div class="all-footer">© 2016 ShareWin.me 粤ICP备14056388号</div>
</template>

<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  Alert
} from 'vux'
import authAPI from '../api/auth'
import employmentAPI from '../api/employment'
import HomePageSearch from './HomePageSearch'
var request = require('../extend/http-request')


export default {
  components: {
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    Alert,
    HomePageSearch
  },
  data() {
    return {
      btn_list: [{
        title: '我的账户',
        link: '/accountManagement',
        iconhref: '/static/TestIMG/account.png',
        isShow: true
      }, {
        title: '成员招募',
        link: '/employManagement',
        iconhref: '/static/TestIMG/recruiting.png',
        isShow: true
      }, {
        title: '货品出售',
        link: '',
        iconhref: '/static/TestIMG/sell.png',
        isShow: true,
        callback: function() {
          window.wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"],
            success: function(res) {
              window.location.href = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            }
          })
        }
      }, {
        title: '货品查验',
        link: '',
        iconhref: '/static/TestIMG/inspection.png',
        isShow: true,
        callback: function() {
          window.wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"],
            success: function(res) {
              window.location.href = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            }
          })
        }
      }, {
        title: '我的货品',
        link: '/productManagement',
        iconhref: '/static/TestIMG/goods.png',
        isShow: true
      }, {
        title: '我的团队',
        link: '/teamManagement',
        iconhref: '/static/TestIMG/team.png',
        isShow: true
      }, {
        title: '订货管理',
        link: '',
        iconhref: '/static/TestIMG/order.png',
        isShow: true
      }, {
        title: '我的库存',
        link: '',
        iconhref: '/static/TestIMG/inventory.png',
        isShow: true
      }, {
        title: '',
        link: '',
        iconhref: '/static/TestIMG/more.png',
        isShow: true
      }],
      showHomePageModel: true,
      keyword: null,
      user: {
        brandName: null,
        userLevel: null
      },
      showErrorNoHandled: false,
      errorMsgNoHandled: null,
      showCatchError: false,
      catchErrorMsg: null,
      showFuncList: false
    }
  },
  methods: {
    init() {
      var that = this
      that.getBrandName()
      that.getShowItem()
    },
    search() {
      this.$broadcast('search')
    },
    getBrandName() {
      var that = this
      employmentAPI.getBrandInfo().then(function(result) {
        that.user.brandName = result.name
      }).catch(function(err) {
        that.showCatchError = true
        that.catchErrorMsg = "找不到您的品牌商资料,请重新登录"
      })
    },
    getShowItem() {
      var that = this
      employmentAPI.getBrandInfo().then(function(result) {
        that.user.userLevel = result.brand_role.level
        if (result.brand_role.level == "4") {
          for (var item in that.btn_list) {
            if (that.btn_list[item]['title'] == "成员招募") {
              that.btn_list.splice(item, 1)
            }
          }
        }
        that.showFuncList = true
      }).catch(function(err) {
        that.showCatchError = true
        that.catchErrorMsg = "找不到您的个人资料,请重新登录"
      })
    },
    goto(item) {
      if (item.callback) {
        item.callback()
      } else if (item.link == "") {
        if (item.title != "") {
          this.showErrorNoHandled = true
          this.errorMsgNoHandled = "该功能正在开发中"
        }
      } else if (item.title === "成员招募" && this.user.userLevel === "4") {
        this.showErrorNoHandled = true
        this.errorMsgNoHandled = "您当前等级无法使用此功能"
      } else if (Number(this.user.userLevel) > 0 && item.title == "我的货品") {
        this.showErrorNoHandled = true
        this.errorMsgNoHandled = "该功能只对品牌商用户开放"
      } else {
        this.$route.router.go(item.link)
      }
    },
    onHide() {
      authAPI.logout()
      this.$route.router.go('/')
    }
  },
  events: {
    showHomePage() {
      this.showHomePageModel = true
      this.keyword = null
      this.$dispatch("backButton", "退出")
    }
  },
  ready() {
    this.init()
  }
}
</script>
<style lang="less">
.homePage-bac {
    min-height: 485px;
}
.homepage-head {
    background: url("/static/TestIMG/homepage_header.png") no-repeat;
    background-size: cover;

}
.homePage-bac .weui_cells {
    margin-top: 0;
}
/*返回按钮*/

.vux-demo-header-box button {}

span.headerTransition-transition {
    font-size: 4.5vw;
    /*14px*/
}

div.icon_btn {
    width: 110px;
}

table.platform-message {
    width: 94%;
    margin: 3% auto auto;
    color: #fff;
    font-size: 4.7vw;
    font-family: "微软雅黑";
}

table.platform-message img {
    width: 3.3em;
    height: 3.3em;
    border-radius: 50%;
    border: 2px solid #fff;
}

table.platform-message label {
    color: #646464;
}
table.platform-message p:nth-child(1) {
    margin-bottom: 5%;
}

.search .weui_cell {
    padding: 9px;
}

.search .weui_cell_hd {
    width: 0;
}

.search input.weui_input {
    width: 97%;
    background: rgba(0, 0, 0, 0.5);
    margin: auto;
    padding-left: 2%;
    height: 2.3em;
    font-family: "微软雅黑";
    font-size: 4.7vw;
    color: #9b9c9c;
    border: 1px solid #645f5f;
}

.search-button {
    position: absolute;
    z-index: 10000000;
    right: 4%;
    top: 23%;
    width: 10%;
}

.search-button button.weui_btn.weui_btn_primary {

    line-height: 2.0;
    background: url("/static/TestIMG/search.png");
    background-size: 100%;
    background-repeat: no-repeat;
    color: rgba(0, 0, 0, 0.5);
}
.search-button .weui_btn:after {
    border: 0;
}
.search .weui_icon_warn:before {
    font-size: 4.5vw;
    /*14px*/
    color: #f43530;
}
/*九宫格*/

.homepage-icon {
    background: #fff;
    border-top: 1px solid #d3d1d1;
    border-bottom: 1px solid #d3d1d1;
}

.homepage-icon .vux-flexbox-item .flex-demo {

    border-right: 1px solid #d3d1d1;
    border-bottom: 1px solid #d3d1d1;
    font-size: 4.5vw;
    color: #292832;

}

.homepage-icon .vux-flexbox-item .flex-demo h4 {
    font-family: "微软雅黑";
    font-weight: normal;
    margin-top: -5%;
    color: #292832;
    font-size: 4.5vw;
}
.homepage-icon .vux-flexbox-item:last-child .flex-demo h4 {
    color: #fff;
}
.homepage-icon .vux-flexbox-item:nth-child(3) .flex-demo,
.homepage-icon .vux-flexbox-item:nth-child(6) .flex-demo,
.homepage-icon .vux-flexbox-item:nth-child(9) .flex-demo {
    border-right: 0;
}
.homepage-icon .vux-flexbox-item:nth-child(7) .flex-demo,
.homepage-icon .vux-flexbox-item:nth-child(8) .flex-demo,
.homepage-icon .vux-flexbox-item:nth-child(9) .flex-demo {
    border-bottom: 0;

}
.homepage-icon .vux-flexbox-item:nth-child(7) .flex-demo h4,
.homepage-icon .vux-flexbox-item:nth-child(8) .flex-demo h4 {
    color: gray;
}
.homepage-icon .vux-flexbox-item:nth-child(7) .flex-demo button img,
.homepage-icon .vux-flexbox-item:nth-child(8) .flex-demo button img {
    -webkit-filter: grayscale(1);
    /* Webkit */
    filter:gray;
    /* IE6-9 */
    filter: grayscale(1);
    /* W3C */

}
.homepage-icon .vux-flexbox-item:nth-child(3) .flex-demo button img {
    width: 38%;
}
.homepage-icon .vux-flexbox-item:nth-child(9) .flex-demo button img {

    width: 61%!important;
}
.homepage-icon .vux-flexbox-item:nth-child(7) .flex-demo,
.homepage-icon .vux-flexbox-item:nth-child(8) .flex-demo {

    background: url("/static/TestIMG/construction.png") 50% 92% no-repeat;
    background-size: 67%;

}
.homepage-icon .vux-flexbox-item:nth-child(6) .flex-demo button {
    padding-bottom: 24%;

}
.homepage-icon .vux-flexbox-item button {
    background: none;
    border: 0;
    width: 100%;
    padding: 14% 0 25%;
}
.homepage-icon .vux-flexbox-item:nth-child(1) button:active,
.homepage-icon .vux-flexbox-item:nth-child(2) button:active {
    background: #eaeaea;

}

.homepage-icon .vux-flexbox-item button img {
    width: 39%;
}
.homepage-footer {

    width: 100%;
    text-align: center;
    color: #979797;
    font-size: 3vw;
    font-family: "微软雅黑";
    line-height: 2.5em;
    margin-bottom: 10%;
}

.weui_cells {
    margin-top: 0;
}
.homePage-list .weui_dialog_ft {
    width: 89%;
    margin: 8% auto;
    background: #0bb20c;
    line-height: 35px;
    border-radius: 2px;
}

.homePage-list .weui_dialog_bd {
    color: #000000;
    font-size: 5.2vw;
    /*17px*/
    font-family: "微软雅黑";
    margin-top: 5%;
}

.homePage-list .weui_btn_dialog.primary {
    font-size: 4.9vw;
    /*16px*/
    color: #fff;
}

.homePage-list .weui_dialog {
    width: 92%;
}
.weui_tab_bd{
  padding-top: 46px
}
.vux-demo-header-box{
  z-index: 1000000000;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0

}
.weui_tab{
  position: inherit!important;
  height: auto!important;
}
</style>
