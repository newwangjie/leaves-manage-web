<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="heard_title" v-if="!register">小枫叶通票厅</h3>
      <div class="heard"><img src="../assets/logo.png" alt=""></div>
      <h3 class="title">小枫叶是东半球最具影响力的平台，欢迎加入</h3>
      <template v-if="!register">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text"auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <p class="bottom_account">没有账号？<span @click="register = true">去注册</span></p>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :minlength="6" :maxlength="16" type="text"auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" :minlength="6" :maxlength="16" @change="setPasswordStr" v-popover:popover auto-complete="off" placeholder="6 - 16位密码，区分大小写">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
          <el-popover ref="popover" placement="right">
            <el-row>
              <el-col :span="6" :offset="1">
                <el-progress
                  :percentage="onePercentage"
                  :color="oneCustomColors"
                  :format="oneFormat"
                  :stroke-width="3"
                />
              </el-col>
              <el-col :span="6" :offset="1">
                <el-progress
                  :percentage="twoPercentage"
                  :color="twoCustomColors"
                  :format="twoFormat"
                  :stroke-width="3"
                />
              </el-col>
              <el-col :span="6" :offset="1">
                <el-progress
                  :percentage="ThreePercentage"
                  :color="ThreeCustomColors"
                  :format="ThreeFormat"
                  :stroke-width="3"
                />
              </el-col>
              <el-col :span="2" :offset="1" style="line-height: 15px;">
                {{ content }}
              </el-col>
              </el-row>
            <p style="marginTop: 10px;">请至少输入6个字符。数字/大小写/特殊字符组合为最佳</p>
          </el-popover>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="确认密码">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text"auto-complete="off" placeholder="输入口令码">
            <svg-icon slot="prefix" icon-class="star" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">注 册</span>
            <span v-else>注 册 中...</span>
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <p class="bottom_account">已有账号？<span @click="register = false">立即登录</span></p>
        </el-form-item>
      </template>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2022-2023 算逑技术部出品.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 注册开关
      register: false,
      redirect: undefined,
      content: '',
      onePercentage: 0,
      twoPercentage: 0,
      ThreePercentage: 0,
      oneCustomColors: [
        { color: '#f56c6c', percentage: 100 }
      ],
      twoCustomColors: [
        { color: '#e6a23c', percentage: 100 }
      ],
      ThreeCustomColors: [
        { color: '#67c23a', percentage: 100 }
      ]
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    },
    'loginForm.password': {
      handler: function(newValue) {
        const mode = this.checkPasswordStrength(newValue)
        this.handelPasswordPercent(mode)
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    handleLogin () {},
    // 密码强度验证
    checkPasswordStrength(value) {
      let mode = 0
      // 正则表达式验证符合要求的
      if (value.length < 1) return mode
      if (/\d/.test(value)) mode++ // 数字
      if (/[a-z]/.test(value)) mode++ // 小写
      if (/[A-Z]/.test(value)) mode++ // 大写
      if (/\W/.test(value)) mode++ // 特殊字符
      return mode
    },
    setPasswordStr(newValue) {
      const mode = this.checkPasswordStrength(newValue)
      this.handelPasswordPercent(mode)
    },
    handelPasswordPercent(mode) {
      // 逻辑处理
      switch (mode) {
        // 初始化状态
        case 0:
          this.content = ''
          this.onePercentage = 0
          this.twoPercentage = 0
          this.ThreePercentage = 0
          break
        case 1:
          this.content = '弱'
          this.onePercentage = 100
          this.twoPercentage = 0
          this.ThreePercentage = 0
          break
        case 2:
          this.content = '中'
          this.onePercentage = 100
          this.twoPercentage = 100
          this.ThreePercentage = 0
          break
        case 3:
          this.content = '中'
          this.onePercentage = 100
          this.twoPercentage = 100
          this.ThreePercentage = 0
          break
        default:
          this.content = '高'
          this.onePercentage = 100
          this.twoPercentage = 100
          this.ThreePercentage = 100
          break
      }
    },
    oneFormat() {
      return ''
    },
    twoFormat() {
      return ''
    },
    ThreeFormat() {
      return ''
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.el-progress {
  .el-progress-bar {
    padding-right: 0;
  }
}
p {margin: 0; padding: 0;}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/login_bg.jpeg");
  background-size: cover;
}
.title {
  margin: 20px auto 30px auto;
  text-align: center;
  color: #fff;
  font-size: 16px;
}

.login-form {
  border-radius: 6px;
  width: 450px;
  padding: 25px 25px 0px 25px;
  background: rgba(10, 10, 10, 0.3);
  border-bottom: 8px solid #f7296f;
  border-radius: 30px 30px 50px 50px;
  position: relative;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .heard_title {
    position: absolute; font-size: 28px; color: #fff;
    top: -30%; left: 31%;
  }
  .heard {
    display: flex; justify-content: center;
    img { width: 80px; height: 80px; }
    h3 {  color: #fff; font-size: 26px; }
  }
  .bottom_account {
    text-align: right; color: #fff;
    span {
      color: #1890ff; cursor: pointer;
    }
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
