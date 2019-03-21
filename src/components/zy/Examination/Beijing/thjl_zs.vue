<template>
    <div id='thjl_zs'>
      <p>{{ text }}</p>
    </div>
</template>

<script>
import $ from '@/utility/dollar.js'

export default {
  name: 'thjl_zs',
  props: ['data', 'onAnwser'],
  computed: {
    text() {
      return this.data.content.replace(/<[^>]*>/g, '')
    }
  },
  methods: {
    updateData() {
      if (this.data) {
        let tempArr = []
        let standardAnswerArr = this.data.answer.split('#')
        let teacherAnswerArr = this.data.teacherAnswer.split('#')

        standardAnswerArr.forEach((v, i) => {
          if (v) {
            tempArr.push({
              'answer': 2,
              'text': v
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
        this.onAnwser(
          $.getServerParams({
            type: 'oesy',
            refText: tempArr
          }), 1)
      }
    }
  },
  mounted() {
    this.updateData()
  }
};
</script>

<style>
#thjl_zs * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#thjl_zs {
  width: 100%;
  p {
    color: #333333;
    font-size: 18px;
  }
}
</style>
