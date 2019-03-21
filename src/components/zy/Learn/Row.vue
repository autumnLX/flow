<template lang="pug">
  li
    span {{index}}. {{student.name}}
    div
      button('@click'='doHomework') 做作业
      input(:value='score' readonly)
    button('@click'='challenge') 发起挑战
</template>

<script>
import $ from '@/utility/dollar'

export default {
  name: 'Row',
  props: ['index', 'student'],
  data() {
    return {
      status: 0,
      score: ''
    }
  },
  methods: {
    doHomework() {
      this.score = Math.floor(Math.random() * 10000) / 100
    },
    challenge() {
      let from = this.$store.state.user.id
      let fromName = this.$store.state.user.name
      let to = this.student.id
      let toName = this.student.name
      let score = this.score || 0

      $.post('/mock/challenge', {
        from, fromName, to, toName, score
      }, (res) => {
        console.log(res)
      }, 'json')
    }
  },
}
</script>

<style lang="less" scoped>
li {
  display: flex;
  align-items: center;

  div {
    margin: 0 10px;

    input {
      width: 6ch;
      text-align: center;
    }
  }
}
</style>
