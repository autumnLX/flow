<template lang="pug">
  div(id='yc_tlxd1')
    dl(v-for='(topicOption, i) in data.topicOption' :key='i' :class='{disabled: i > index, active: i === index, vertical: classVertical[i]}')
      dt {{i + 1 + 5}}.
        div(v-html='topicOption.topicStem')
      dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, i, option.option)' :ref='"option" + i') 
        label(:class='{checked: myAnswer[i] === option.option}')
        span {{option.option}}.
        div(class='optionDesc' v-html='option.optionDesc')
</template>

<script>
export default {
  name: 'yc_tlxd1',
  props: ['data', 'index', 'onSetMyAnswer'],
  data() {
    return {
      isRendered: false,
      classVertical: [false, false, false, false, false],
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
      this.classVertical = [false, false, false, false, false]
      this.myAnswer = ['', '', '', '', '']
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
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
        let options = this.$refs['option' + i]
        for (let j = 0; j < options.length; j++) {
          if (options[j].clientWidth > 220) {
            this.$set(this.classVertical, i, true)
            break;
          }
        }
      }
    }
  },
  watch: {
    data: function () {
      this.updateData()
      this.$nextTick(() => {
        this.autoOptionHeight()
      })
    },
    index: function () {
      this.$nextTick(() => {
        if (this.index >= 0) this.autoScroll()
        if (!this.isRendered) {
          this.isRendered = true
          this.autoOptionHeight()
        }
      })
    }
  },
  mounted () {
    this.updateData()
  },
  updated () {
    if (this.index === -1) document.querySelectorAll('.content')[0].scrollTop = 0
  }
};
</script>

<style lang="less" scope>
@image-base-url: "../../../../assets/student/examination";

#yc_tlxd1 {
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
    height: auto;
    padding: 20px 0 20px 50px;
    box-sizing: border-box;
    display: inline-block;

    dt {
      width: 25px;
      height: 36px;
      float: left;
      font-weight: bold;

      div {
        display: inline-block;
      }
    }

    dd {
      min-width: 220px;
      height: auto;
      float: left;
      margin-right: 10px;
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
        cursor: pointer;
      }

      label.checked {
        background: url("@{image-base-url}/radio_select.png") no-repeat center center;
      }

      span {
        padding: 0 10px 0 2px;
      }

      span, div.optionDesc {
        vertical-align: bottom;
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

    &.vertical {
      dd {
        width: 684px;
        margin-left: 25px;

        &:nth-child(2) {
          margin-left: 0;
        }

        div.optionDesc {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
