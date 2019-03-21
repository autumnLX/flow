<template lang="pug">
  div(class='md-card right')
    div(class='title') 我收到的挑战
      router-link(to='/student' class='fr') 查看收到的全部挑战 >>
    div(class='list')
      ul
        transition-group(name="slid")
          ChallengeMeItem(
            v-for='c, i in challengeMe' 
            :key='c.id' 
            :challenge='c' 
            :index='i' 
            :onAccept='accept'
            :onReject='rejectOrIgnore'
            :onIgnore='rejectOrIgnore'
          )
        li(v-for='n in 5 - challengeMe.length')
      div(class='text-right')
        span(v-if='challengeMe.length === 0') 有一种寂寞，叫做独孤求败
        span(v-else-if='untreatedCount === 0') 每一次对你的挑战，都是让你变强的阶石
        router-link(to='/' v-else) 还有<span>{{untreatedCount}}</span>场挑战未处理，点击查看
</template>

<script>
import $ from '@/utility/dollar'
import ChallengeMeItem from './ChallengeMeItem'

export default {
  name: 'ChallengeMe',
  components: { ChallengeMeItem },
  props: ['userId', 'onRefreshReport'],
  data() {
    return {
      challengeMe: [],
      untreatedCount: 0,
    }
  },
  methods: {
    refresh() {
      $.mock('/challengeTo/' + this.userId, (res) => {
        this.challengeMe = res.data.list
        this.untreatedCount = res.data.untreatedCount
      })
    },
    accept(id, index) {
      $.post('/mock/takeUpTheChallenge', { id }, (res) => {
        if (res.result) {
          alert('成功应战')
          this.challengeMe[index].status = 2
        } else {
          alert('啊呀，慢了一步，挑战被撤销了！')
          this.challengeMe[index].status = 0
        }

        this.onRefreshReport();
      })
    },
    rejectOrIgnore(id, index, status) {
      if (confirm('被【忽略】或者【拒绝】的挑战，下次将不会出现在该列表中，是否继续？')) {
        $.post('/mock/rejectOrIgnoreChallenge', {
          id, status, userId: this.userId
        }, (res) => {
          if (res.result) {
            // this.challengeMe = res.data
            // this.challengeMe.splice(index, 1)
            this.challengeMe[index].status = status
          } else {
            alert('啊呀，慢了一步，挑战被撤销了！')
            this.challengeMe[index].status = 0
          }

          this.onRefreshReport();
        })
      }
    }
  },
  mounted() {
    this.refresh()
  }
}
</script>

<style lang='less' src='@/styles/personal.less' scoped></style>
<style scoped>
.slid-enter-active:nth-child(1) {
  transition-delay: 100ms;
}

.slid-enter-active:nth-child(2) {
  transition-delay: 150ms;
}

.slid-enter-active:nth-child(3) {
  transition-delay: 200ms;
}

.slid-enter-active:nth-child(4) {
  transition-delay: 250ms;
}

.slid-enter-active:nth-child(5) {
  transition-delay: 300ms;
}
</style>

