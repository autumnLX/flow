<template>
  <div id='thjl_tk'>
    <p>请在如下区域作答</p>
    <div v-for='number in fillNumber' :key='number'>
      <span>{{number}}.</span>
      <input type="text" @blur='submit($event, number)'>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'thjl_tk',
  props: ['data', 'fillNumber', 'onAnwser'],
  data() {
    return {
      myAnswer: ['', '', '', '', '']
    }
  },
  methods: {
    updateData () {
      this.myAnswer = ['', '', '', '', '']
      this.onAnwser(this.myAnswer, 0)
    },
    submit(event, number) {
      this.myAnswer[(parseInt(number) - 1)] = event.target.value
      this.onAnwser(this.myAnswer, 0)
    }
  },
  watch: {
    data: function () {
      if (this.data) this.updateData()
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#thjl_tk {
  height: 140px;
  p {
    font-size: 18px;
  }
  div {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    margin-right: 20px;
    margin-bottom: 5px;
    position: relative;
    span {
      font-size: 18px;
      position: absolute;
      bottom: 0;
    }
    input {
      padding-left: 20px;
      font-size: 18px;
      color: #333333;
      height: 40px;
      width: 190px;
      border: none;
      outline: none;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>