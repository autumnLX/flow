<template lang="pug">
  div(id='nb_qjwd')
    div(class='headTip')
      div(v-html='data.topicContent')
    //- dl(v-for='(option,i) in data.topicOption' :key='i' :class='{disabled: index === -1 || i > index, active: i === index, first:i == 0}')
    //-   dd
    //-     span {{i + 1}}.
    //-     span {{option.questionText.replace(/<\/?[a-zA-Z]+[^><]*>/g, '')}}
</template>

<script>
import $ from '@/utility/dollar.js'

/**
 * 情景问答
 */
export default {
  name: 'nb_qjwd',
  props: ['data', 'index', 'phase', 'onSetRec'],
  methods: {
    updateData: function () {
      if (this.data) {
        this.onSetRec(
          $.getServerParams({
            type: 'scne',
            refText: this.getTopicRefText()
          })
        )
      }
    },
    getTopicRefText () {
      let refTextArr = []
      let textArr = []
      let currentAnswer = ''
      currentAnswer = this.data.topicOption[this.phase - 1].optionDesc.replace(/#/g, '|').replace(/<\/?[a-zA-Z]+[^><]*>/g, '')
      textArr = currentAnswer.split('|')
      for (var i = 0; i < textArr.length; i++) {
        refTextArr.push({
          text: textArr[i],
          active: '1',
          role: 'b',
          answer: 1
        })
      }
      return refTextArr
    }
  },
  watch: {
    index (val) {
      console.info(val)
      this.$nextTick(() => {
        this.updateData()
      })
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style>
#nb_qjwd * {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
  color: #333;
  font-family: 'Times New Roman', 'SimSun';
}
</style>

<style lang="less" scoped>
#nb_qjwd {
  width: 100%;

  .headTip {
    margin-bottom: 20px;

    & > p, & > div {
      margin: 0;
      padding: 0;
      font-size: 18px;
      color: #333;
      line-height: 24px;

      div {
        font-size: 18px;
        color: #333;
        line-height: 24px;
      }
    }
  }
  dl span {
    font-size: 22px;
  }
  dl.active span {
    color: #333;
  }
  dl.disabled span {
    color: #ccc;
  }
  dl {
    margin-top: 16px;
  }
  dl.first {
    margin-top: 0;
  }
}
</style>
