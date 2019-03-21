<template lang="pug">
  div(class='page')
    div(class='md-card left')
      ul
        li 
          router-link(to='info' class='i1') 个人信息
        li 
          router-link(to='certificate' class='i2') 我的证书
        li 
          router-link(to='password' class='i3') 修改密码
        li 
          router-link(to='message' class='i4') 消息中心
    div(class='md-card right' :style='{height: height + "px"}')
      transition(name='fade' mode='out-in')
          <router-view :resize='resize'></router-view>
      //- p Hello, {{name}}
      //- input(type=text)
      //- <button @click="changeName">Change name</button>
      //- <button @click="overtime">Overtime</button>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Personal',
  data() {
    return {
      height: 200
    }
  },
  computed: {
    local() {
      return 'Hello'
    },
    ...mapState({
      name: state => state.user.name
    })
  },
  methods: {
    resize(height) {
      this.height = height
    },
    changeName() {
      this.$store.commit('setName', 'Raymond');
    },
    overtime() {
      this.$store.commit('setLoginInfo', '登录超时，请重新登录');
      this.$store.commit('setOvertime', 1);
    }
  }
}
</script>

<style lang="less" scoped>
@asset: '../../../assets/student/personal';
@icon1: '@{asset}/ic_personacenter';
@icon2: '@{asset}/ic_certificate';
@icon3: '@{asset}/ic_passwordchanged';
@icon4: '@{asset}/ic_message';

.left-icon-normal {
  &.i1 {
    background-image: url('@{icon1}_normal.png');
  }

  &.i2 {
    background-image: url('@{icon2}_normal.png');
  }

  &.i3 {
    background-image: url('@{icon3}_normal.png');
  }

  &.i4 {
    background-image: url('@{icon4}_normal.png');
  }
}

.left-icon-active {
  &.i1 {
    background-image: url('@{icon1}_active.png');
  }

  &.i2 {
    background-image: url('@{icon2}_active.png');
  }

  &.i3 {
    background-image: url('@{icon3}_active.png');
  }

  &.i4 {
    background-image: url('@{icon4}_active.png');
  }
}

.page {
  display: flex;

  .left {
    width: 180px;
    height: 200px;
    margin-right: 10px;

    li {
      text-align: center;
      line-height: 50px;

      a {
        display: block;
        color: #000;
        font-size: 16px;
        background-position: 25px center;
        background-repeat: no-repeat;
        .left-icon-normal;

        &.router-link-active {
          color: #47b154;
          background-color: #ecf7ee;
          .left-icon-active;
        }
      }

      &:hover {
        background-color: #f8f8f8;
        cursor: pointer;

        a {
          color: #47b154;
          .left-icon-active;
        }
      }
    }
  }

  .right {
    flex: 1;
    transition: height 400ms;
    overflow-y: hidden;
  }
}
</style>

