<template lang="pug">
  div(id='dwlj')
    dl(v-for='(topicOption, i) in data.topicOption' :key='i' :class='{vertical: classVertical[i]}' :ref='"option" + i')
      dt
        span {{ index * 3 + (i + 1) + 9 }}.
        div(v-html='topicOption.topicStem.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
      dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, i, option.option)')
        label(:class='{checked: myAnswer[i] === option.option}')
        span {{option.option}}.
        div(class='optionDesc' v-html='option.optionDesc.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
</template>

<script>
/**
 * 长对话理解
 */
import Config from '@/config/config.js'

export default {
  name: 'dwlj',
  props: ['data', 'index', 'onSetMyAnswer'],
  data() {
    return {
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
      classVertical: [false, false, false],
      myAnswer: ['', '', ''],
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      this.$set(this.myAnswer, i, option)
      this.onSetMyAnswer(this.myAnswer.join(','))
    },
    updateData: function () {
      this.myAnswer = ['', '', '']
      this.onSetMyAnswer(this.myAnswer.join(','))
    },
    autoOptionHeight: function () {
      let topicOption = this.data.topicOption
      for (let i = 0; i < topicOption.length; i++) {
        let options = topicOption[i].options
        for (let j = 0; j < options.length; j++) {
          if (!options[j].optionDesc.match(/<img/g)) {
            this.$set(this.classVertical, i, true)
            break;
          }
        }
      }
    }
  },
  watch: {
    data: function (val, oldVal) {
      this.updateData()
      this.autoOptionHeight()
    },
    index: function () {
      this.updateData()
      this.autoOptionHeight()
      document.querySelectorAll('.content')[0].scrollTop = 0
    }
  },
  mounted () {
    document.querySelectorAll('.content')[0].scrollTop = 0
  }
};
</script>

<style>
#dwlj * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#dwlj {
  width: 100%;

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
        padding: 0 10px 0 2px;
        display: block;
        float: left;
        margin-top: 48px;
      }
    }

    &.vertical {
      dd {
        width: 684px;
        margin-left: 25px;

        span {
          padding: 0;
          margin-top: 0;
        }
      }
    }
  }
}
</style>
