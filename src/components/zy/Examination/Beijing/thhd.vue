<template lang="pug">
  div(id='thhd')
    span {{index + 1}}.
    div(v-html='data.topicContent')
</template>

<script>
import $ from '@/utility/dollar.js'
export default {
  name: 'thhd',
  props: ['data', 'index', 'onSetRec'],
  methods: {
    updated() {
      if (this.data) {
        this.onSetRec(
          $.getServerParams({
            type: 'hitalk',
            keyWords: this.data.topicKeyword,
            refText: this.data.answer.replace(/#/g, '|')
          })
        )
      }
    }
  },
  watch: {
    data() {
      this.updated()
    }
  },
  mounted () {
    this.updated()
  }
};
</script>

<style>
#thhd * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: 'Times New Roman', 'SimSun';
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#thhd {
  width: 100%;
  span {
    float: left;
  }
  div {
    display: block;
  }
}
</style>

