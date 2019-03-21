<template lang="pug">
  div(id='yc_tlxt')
    dl(v-for='(topicOption, i) in data.topicOption' :key='i' :class='{disabled: i > index, active: i === index}' :ref='"option" + i')
      dt {{i + 1}}.
        div(v-html='topicOption.topicStem')
      dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, i, option.option)') 
        label(:class='{checked: myAnswer[i] === option.option}')
        span {{option.option}}.
        div(class='optionDesc' v-html='option.optionDesc.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
</template>

<script>
import Config from '@/config/config.js'

/**
 * 听力选答
 */
export default {
  name: 'yc_tlxt',
  props: ['data', 'index', 'onSetMyAnswer'],
  data() {
    return {
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
      myAnswer: ['', '', '', '', '']
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      if (i > this.index) {
        return false
      }
      this.myAnswer[i] = option
      this.myAnswer = this.myAnswer.concat()
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    updateData: function () {
      this.myAnswer = ['', '', '', '', '']
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    autoScroll: function () {
      if (this.index === 0) document.querySelectorAll('.content')[0].scrollTop = 0
      let content = document.querySelectorAll('.content')[0]
      let contentB = content.getBoundingClientRect().bottom
      let dlB = this.$refs['option' + this.index][0].getBoundingClientRect().bottom
      if (dlB > contentB) {
        content.scrollTop += dlB - contentB
      }
    }
  },
  watch: {
    data: function () {
      this.$nextTick(() => {
        if (this.index >= 0) this.updateData()
      })
    },
    index: function () {
      this.$nextTick(() => {
        if (this.index >= 0) this.autoScroll()
      })
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style lang="less" scope>
@image-base-url: "../../../../assets/student/examination";

#yc_tlxt {
  width: 100%;
  padding: 10px 0;

  * {
    margin: 0;
    font-size: 22px;
    line-height: 36px;
    color: #333;
    font-family: "Times New Roman", "SimSun";
  }

  dl {
    width: 100%;
    height: 104px;
    padding: 12px 0 12px 50px;
    box-sizing: border-box;
    display: block;
    margin-bottom: 14px;

    &:last-child {
      margin-bottom: 0;
    }

    dt {
      width: 50px;
      float: left;
      font-weight: bold;

      div {
        display: inline-block;
      }
    }

    dd {
      width: 232px;
      height: 80px;
      float: left;
      cursor: pointer;

      * {
        display: inline-block;
      }

      label {
        width: 36px;
        height: 36px;
        background: url("@{image-base-url}/radio_normal.png") no-repeat center center;
        display: block;
        float: left;
        margin-top: 48px;
        cursor: pointer;
      }

      label.checked {
        background: url("@{image-base-url}/radio_select.png") no-repeat center center;
      }

      span {
        padding: 0 10px 0 2px;
        display: block;
        float: left;
        margin-top: 48px;
      }

      div.optionDesc {
        p, img {
          width: 120px;
          height: auto;
          display: block;
        }
      }
    }

    &.active {
      background: #e1f9eb;   
 
      dt {
        color: #21bd73;
      }  
    }

    &.disabled {
      dt {
        color: #ccc;
      }

      dd {
        span, div.optionDesc {
          color: #ccc;
        }
      }
    }
  }
}
</style>
