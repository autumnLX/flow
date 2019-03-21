<template lang="pug">
  div
    transition(name='fade' mode='out-in')
      div#root(v-if='ready===1')
        transition(name='fade' mode='out-in')
          router-view
    transition(name='fade')
      Overtime(v-if='overtime===1' class='fixed')
</template>

<script>
import $ from '@/utility/dollar.js'
import Overtime from '@/components/Overtime'

export default {
  name: 'app',
  components: { Overtime },
  data() {
    return {
      ready: 0
    }
  },
  computed: {
    overtime() {
      return this.$store.state.overtime
    }
  },
  mounted() {
    if (this.$router.currentRoute.path !== '/login' && !this.$store.state.user.id) {
      // console.log('登录后手动切换了URL，需要重新获取user信息');
      $.mock('/user/' + sessionStorage.getItem('id'), null, (response) => {
        this.$store.commit('setUser', response.data)
      })
    }

    this.ready = 1;
    // window.io();
  },
}
</script>

<style lang='less' src='@/styles/md.less'></style>
<style lang='less' src='@/styles/transition.less'></style>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>

