<template lang="pug">
  div(id='yc_tdhdt')
    div(v-for='(topicOption, i) in data.topicOption' :key='i' :class='{disabled: i > index, active: i === index}'
    :ref='"option" + i'
    )
      p(class='desc' v-if='i === 0') 听下面一段对话，回答第16和17小题
      p(class='desc' v-else) 听下面一段对话，回答第18、19和20小题
      dl(v-for='(topicItem, k) in topicOption.optionList' :key='k')
        dt {{topicItem.ordering + 15}}.
          div(v-html='topicItem.topicStem')
        dd(v-for='(option, j) in topicItem.options' :key='i + "@" + j' @click='onSelectAnswer($event, topicItem.ordering - 1, option.option)') 
          label(:class='{checked: myAnswer[topicItem.ordering - 1] === option.option}')
          span {{option.option}}.
          div(class='optionDesc' v-html='option.optionDesc')
</template>

<script>
/**
 * 听对话答题
 */
export default {
  name: 'thxz',
  props: ['data', 'index', 'onSetMyAnswer'],
  data() {
    return {
      myAnswer: ['', '', '', '', '']
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      this.myAnswer[i] = option
      this.myAnswer = this.myAnswer.concat()
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    updateData: function () {
      this.myAnswer = ['', '', '', '', '']
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
    data: function () {
      this.updateData()
    },
    index: function() {
      this.$nextTick(() => {
        if (this.index >= 0) this.autoScroll()
      })
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
#yc_tdhdt * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#yc_tdhdt {
  width: 100%;
  padding: 0;
  margin-top: 20px;
  flex: 1;
  -ms-flex:1;
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
