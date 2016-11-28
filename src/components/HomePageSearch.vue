<template>
<div class="function-search-bac" v-show="!showHomePageModel">
  <div class="function-search">
    <group>
      <x-input class="weui_cell_primary" title='' placeholder="输入需要查看的功能名称" :value.sync="keyword" :show-clear=false :required="false"></x-input>
      <div class="function-search-button">
        <button class="weui_btn weui_btn_primary" @click="search">.</button>
      </div>
    </group>
  </div>
  <div class="function-search-list">
    <h1>功能</h1>
    <group v-if="showResult">
      <a class="weui_cell" v-for="item in funcList" v-link="item.link" v-show="item.isShow">
        <div class="weui_cell_hd">
          <img :src.sync="item.iconhref" />
        </div>
        <div class="weui_cell_bd weui_cell_primary">
          <p>{{item.name}}</p>
        </div>
      </a>
    </group>
  </div>
</div>
<div>
  <alert :show.sync="showErrorNoHandled" button-text="确认">{{errorMsgNoHandled}}</alert>
</div>
</template>

<script>
import {
  Group,
  XInput,
  Alert
} from 'vux'
import agentInfoAPI from '../api/agentInfo'

export default {
  components: {
    Group,
    XInput,
    Alert
  },
  props: {
    keyword: {
      type: String
    },
    userLevel: {
      type: String
    },
    showHomePageModel: {
      type: Boolean
    }
  },
  data() {
    return {
      funcList: [{
        name: '发起招募',
        iconhref: '/static/TestIMG/initiate.png',
        link: '/employManagement/chooseEmployableRoles',
        isShow: true
      }, {
        name: '当前招募',
        iconhref: '/static/TestIMG/current.png',
        link: null,
        isShow: true
      }, {
        name: '成员审核',
        iconhref: '/static/TestIMG/audit.png',
        link: '/employManagement/audit',
        isShow: true
      }, {
        name: '招募历史',
        iconhref: '/static/TestIMG/history.png',
        link: '/employManagement/employmentHistory',
        isShow: true
      }, {
        name: '我的证书',
        iconhref: '/static/TestIMG/certificate.png',
        link: null, //TODO
        isShow: true
      }, {
        name: '修改密码',
        iconhref: '/static/TestIMG/ModifyThePassword.png',
        link: '/auth/changepwd',
        isShow: true
      }, {
        name: '修改手机号',
        iconhref: '/static/TestIMG/ModifyThePhone.png',
        link: null,
        isShow: true
      }, {
        name: '修改微信号',
        iconhref: '/static/TestIMG/ModifyTheWeixin.png',
        link: null,
        isShow: true
      }],
      showErrorNoHandled: false,
      errorMsgNoHandled: null,
      showResult: false
    }
  },
  methods: {
    search() {
      var reg = /^[\u4e00-\u9fa5]*$/
      if (this.keyword == null || this.keyword == '') {
        this.showResult = false
        this.showErrorNoHandled = true
        this.errorMsgNoHandled = "请输入需要搜索的关键字"
        this.$dispatch("backButton", this.showHomePageModel)
      } else if (!reg.test(this.keyword)) {
        this.showResult = false
        this.showErrorNoHandled = true
        this.errorMsgNoHandled = "请输入中文关键字"
        this.$dispatch("backButton", this.showHomePageModel)
      } else {
        this.showResult = false
        var countShowItem = this.filter(this.keyword)
        if(countShowItem == 0){
          this.showErrorNoHandled = true
          this.errorMsgNoHandled = "暂无此功能"
          this.$dispatch("backButton", this.showHomePageModel)
        }else{
          this.showResult = true
          this.showHomePageModel = false
          this.$dispatch("backButton", this.showHomePageModel)
        }
      }
    },
    filter(keyword) {
      var countShowItem = 0

      //恢复全部为显示
      for (var item in this.funcList) {
        this.funcList[item].isShow = true
      }

      //根据级别选择显示功能
      if (this.userLevel != "0") {
        for (var item in this.funcList) {
          if (this.funcList[item]['name'] == '成员审核') {
            this.funcList[item].isShow = false
          } else {
            this.funcList[item].isShow = true
          }
        }
      }
      if (this.userLevel == "4") {
        for (var item in this.funcList) {
          if (this.funcList[item].isShow == false || this.funcList[item]['name'] == '发起招募' || this.funcList[item]['name'] == '当前招募' || this.funcList[item]['name'] == '成员审核' || this.funcList[item]['name'] == '招募历史') {
            this.funcList[item].isShow = false
          } else {
            this.funcList[item].isShow = true
          }
        }
      }

      //根据搜索关键字选择显示功能
      for (var item in this.funcList) {
        if (this.funcList[item].name.match(keyword) == null) {
          this.funcList[item].isShow = false
        }
      }

      //计算isShow 数量
      for (var item in this.funcList) {
        if (this.funcList[item].isShow) {
          countShowItem ++
        }
      }
      return countShowItem
    }
  },
  events: {
    search() {
      this.search()
    }
  }
}
</script>
<style lang="less">
.function-search-bac {
    min-height: 485px;

}
.function-search .weui_cell {
    padding: 9px 2%;
}

.function-search .weui_cell_hd {
    width: 0;
}

.function-search input.weui_input {
    width: 97%;
    background: #fff;
    margin: auto;
    padding-left: 2%;
    height: 2.1em;
    font-family: "微软雅黑";
    font-size: 4.7vw;
    /*15px*/
    color: #393a3f;
    border: 1px solid #d3d1d1;
}

.function-search-button {
    position: absolute;
    z-index: 10000000;
    right: 3%;
    top: 23%;
    width: 10%;
}

.function-search-button button.weui_btn.weui_btn_primary {

    line-height: 2.0;
    background: url("/static/TestIMG/search.png");
    background-size: 100%;
    background-repeat: no-repeat;
}
.function-search-button .weui_btn:after {
    border: 0;
}
.function-search .weui_icon_warn:before {
    font-size: 4.5vw;
    /*14px*/
    color: #f43530;
}

.function-search-list {
    background: #fff;
    border-top: 1px solid #d3d1d1;
    border-bottom: 1px solid #d3d1d1;
}

.function-search-list h1 {
    color: #393a3f;
    font-size: 4.7vw;
    /*15px*/
    font-family: "微软雅黑";
    padding: 2% 4%;
    font-weight: normal;
}
.function-search-list .weui_cell:before {
    border-top: 0;
}

.function-search-list .weui_cell {
    border-top: 1px solid #d3d1d1;
    padding: 7px 3% 4px;
}

.function-search-list .weui_cell_hd {
    width: 11%;
}

.function-search-list img {
    width: 80%;
}
p.search-none {
    width: 95%;
    margin: 50% auto;
    color: #999;
    text-align: center;

    font-size: 5.2vw;
}
</style>
