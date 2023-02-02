<template>
  <div class="app-container">
    <h3>通票动态</h3>
    <div class="time">
      <el-date-picker v-model="date" type="date" placeholder="选择日期" style="width: 25%;"></el-date-picker>
    </div>
    <div class="heard_card">
      <div class="card_item">
        <div class="card-title">
          <i class="el-icon-circle-plus" style="marginRight: 5px;"></i>
          <p>增加票数最多的客户</p>
        </div>
        <div class="all-count">
          <div class="left">
            <img src="../../assets/user.png" alt="">
            <p>客户姓名</p>
          </div>
          <div class="right">
            <span style="fontSize: 24px; display: inline-block; marginRight: 5px;">+</span>
            <animate-number from="0" :to="3242" duration="2000"></animate-number>
          </div>
        </div>
      </div>
      <div class="card_item">
        <div class="card-title">
          <i class="el-icon-remove" style="marginRight: 5px;"></i>
          <p>减少票数最多的客户</p>
        </div>
        <div class="all-count">
          <div class="left">
            <img src="../../assets/user.png" alt="">
            <p>客户姓名</p>
          </div>
          <div class="right">
            <span style="fontSize: 24px; display: inline-block; marginRight: 5px;">-</span>
            <animate-number from="0" :to="5675" duration="2000"></animate-number>
          </div>
        </div>
      </div>
    </div>
    <el-divider content-position="left">动态</el-divider>
    <div class="dynamic">
      <ul>
        <li v-for="item in 5">
          <img src="../../assets/user.png" alt="">
          <div class="right">
            <p>林东东 的 <span>客户A</span> 增加了 <span>1000</span>  通票</p>
            <time>2小时前</time>
          </div>
        </li>
      </ul>
      <ul>
        <li v-for="item in 5">
          <img src="../../assets/user.png" alt="">
          <div class="right">
            <p>林东东 的 <span>客户A</span> 增加了 <span>1000</span>  通票</p>
            <time>2小时前</time>
          </div>
        </li>
      </ul>
    </div>
    <div class="page">
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: ''
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
h3,p {
  margin: 0; padding: 0;
}
.time {
  text-align: center; margin: 10px 0 30px;
}
.heard_card {
  display: flex; justify-content: space-between; align-items: center; margin: 0 15%;
  .card_item {
    box-sizing: border-box;
    height: 150px;
    padding: 15px 15px 0;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 25px;
    box-shadow: 3px 5px 15px rgb(40 40 40 / 36%);
    background: linear-gradient(90deg,#3dadf6,#737bfc);
    &:nth-child(2) {
      background: linear-gradient(90deg,#ea677c,#ef9b5f);
    }
    width: 40%;
    .card-title {
      display: flex; justify-content: flex-start; align-items: center; color: #fff;
    }
    .all-count {
      display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding: 0 20px;
      .left {
        img { width: 60px; height: 60px; }
        p { font-size: 16px; color: #fff; font-weight: bold; }
      }
      .right {
        margin-right: 10%; font-size: 40px; color: #fff;
      }
    }
  }
}
.dynamic {
  display: flex; justify-content: space-between; margin: 0 15%;
  ul {
    li {
      display: flex; justify-content: flex-start; align-items: center; margin-bottom: 13px;
      img { width: 50px; height: 50px; }
      .right {
        margin-left: 30px; font-size: 18px;
        span { color: #1890FF; }
        time {
          color: #00000072; font-size: 14px;
        }
      }
    }
    &:nth-child(2) {
      margin-right: 5%;
    }
  }
}
.page {
  text-align: center;
}
</style>
