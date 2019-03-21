<template lang="pug">
  div(id='nb_tdwdt')
    div(v-for="(item, index_item) in data.topicOption" :ref='"option"+index_item')
      p {{item.ordering}}. {{item.topicStem}}
      div.option
        div.optioncontnet( v-for='(option,i) in item.options' :key='index_item+"@"+i' @click='onSelectAnswer($event, item.ordering - 1, option.option)') 
            label(:class='{checked: myAnswer[item.ordering - 1] === option.option}')
            span {{option.option}}.
            div(class='optionDesc' v-html='option.optionDesc.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
</template>

<script>
import Config from '@/config/config.js'

/**
 * 听力选答
 */
export default {
  name: 'nb_tdwdt',
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
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    updateData: function () {
      this.onSetMyAnswer(this.myAnswer.join(','), 0)
    },
    autoScroll() {
      this.$nextTick(() => {
        document.querySelectorAll('.content')[0].scrollTop = 0
      })
    }
  },
  watch: {
    index: function (val) {
      this.autoScroll()
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style lang="less" scope>
@image-base-url: '../../../../assets/student/examination';

#nb_tdwdt {
  width: 100%;
  padding: 10px 0;
  padding-left: 50px;
  > div {
    display: block;
  }
  .optioncontnet{
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
      display: block;
      height: 80px;
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
