<template lang="pug">
  li
    div(style='display: flex;align-items: center')
      img(src='../../../assets/student/battle/psup_16px.png')
      span <span class="n">{{challenge.fromName}}</span>以<span class="x">{{challenge.score}}分</span>的<span class="n">作业</span>成绩向你#挑战{{challenge.id}}#
    div(v-if='challenge.status === 1')
      button('@click'='handleAccept') 接受
      button('@click'='handleReject') 拒绝
      button('@click'='handleIgnore') 忽略
    div(v-else-if='challenge.status === 2')
      button('@click'='handleTakeUp') 前往应战
    div(v-else-if='challenge.status === 3') 已忽略
    div(v-else-if='challenge.status === 6') 已拒绝
</template>

<script>
export default {
  name: 'ChallengeMeItem',
  props: ['index', 'challenge', 'onAccept', 'onReject', 'onIgnore'],
  methods: {
    handleAccept() {
      this.onAccept(this.challenge.id, this.index)
    },
    handleReject() {
      this.onReject(this.challenge.id, this.index, 6)
    },
    handleIgnore() {
      this.onIgnore(this.challenge.id, this.index, 3)
    },
    handleTakeUp() {
      this.$router.push(`learn?challengeId=${this.challenge.id}`)
    }
  }
}
</script>

<style scoped>
img {
  width: 12px;
  height: 12px;
  margin-right: 5px;
}
</style>

