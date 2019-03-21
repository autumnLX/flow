<template lang="pug">
  div
    h1 Learn Component
    div(v-if='challengeId')
      button('@click'='doHomework') 做作业
      input(:value='score' readonly)
      button('@click'='beat') 打脸反击
    ul(v-else)
      Row(
        v-for='student, index in otherStudents' 
        :key='student.id' 
        :index='index + 1' 
        :student='student'
      )
</template>

<script>
import $ from '@/utility/dollar'
import Row from './Row'

export default {
  name: 'Learn',
  components: { Row },
  data() {
    return {
      otherStudents: [],
      challengeId: this.$route.query.challengeId,
      score: ''
    }
  },
  methods: {
    doHomework() {
      this.score = Math.floor(Math.random() * 10000) / 100
    },
    beat() {
      $.post('/mock/challenge/beat', {
        id: this.challengeId,
        score: this.score
      }, (res) => {
        if (res.data === 5) {
          alert('恭喜你打败了挑战者，捍卫了自己的荣耀')
        } else if (res.data === 4) {
          alert('啊呀，看来还是挑战者技高一筹啊，不要气馁，多多练习')
        } else {
          alert('你们旗鼓相当，不分胜负')
        }
      })
    }
  },
  mounted() {
    console.log(this.$route)

    if (this.challengeId) {

    } else {
      $.mock('/usersExcept/' + sessionStorage.getItem('id'), (res) => {
        this.otherStudents = res.data
      })
    }
  }
}
</script>
