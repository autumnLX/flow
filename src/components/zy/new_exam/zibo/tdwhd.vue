<template lang="pug">
  div(id='zb_tdwhd')
    div.subject(v-for="(item, index_item) in data[0].topicOption" :class='{disabled: index_item > a_index, active: index_item === a_index}' :ref='"option"+index_item')
      div
        p.topicContent 
          span.index {{ index_item+11}}. 
          span {{item.topicStem}}
        div.option.block
          km-radio.radio(v-for="(option, index) in item.options" :key="index" :label="option.option" v-model="answer[index_item]" @change="select") {{option.option + '. ' + option.optionDesc}}
</template>

<script>
import Config from '@/config/config.js';
/**
 * 听力选答
 */
export default {
  name: 'js_tdhxz',
  props: ['data'],
  data () {
    return {
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
      answer: [],
      a_index: -1
    };
  },
  methods: {
    select () {
      this.$eventbus.$emit('setAnswer', this.answer.join(','), 0)
    },
    autoScroll: function () {
      this.$refs['option' + this.a_index][0].scrollIntoView();
    }
  },
  watch: {
    a_index: function () {
      this.$nextTick(() => {
        if (this.a_index >= 0) this.autoScroll();
      });
    }
  },
  created () {
    this.$eventbus.$on('zb_tdwhd', (index) => {
      this.a_index = +index
    })
  },
};
</script>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";
* {
  padding: 0;
  margin: 0;
}
#zb_tdwhd {
  * {
    font-family: "Times New Roman", "SimSun";
  }
  width: 100%;
  padding: 10px 0;
  > div {
    display: block;
  }
  .optioncontnet {
    display: flex;
    align-items: center;
    > span {
      margin-left: 2px;
      margin-right: 10px;
    }
    img {
      width: 160px;
    }
  }

  .subject {
    padding-left: 50px;
    padding-top: 4px;
  }

  .active {
    background: #e1f9eb;

    // .index {
    //   color: #21bd73;
    // }
  }

  .topicContent {
    font-weight: bold;
  }
  .disabled {
    .topicContent {
      color: #ccc;
      width: 100%;
    }

    .option,
    span,
    div.optionDesc {
      color: #ccc;
    }
  }

  .option {
    cursor: pointer;
    display: flex;
    width: 100%;
    padding: 12px 0px;
    box-sizing: border-box;
    margin-bottom: 14px;
    > div {
      margin-right: 14px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .option.block {
    display: block;
  }
  .radio {
    display: block;
  }
}
</style>
<style>
#zb_tdwhd i.iconfont {
  font-size: 20px;
  margin-right: 6px;
}
#zb_tdwhd .radio label {
  font-size: 22px;
}
#zb_tdwhd .disabled label {
  color: #ccc;
}
#zb_tdwhd .active label {
  color: #666;
}
</style>
