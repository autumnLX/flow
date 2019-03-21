<template lang="pug">
  div(id='dwld')
    p {{data.topicContent}}
</template>

<script>
import $ from '@/utility/dollar.js'

export default {
  name: 'dwld',
  props: ['data', 'onSetRec'],
  methods: {
    updateData() {
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
  watch: {
    data() {
      this.updateData()
    }
  },
  mounted () {
    this.updateData()
  }
}
</script>

<style>
#dwld * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: 'Times New Roman', 'SimSun';
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#dwld {
  width: 100%;

  p {
    margin-bottom: 20px;
    font-size: 22px;
    color: #333333;
    line-height: 36px;  
  }
}
</style>