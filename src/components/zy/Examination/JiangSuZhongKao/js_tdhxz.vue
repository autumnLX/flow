<template lang="pug">
  div(id='js_tdhxz')
    div.subject(v-for="(item, index_item) in data" :class='{disabled: index_item > a_index, active: index_item === a_index}' :ref='"option"+index_item')
      div(v-if="(index_item<4&&a_index<4) || (index_item>=4&&a_index>=4)")
        p.topicContent 
          span.index {{ index_item+1}}. 
          span {{item.topicContent}}
        div.option(:class='{block:item.topicTypeId==="66"}')
          div.optioncontnet( v-for='(option,i) in item.topicOption' :key='index_item+"@"+i' @click='onSelectAnswer($event, index_item, option.option)') 
            label(:class='{checked: myAnswer[index_item] === option.option}')
            span {{option.option}}.
            div(class='optionDesc' v-html='option.optionDesc.replace(/<img([^(src])*src="/g, "$&" + resUrl)')
</template>

<script>
import Config from '@/config/config.js';
import event from '@/eventbus';
/**
 * 听力选答
 */
export default {
  name: 'js_tdhxz',
  props: ['data', 'index', 'onSetMyAnswer'],
  data() {
    return {
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res,
      myAnswer: [', ', ', ', ', ', ', ', ', '],
      a_index: -1
    };
  },
  methods: {
    onSelectAnswer: function(event, i, option) {
      // if (i > this.index) {
      //   return false
      // }
      this.myAnswer[i] = option;
      this.$forceUpdate();
      this.myAnswer = this.myAnswer.concat();
      this.onSetMyAnswer(this.myAnswer.join(','), 0);
    },
    updateData: function() {
      // this.myAnswer = []
      this.onSetMyAnswer(this.myAnswer.join(','), 0);
    },
    autoScroll: function() {
      // if (this.index === 0) document.querySelectorAll('.content')[0].scrollTop = 0
      // let content = document.querySelectorAll('.content')[0]
      // let contentB = content.getBoundingClientRect().bottom
      // let dlB = this.$refs['option' + this.a_index][0].getBoundingClientRect().bottom
      // if (dlB > contentB) {
      //   content.scrollTop += dlB - contentB
      // }
      this.$refs['option' + this.a_index][0].scrollIntoView();
    }
  },
  watch: {
    data: function() {
      this.$nextTick(() => {
        if (this.index >= 0) this.updateData();
      });
    },
    a_index: function() {
      this.$nextTick(() => {
        if (this.a_index >= 0) this.autoScroll();
      });
    }
  },
  mounted() {
    event.$on('js_tdhxz', () => {
      this.a_index++;
      this.updateData();
    });
  },
  destroyed() {
    event.$off('js_tdhxz')
  }
};
</script>

<style lang="less" scope>
@image-base-url: "../../../../assets/student/examination";
* {
  padding: 0;
  margin: 0;
}
#js_tdhxz {
  * {
    margin: 0;
    font-size: 22px;
    line-height: 36px;
    color: #333;
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

  label {
    width: 36px;
    height: 36px;
    background: url("@{image-base-url}/radio_normal.png") no-repeat center
      center;
    display: block;
    float: left;
    // margin-top: 48px;
    cursor: pointer;
  }

  label.checked {
    background: url("@{image-base-url}/radio_select.png") no-repeat center
      center;
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
}
</style>
