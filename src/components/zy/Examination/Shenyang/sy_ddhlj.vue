<template lang="pug">
  div(id='ddhlj')
    dl(v-for='(topicOption, i) in data.topicOption' :key='i' :class='{disabled: i > index, active: i === index, vertical: classVertical[i]}')
      dt
        span {{ i + 1 }}.
        div(v-html='topicOption.topicStem.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
      dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, i, option.option)' :ref='"option" + i')
        label(:class='{checked: myAnswer[i] === option.option}')
        span {{option.option}}.
        div(class='optionDesc' v-html='option.optionDesc.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
</template>

<script>
import Config from '@/config/config.js'
/**
 * 短对话理解
 */
export default {
  name: 'ddhlj',
  props: ['data', 'index', 'onSetMyAnswer'],
  data () {
    return {
      isRendered: false,
      classVertical: [false, false, false],
      myAnswer: ['', '', ''],
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      this.$set(this.myAnswer, i, option)
      this.onSetMyAnswer(option, i)
    },
    updateData: function () {
      this.onSetMyAnswer(this.myAnswer[this.index], this.index)
    },
    autoScroll: function () {
      let content = document.querySelectorAll('.content')[0]
      let contentB = content.getBoundingClientRect().bottom
      let dlB = this.$refs['option' + this.index][0].parentNode.getBoundingClientRect().bottom
      if (dlB > contentB) {
        content.scrollTop += dlB - contentB
      }
    },
    autoOptionHeight: function () {
      let topicOption = this.data.topicOption
      for (let i = 0; i < topicOption.length; i++) {
        let options = topicOption[i]
        for (let j = 0; j < options.length; j++) {
          if (options.optionDesc.match(/<img/g)) {
            this.$set(this.classVertical, i, true)
            break;
          }
        }
      }
    }
  },
  watch: {
    data: function (val, oldVal) {
      if (val.phase !== oldVal.phase) {
        this.classVertical = [false, false, false]
        this.myAnswer = ['', '', '']
        this.myAnswer.forEach((ma, i) => {
          this.onSetMyAnswer(ma, i)
        })
        this.$nextTick(() => {
          this.autoOptionHeight()
        })
      }
    },
    index: function () {
      if (this.index >= 0) {
        this.updateData()
        this.autoScroll()
      }
      this.$nextTick(() => {
        if (!this.isRendered) {
          this.isRendered = true
          this.autoOptionHeight()
        }
      })
    },
  },
  mounted () {
    this.myAnswer.forEach((ma, i) => {
      this.onSetMyAnswer(ma, i)
    })
  },
  updated () {
    if (this.index === -1) document.querySelectorAll('.content')[0].scrollTop = 0
  }
};
</script>

<style lang="less">
@image-base-url: "../../../../assets/student/examination";

#ddhlj {
  width: 100%;

  * {
    margin: 0;
    font-size: 22px;
    line-height: 36px;
    color: #333;
    font-family: "Times New Roman", "SimSun";
  }

  dl {
    margin-bottom: 20px;

    dt {
      font-weight: bold;

      span {
        float: left;
      }

      div {
        display: block;
      }
    }

    dd {
      cursor: pointer;

      * {
        display: block;
      }

      label {
        width: 36px;
        height: 36px;
        background: url("@{image-base-url}/radio_normal.png") no-repeat center
          center;
        float: left;
        cursor: pointer;
      }

      label.checked {
        background: url("@{image-base-url}/radio_select.png") no-repeat center
          center;
      }

      span {
        float: left;
      }
    }

    &.active {
      background: #e1f9eb;

      dt {
        color: #21bd73;
      }
    }

    &.disabled * {
      color: #ccc !important;
    }

    &.vertical {
      dd {
        width: 684px;
        margin-left: 25px;
      }
    }
  }
}
</style>
