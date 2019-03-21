<template lang="pug">
  div(id='yc_tdhtk')
   img(:src='imgUrl')
   <div v-for='number in fillNumber' :key='number' :class='{disabled: index === -1}'>
    <span>{{number + 20}}.</span>
    <input type="text" @input='submit($event, number)'>
   </div>
</template>

<script>
import Config from '@/config/config.js'

/**
 * 听对话填空
 */
export default {
  name: 'thjl',
  props: ['data', 'onSetMyAnswer', 'index'],
  data() {
    return {
      imgUrl: '',
      fillNumber: '',
      myAnswer: ['', '', '', '', ''],
      resUrl: window.ConfigNew ? window.ConfigNew.resUrl : Config.res
    }
  },
  methods: {
    submit(event, number) {
      this.myAnswer[(parseInt(number) - 1)] = event.target.value
      this.onSetMyAnswer(this.myAnswer, 0)
    },
    updataData() {
      if (this.data) {
        let attachment = this.data.topicAttachment
        attachment.forEach((value) => {
          if (value.attachmentType === 3) {
            this.imgUrl = this.resUrl + value.attachmentUrl
          }
        })
        this.fillNumber = parseInt(this.data.topicOption[0].placeholder)
      }
    }
  },
  mounted () {
    this.updataData()
    this.onSetMyAnswer(this.myAnswer, 0)
  }
}
</script>

<style>
#yc_tdhtk * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#yc_tdhtk {
  width: 100%;
  img {
    display: block;
    max-height: 355px;
    min-height: 215px;
  }
  div {
    &.disabled {
      color: #ccc;
      pointer-events: none;
      input {
        color: #ccc;
        border-bottom: 1px solid #ccc;
      }
      span {
        color: #ccc;
      }
    }
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
      padding-left: 26px;
      font-size: 18px;
      color: #333333;
      height: 40px;
      width: 190px;
      border: none;
      outline: none;
      border-bottom: 1px solid #333;
      box-sizing: border-box;
    }
  }
}
</style>