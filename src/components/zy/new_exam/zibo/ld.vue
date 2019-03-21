<template lang="pug">
  div(id='ld')
    p(v-html='data[0].topicContent')
</template>

<script>

/**
 * 朗读
 */
export default {
  name: 'ld',
  props: ['data'],
  methods: {
    updateData () {
      if (this.data[0]) {
        this.$eventbus.$emit('SetRec', {
          type: 'pred',
          refText: this.data[0].topicContent,
        }, 0, 0)
      }
    }
  },
  watch: {
    data () {
      this.updateData()
    }
  },
  mounted () {
    this.updateData()
  }
}
</script>

<style>
#ld * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#ld {
  width: 100%;

  p {
    margin-bottom: 20px;
    font-size: 22px;
    color: #333333;
    line-height: 36px;
  }
}
</style>