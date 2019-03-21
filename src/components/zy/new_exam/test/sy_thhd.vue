<template lang="pug">
  div(id='sy_thhd')
    div(class='headTip') 
      div(v-html='data1.topicContent')
    dl(v-for='(option,i) in data1.topicOption' :key='i' :class='{hight: i == currentOptionIndex}')
      dd
        span 问题{{i + 1}}: 
        span {{option.questionText.replace(/<\/?[a-zA-Z]+[^><]*>/g, '')}}
</template>

<script>

/**
 * 情景问答
 */
export default {
  name: 'sy_thhd',
  props: ['data', 'index', 'phase', 'onSetRec'],
  data () {
    return {
      showHight: false,
      currentOptionIndex: -1
    }
  },
  methods: {
    updateData () {
      if (this.data1) {
        this.$eventbus.$emit('SetRec', {
          type: 'scne',
          refText: this.getTopicRefText()
        }, 0, this.currentOptionIndex)
      }
    },
    getTopicRefText () {
      let refTextArr = []
      let textArr = []
      let currentAnswer = this.data1.topicOption[this.currentOptionIndex].optionDesc.replace(/#/g, '|').replace(/<\/?[a-zA-Z]+[^><]*>/g, '')
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
  computed: {
    data1 () {
      return this.data[0]
    }
  },
  mounted () {
    this.$eventbus.$on('sy_thhd', (index) => {
      this.currentOptionIndex = index
      this.updateData()
    })
    // this.updateData()
  },
  destroyed () {
    this.$eventbus.$off('sy_thhd')
  }
};
</script>

<style>
#sy_thhd * {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
span {
  color: #666;
}
.hight {
  span {
    color: #24cc7c !important;
  }
}
#sy_thhd {
  width: 100%;

  .headTip {
    margin-bottom: 20px;

    & > p,
    & > div {
      margin: 0;
      padding: 0;
      font-size: 18px;
      color: #666;
      line-height: 24px;

      div {
        font-size: 18px;
        color: #666;
        line-height: 24px;
      }
    }
  }
  dl span {
    font-size: 22px;
  }
  dl {
    margin-top: 16px;
  }
  dl.first {
    margin-top: 0;
  }
}
</style>
