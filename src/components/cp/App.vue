<template lang="pug">
  <div id="app">
    <div id="header">
      <img src="../../assets/app/logo.png">
      <div id="personal">
        <div class="avatar">
          <img src="../../assets/app/student_default_header_30x30.png">
        </div>
        <div class="dropdown">
          <span>你好，{{name}}</span>
          <i></i>
          <div>
            <ul>
              <li>
                <router-link to="/" class="password">修改密码</router-link>
              </li>
              <li>
                <router-link to="/" class="notice">公告通知</router-link>
              </li>
              <li>
                <router-link to="/login" class="quit">退出</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <nav id="nav">
      <ul>
        <li>
          <router-link to="home">首页</router-link>
        </li>
        <li>
          <router-link to="exam">作业中心</router-link>
        </li>
        <li>
          <router-link to="learn">学生管理</router-link>
        </li>
        <li v-if="model !== 1">
          <router-link to="word">测评</router-link>
        </li>
      </ul>
    </nav>
    <div id="container">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import config from '@/config/config.js'

export default {
  name: 'app',
  computed: {
    name() {
      return this.$store.state.user.teacher_name
    }
  },
  data() {
    return Object.assign({}, config);
  }
}
</script>

<style lang='less' src='@/styles/header.less'></style>
<style lang='less' scoped>
#header #personal .dropdown div ul li a {
  border-top: 1px solid #dcdcdc;
  line-height: 40px;

  &:first-child {
    border-top: 0;
  }
}
</style>
