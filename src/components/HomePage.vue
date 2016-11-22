<template>
<div>
  <div class="homePage-bac">
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
    <div>
      <div class="homepage-icon">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/3" v-for="item in btn_list">
            <div class="flex-demo">
              <button @click="goto(item)">
                <img :src.sync="item.iconhref" alt="icon" v-show="item.isShow">
                <h4 class="weui_media_title">{{item.title}}</h4>
              </button>
            </div>
          </flexbox-item>
        </flexbox>
      </div>


      <alert :show.sync="show" button-text="确认">{{errorMsg}}</alert>
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
var request = require('../extend/http-request')


export default {
  components: {
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    Alert
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
        title: '货品销售',
        link: '',
        iconhref: '/static/TestIMG/sell.png',
        isShow: true,
        callback: function() {
          window.wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"]
          })
        }
      }, {
        title: '货品查验',
        link: '',
        iconhref: '/static/TestIMG/inspection.png',
        isShow: true,
        callback: function() {
          window.wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"]
          })
        }
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
        title: '我的团队',
        link: '',
        iconhref: '/static/TestIMG/team.png',
        isShow: true
      }, {
        title: '我的货品',
        link: '',
        iconhref: '/static/TestIMG/goods.png',
        isShow: true
      }, {
        title: '',
        link: '',
        iconhref: '/static/TestIMG/more.png',
        isShow: true
      }],
      keyword: null,
      user: {
        agentInfo: {},
        brandName: null
      },
      show: false,
      errorMsg: null
    }
  },
  methods: {
    init() {
      var that = this
      that.getAgentInfo()
      this.getJsConfig()
    },
    search() {
      var reg = /^[\u4e00-\u9fa5]*$/ //全中文
      if (this.keyword == null || this.keyword == '') {
         this.show = true
         this.errorMsg = "搜索框内容不能为空"
      } else if (!reg.test(this.keyword)) {
        this.show = true
        this.errorMsg = "填写格式错误，请填写中文"
      } else {
        this.$route.router.go('/homePage/search/' + this.keyword)
      }
    },
    getAgentInfo() {
      var that = this
      employmentAPI.getAgentInfo().then(function(result) {
        that.user.agentInfo = result
      }).catch(function(err) {
        this.show = true
        this.errorMsg = err
      })

      employmentAPI.getBrandInfo().then(function(result) {
        that.user.brandName = result.name
      }).catch(function(err) {
        this.show = true
        this.errorMsg = err
      })
    },
    goto(item) {
      if (item.callback) {
        item.callback()
        return
      }
      if (item.link == "") {
        if (item.title == "") {
          return
        }
        this.show = true
        this.errorMsg = "该功能正在开发中"
      } else {
        this.$route.router.go(item.link)
      }
    },
    getJsConfig() {
      request.post('/wechat/getJsConfig', {
        list: ['scanQRCode'],
        url: window.location.href
      }).then((result) => {
        window.wx.config(result)
      })
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
    color: #292832;
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
    background: #fff;
    margin: auto;
    padding-left: 2%;
    height: 2.3em;
    font-family: "微软雅黑";
    font-size: 4.7vw;
    color: #9b9c9c;
    border: 1px solid #d3d1d1;
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
    background: #fff;
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
.homepage-icon .vux-flexbox-item:nth-child(5) .flex-demo h4,
.homepage-icon .vux-flexbox-item:nth-child(6) .flex-demo h4,
.homepage-icon .vux-flexbox-item:nth-child(7) .flex-demo h4,
.homepage-icon .vux-flexbox-item:nth-child(8) .flex-demo h4 {
    color: gray;
}
.homepage-icon .vux-flexbox-item:nth-child(5) .flex-demo button img,
.homepage-icon .vux-flexbox-item:nth-child(6) .flex-demo button img,
.homepage-icon .vux-flexbox-item:nth-child(7) .flex-demo button img,
.homepage-icon .vux-flexbox-item:nth-child(8) .flex-demo button img {
    -webkit-filter: grayscale(1);
    /* Webkit */
    filter:gray;
    /* IE6-9 */
    filter: grayscale(1);
    /* W3C */

}
.homepage-icon .vux-flexbox-item:nth-child(9) .flex-demo button img {

    width: 61%!important;
}
.homepage-icon .vux-flexbox-item:nth-child(5) .flex-demo,
.homepage-icon .vux-flexbox-item:nth-child(6) .flex-demo,
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
</style>
