<template lang="pug">
  li
    div(style='display: flex;align-items: center')
      img(src='../../../assets/student/battle/sword_16px.png')
      span 你以<span class="x">{{challenge.score}}分</span>的<span class="n">作业</span>成绩向<span class="n">{{challenge.toName}}</span>发起了#挑战{{challenge.id}}#
    div(v-if='challenge.status===1 || challenge.status === 3')
      button('@click'='handleCancel') 撤回
    span(v-else-if='challenge.status === 0') 已撤回
    span(v-else-if='challenge.status === 2') 等待结果
    //- span(v-else-if='challenge.status === 3') 已被忽略
    span(v-else-if='challenge.status === 6') 已被拒绝
    span(v-else-if='challenge.status === 4' class='v') ヾ(￣ー￣)X(^▽^)ゞ
    span(v-else class='x') (o_ _)ﾉ
</template>

<script>
export default {
  name: 'MyChallengeItem',
  props: ['index', 'challenge', 'onCancel'],
  methods: {
    handleCancel() {
      this.onCancel(this.challenge.id, this.index)
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

