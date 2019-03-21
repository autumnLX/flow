<template lang="pug">
  div(id='js_dwld')
    p(v-html='data.topicContent')
</template>

<script>
import $ from '@/utility/dollar.js'
/**
 * 短文朗读
 */
export default {
  name: 'js_dwld',
  props: ['data', 'index', 'onSetRec', 'onSetMyAnswer'],
  methods: {
    updateData: function () {
      if (this.data) {
        this.onSetRec(
          $.getServerParams({
            type: 'auto',
            refText: this.data.topicContent,
            standarAudio: this.data.topicAttachment
          })
        )
      }
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style>
#js_dwld * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: 'Times New Roman', 'SimSun';
}
</style>

<style lang="less" scoped>
#js_dwld {
  width: 100%;

  p {
    margin-bottom: 20px;
    font-size: 22px;
    color: #333333;
    line-height: 36px;  
  }
}
</style>
