<template lang="pug">
  div(id='yc_htjs')
    div(v-html='content')
</template>

<script>
/**
 * 话题简述
 */
export default {
  name: 'yc_htjs',
  props: ['data', 'index', 'onSetRec'],
  methods: {
    updateData: function () {
      if (this.data[0]) {
        let tempArr = []
        let standardAnswerArr = this.data[0].standardAnswer.split('#')
        let teacherAnswerArr = this.data[0].teacherAnswer.split('#')

        standardAnswerArr.forEach((value, index) => {
          if (value) {
            tempArr.push({
              'answer': 2,
              'text': value
            })
          }
        })
        teacherAnswerArr.forEach((value, index) => {
          if (value) {
            tempArr.push({
              'answer': 1,
              'text': value
            })
          }
        })
        this.$eventbus.$emit('SetRec', {
          type: 'oesy',
          refText: tempArr
        })
      }
    }
  },
  computed: {
    content () {
      return this.data[0].topicContent.replace(/\n/g, '<br>')
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style>
#yc_htjs * {
  margin: 0;
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
#yc_htjs {
  width: 100%;
}
</style>
