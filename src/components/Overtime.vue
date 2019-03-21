<template lang="pug">
  div#page-overtime('@keyup.enter.stop'='login')
    div
      p 登录超时，请重新登录
      div
        span 密码：
        input(type='password' v-model='password' ref='password')
      p {{info}}
      div
        router-link(to='/login') 切换账号
        button(type='button' '@click'='login') 登录
</template>

<script>
import session from '@/config/session.js';
import $ from '@/utility/dollar.js';

export default {
  name: 'Overtime',
  data() {
    return {
      password: '',
      info: '',
    }
  },
  methods: {
    login() {
      this.info = ''

      if (!this.password) {
        return (this.info = '请输入密码')
      }

      $.post('/menus/unifyLogin', {
        identity: sessionStorage.getItem(session.IDENTITY),
        username: sessionStorage.getItem(session.USERNAME),
        password: this.password
      }, (res) => {
        if (res.status === 1) {
          this.$store.commit('setOvertime', 0);
        } else {
          this.info = res.info;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
#page-overtime {
  display: flex;
  justify-content: center;
  align-items: center;

  &>div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 40px;
    border-radius: 2px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
    background-color: #fff;

    &>div,
    &>p {
      margin: 0 0 1em;
    }

    p {
      height: 16px;
      color: red;
      font-size: 12px;
      font-weight: bold;
    }

    input {
      padding: 0 4px;
    }

    &>div:last-child {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      a {
        color: blue;
        font-size: 12px;
      }

      button {
        padding: 0 10px;
      }
    }
  }
}
</style>


