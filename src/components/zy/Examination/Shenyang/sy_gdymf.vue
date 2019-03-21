<template lang="pug">
  div(id='gdymf')
    div(
      v-for='(option, i) in data.topicOption'
      :class='{active: index === i, disabled: index < i && index >= 0}'
      v-html='option.topicStem'
    )
</template>

<script>
import $ from '@/utility/dollar.js'

/**
 * 跟读与模仿
 */
export default {
  name: 'gdymf',
  props: ['data', 'index', 'phase', 'onSetRec'],
  data() {
    return {
    }
  },
  methods: {
    updateData() {
      if (this.data && this.index >= 0) {
        this.onSetRec(
          $.getServerParams({
            type: 'sent', // 2018.9.12 固定句子内核 By 老王
            refText: this.data.topicOption[this.index].label.replace(/<\/?[^>]*>/g, ''),
          })
        )
      }
    }
  },
  watch: {
    data() {
      this.updateData()
    },
    index() {
      this.updateData()
    }
  },
  mounted () {
  }
}
</script>

<style>
#gdymf * {
  margin: 0;
  color: #333;
  font-family: 'Times New Roman', 'SimSun';
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#gdymf {
  width: 100%;

  * {
    font-size: 22px;
    color: #333333;
    line-height: 36px;
    display: inline;

    &.active {
      background: #e1f9eb;
      color: #21bd73;
      * {
        color: #21bd73;
      }
    }

    &.disabled {
      color: #ccc;
      * {
        color: #ccc;
      }
    }
  }
}
</style>