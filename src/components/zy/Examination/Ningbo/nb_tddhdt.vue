<template lang="pug">
  div(id='nb_tddhdt')
    div(v-for="(item, index_item) in randerData" :ref='"option"+index_item' :class='{disabled: index_item > index, active: index_item === index}')
      p {{index_item+1}}. {{item.topicContent}}
      div.option
        div.optioncontnet( v-for='(option,i) in item.topicOption' :key='index_item+"@"+i' @click='onSelectAnswer($event, index_item, option.option)')
            label(:class='{checked: myAnswer[index_item] === option.option}')
            span {{option.option}}.
            div(class='optionDesc' v-html='option.optionDesc.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
</template>

<script>
import Config from '@/config/config.js'

/**
 * 听力选答
 */
export default {
  name: 'nb_tddhdt',
  props: ['data', 'index', 'onSetMyAnswer'],
  data () {
    return {
      randerData: this.data,
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
      myAnswer: ['', '', '', '', '']
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      this.myAnswer[i] = option
      this.$forceUpdate()
      this.myAnswer = this.myAnswer.concat()
      this.onSetMyAnswer(this.myAnswer[i], i)
    },
    updateData: function () {
      for (let k = 0; k < 5; k++) {
        this.onSetMyAnswer('', k)
      }
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
    index: function (val) {
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
@image-base-url: '../../../../assets/student/examination';

#nb_tddhdt {
  width: 100%;
  padding: 10px 0;
  padding-left: 50px;
  & > div {
    display: block;
    &.active {
      background: #e1f9eb;
    }
    & > p {
      font-weight: bold;
    }
  }
  .optioncontnet {
    display: flex;

    & > .optionDesc {
      flex: 1;
    }
  }

  * {
    margin: 0;
    font-size: 22px;
    line-height: 36px;
    color: #333;
    font-family: 'Times New Roman', 'SimSun';
  }
  * {
    display: inline-block;
  }

  label {
    width: 36px;
    height: 36px;
    background: url('@{image-base-url}/radio_normal.png') no-repeat center
      center;
    display: block;
    float: left;
    // margin-top: 48px;
    cursor: pointer;
  }

  label.checked {
    background: url('@{image-base-url}/radio_select.png') no-repeat center
      center;
  }

  .option {
    width: 100%;
    padding: 12px 0 12px 50px;
    padding-left: 0px;
    box-sizing: border-box;
    margin-bottom: 14px;
    img {
      width: 190px;
    }

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
      height: 36px;
      margin-bottom: 40px;
      float: left;
      cursor: pointer;

      span {
        padding: 0 10px 0 2px;
        display: block;
        float: left;
      }

      div.optionDesc {
        p,
        img {
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
        span,
        div.optionDesc {
          color: #ccc;
        }
      }
    }
  }
}
</style>
