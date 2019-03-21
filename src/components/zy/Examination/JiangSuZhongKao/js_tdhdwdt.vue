<template lang="pug">
  div(id='js_tdhdt')
    div(v-if='data.topicAttachment.length >= 2')
      img(:src="resUrl + data.topicAttachment[1].attachmentUrl")
    div(v-for='(topicOption, i) in data.topicOption' :key='i' :ref='"option" + i')
      dl(v-if="index === 0")
        dt {{topicOption.ordering + 10}}.
          div(v-html='topicOption.topicStem')
        dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, topicOption.ordering - 1, option.option)') 
          label(:class='{checked: myAnswer[topicOption.ordering - 1] === option.option}')
          span {{option.option}}.
          div(class='optionDesc' v-html='option.optionDesc')
      dl(v-if="index === 1")
        dt {{topicOption.ordering + 12}}.
          div(v-html='topicOption.topicStem')
        dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, topicOption.ordering - 1, option.option)') 
          label(:class='{checked: myAnswer[topicOption.ordering + 1] === option.option}')
          span {{option.option}}.
          div(class='optionDesc' v-html='option.optionDesc')
      dl(v-if="index === 2")
        dt {{topicOption.ordering + 15}}.
          div(v-html='topicOption.topicStem')
        dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, topicOption.ordering - 1, option.option)') 
          label(:class='{checked: myAnswer[topicOption.ordering + 4] === option.option}')
          span {{option.option}}.
          div(class='optionDesc' v-html='option.optionDesc')
</template>

<script>
import Config from '@/config/config.js'
/**
 * 听对话和短文答题
 */
export default {
  name: 'thxz',
  props: ['data', 'phase', 'index', 'onSetMyAnswer'],
  data() {
    return {
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
      myAnswer: ['', '', '', '', '', '', ''],
      randerList: []
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      if (this.index === 0) {
        this.myAnswer[i] = option
      } else if (this.index === 1) {
        this.myAnswer[i + 2] = option
      } else if (this.index === 2) {
        this.myAnswer[i + 5] = option
      }
      this.myAnswer = this.myAnswer.concat()
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    updateData: function () {
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    autoScroll: function() {
      let content = document.querySelectorAll('.content')[0]
      let contentB = content.getBoundingClientRect().top
      let dlB = this.$refs['option' + this.index][0].getBoundingClientRect().top
      if (dlB > contentB) {
        content.scrollTop += dlB - contentB
      }
    }
  },
  watch: {
    data: function (val) {
      this.updateData()
    },
    index: function(val) {
      document.querySelectorAll('.content')[0].scrollTop = 0
      // this.$nextTick(() => {
      //   if (this.index >= 0) this.autoScroll()
      // })
    }
  },
  mounted() {
    this.updateData()
  },
  updated () {
    if (this.index === -1) document.querySelectorAll('.content')[0].scrollTop = 0
  }
};
</script>

<style>
#js_tdhdt * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#js_tdhdt {
  width: 100%;
  padding: 0;
  margin-top: 20px;
  flex: 1;
  -ms-flex:1;

  img {
    display: block;
    max-height: 355px;
    min-height: 215px;
  }
  & > div {
    padding: 0 0 20px 50px;
    width: 100%;
    box-sizing: border-box;
      &.active {
        background: #e1f9eb;
      }
      &.disabled {
        dt {
          color: #ccc;
          div {
            color: #ccc;
          }
        }

        dd {
          span, div.optionDesc {
            color: #ccc;
          }
        }
        pointer-events: none;
        cursor: pointer;
      }
      & > p {
        margin-bottom: 10px;
        font-size: 18px;
      }
      dl {
        margin-bottom: 20px;
        dt {
          font-weight: bold;

          div {
            display: inline-block;
            margin-left: 5px;
          }
        }
        dd {
          cursor: pointer;
          * {
            display: inline-block;
          }
          label {
            width: 36px;
            height: 36px;
            background: url("@{image-base-url}/radio_normal.png") no-repeat center
              center;
            display: block;
            float: left;
            cursor: pointer;
          }
          label.checked {
            background: url("@{image-base-url}/radio_select.png") no-repeat center
              center;
          }
          span {
            margin-left: 10px;
            margin-right: 10px;
          }
        }
    }
    & dl:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
