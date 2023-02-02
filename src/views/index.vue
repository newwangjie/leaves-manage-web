<template>
  <div class="app-container home">
    <div class="heard">
      <div class="heard_left">
        <img src="../assets/user.png" alt="">
        <div class="account">
          <h3>你好，XXX，祝你开心每一天！</h3>
          <p>超级管理员 ｜ XXX公司-XX平台-XX职位</p>
        </div>
      </div>
      <div class="heard_right">
        <div class="list">
          <p>名下客户</p>
          <h3><animate-number from="0" :to="23413" duration="2000"></animate-number></h3>
        </div>
        <div class="list" v-if="role_code === 1">
          <p>管理员</p>
          <h3><animate-number from="0" :to="56" duration="2000"></animate-number></h3>
        </div>
      </div>
    </div>
    <el-divider class="divider"></el-divider>
    <template v-if="role_code === 1">
      <div class="quick">
        <p class="fast">快捷功能</p>
        <div class="operation">
          <div class="item" @click="goAnchor">
            <div class="icon"><img style="width: 60px; height: 60px;" src="../assets/images/setting.png" alt=""></div>
            <div>
              <p>管理员维护</p>
              <span>点击维护管理员相关信息</span>
            </div>
          </div>
          <div class="item" @click="goCustomer">
            <div class="icon"><img style="width: 60px; height: 60px;" src="../assets/images/people.png" alt=""></div>
            <div>
              <p>客户维护</p>
              <span>点击查看客户信息及票数</span>
            </div>
          </div>
        </div>
      </div>
      <el-divider content-position="left">动态</el-divider>
      <div class="dynamic">
        <p class="more" @click="goTicket">查看更多</p>
        <ul>
          <li v-for="item in 5">
            <img src="../assets/user.png" alt="">
            <div class="right">
              <p>林东东 的 <span>客户A</span> 增加了 <span>1000</span>  通票</p>
              <time>2小时前</time>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <homeList></homeList>
    </template>
  </div>
</template>

<script>
import homeList from './user/home/index.vue'
export default {
  components: { homeList },
  data () {
    return {
      role_code: 1
    }
  },
  methods: {
    goAnchor () {
      this.$router.push('/user/anchor')
    },
    goCustomer () {
      this.$router.push('/user/customer')
    },
    goTicket () {
      this.$router.push('/ticket')
    }
  }
}
</script>

<style lang="scss" scoped>
p,h3 { margin: 0; padding: 0; }
.heard {
  display: flex; justify-content: space-between; align-items: center; padding: 0 20px;
  .heard_left {
    display: flex; justify-content: space-between; align-items: center;
    img { width: 60px; height: 60px; }
    .account {
      margin-left: 20px;
      h3 { font-size: 20px; }
      p { color: #0000006d; font-size: 14px; padding-top: 10px; }
    }
  }
  .heard_right {
    display: flex; justify-content: flex-start; align-items: center;
    .list {
      text-align: center; margin-left: 30px;
      h3 { font-size: 26px; padding-top: 5px;}
      p { color: #0000006d; font-size: 14px;  }
    }
  }
}
.quick {
  .fast {
    color: #5e5e5e;
  }
  .operation {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    .item {
      border-radius: 10px;
      width: 20%;
      height: 100px;
      padding-left: 20px;
      background: #fff;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      cursor: pointer;
      margin-right: 30px;
      transition: all 1s;
      border: 1px solid #ebeef5;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      div:not(.icon) {
        flex: 1;
        padding-left: 25px;
        p {
          font-size: 18px;
          color: #2e2e2e;
          margin: 0;
          line-height: 35px;
        }
        span {
          font-size: 14px;
          color: #aaaaaa;
        }
      }
      &:hover {
        transform: translateY(-7px);
      }
    }
  }
}
.dynamic {
  position: relative;
  .more { position: absolute; right: 0; font-size: 14px; color: #1890FF; cursor: pointer; }
  ul {
    padding-top: 15px;
    li {
      display: flex; justify-content: flex-start; align-items: center; margin-bottom: 13px; padding-bottom: 10px;
      border-bottom: 2px dashed #eee;
      img { width: 50px; height: 50px; }
      .right {
        margin-left: 30px; font-size: 18px;
        span { color: #1890FF; }
        time {
          color: #00000072; font-size: 14px;
        }
      }
    }
  }
}
</style>
<style media="screen">
  .divider {
    margin: 20px 0 15px;
  }
</style>
