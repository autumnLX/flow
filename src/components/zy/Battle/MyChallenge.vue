<template lang="pug">
  div(class='md-card left')
    div(class='title') 我发起的挑战
      router-link(to='/student' class='fr') 更多...
    div(class='list')
      ul
        transition-group(name="slid")
          MyChallengeItem(
            v-for='c, i in myChallenge' 
            :key='c.id' 
            :challenge='c' 
            :index='i' 
            :onCancel='cancel'
          )
        li(v-for='n in 5 - myChallenge.length')
      div(class='text-right')
        router-link(to='learn' v-if='myChallenge.length === 0') 赶紧去做练习，开启在咔咪世界的第一战吧
        router-link(to='/' v-else-if='untreatedCount') 还有<span>{{untreatedCount}}</span>场挑战未被接受，点击查看
        router-link(to='learn' v-else) 用更多的挑战来磨砺自己
</template>

<script>
import $ from '@/utility/dollar'
import MyChallengeItem from './MyChallengeItem'

export default {
  name: 'MyChallenge',
  components: { MyChallengeItem },
  props: ['userId', 'onRefreshReport'],
  data() {
    return {
      myChallenge: [],
      untreatedCount: 0
    }
  },
  methods: {
    cancel(id, index) {
      $.post('/mock/cancelChallenge', { id, userId: this.userId }, (res) => {
        if (res.result) {
          alert('撤回成功')
          // this.myChallenge = res.data
          this.myChallenge[index].status = 0
        } else {
          alert('啊呀，挑战已被接受，泼出去的水收不回来了！')
          this.myChallenge[index].status = 2
        }

        this.onRefreshReport()
      })
    },
  },
  mounted() {
    $.mock('/challengeFrom/' + this.userId, (res) => {
      this.myChallenge = res.data.list
      this.untreatedCount = res.data.untreatedCount
    })
  }
}
</script>

<style lang='less' src='@/styles/personal.less' scoped></style>
