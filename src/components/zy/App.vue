<template>
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
                <router-link class="person" to="personal">个人中心</router-link>
              </li>
              <li>
                <router-link class="quit" to="/login">退出</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <nav id="nav">
      <ul>
        <li v-if="model !== 2">
          <router-link to="/student/home">首页</router-link>
        </li>
        <li v-if="model !== 1">
          <router-link to="/student/exam">测评</router-link>
        </li>
        <li v-if="model !== 2">
          <router-link to="/student/learn">自主学习</router-link>
        </li>
        <li v-if="model !== 2">
          <router-link to="/student/word">单词集</router-link>
        </li>
        <li v-if="model !== 2">
          <router-link to="/student/grow">我的成长</router-link>
        </li>
        <li>
          <router-link to="/examination">正式考试</router-link>
        </li>
      </ul>
    </nav>
    <div id="container">
      <div>
        <transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <router-view class="fadeInOut"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/config.js';

export default {
  name: 'app',
  props: ['user'],
  computed: {
    name() {
      return this.$store.state.user.name
    }
  },
  data() {
    return Object.assign({}, config);
  },
  methods: {},
  mounted() {

  }
}
</script>

<style lang='less' src='@/styles/header.less'></style>
<style scoped>
.fadeInOut {
  animation-duration: 400ms!important;
}
</style>

