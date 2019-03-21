<template lang="pug">
  div(id='bk_lssB')
    video(
      :src='videoUrl'
      v-if='showVideo'
      autoplay='true'
      width='auto'
      height='100%'
      @ended='handleVideoEnd'
      @error='handleVideoError($event, "error")'
      @stalled='handleVideoError($event, "stalled")'
    )
    img(:src='imgUrl' v-else-if='showBreak')
    div(v-else)
      p Questions:
      p(v-for='item in text' v-html='item')
</template>

<script>
import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
/**
 * 短文朗读
 */
export default {
  name: 'bk_lssB',
  props: ['data', 'index', 'phase', 'onSetRec', 'onSetMyAnswer'],
  data() {
    return {
      showVideo: false,
      showBreak: false,
      videoUrl: '',
      videoEndedFn: '',
      currentData: {},
      text: [],
      videoErrTimes: 0,
    }
  },
  methods: {
    videoIntroFn: function(video, callback) {
      this.videoUrl = video || (this.data.topicInstruction[0] ? (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + this.data.topicInstruction[0].instructionUrl : '')
      this.showVideo = true
      this.videoEndedFn = callback
    },
    rerenderFn: function(pic, callback) {
      if (pic) {
        this.showVideo = false
        this.showBreak = true
        this.imgUrl = pic
      } else {
        this.showVideo = false
        this.showBreak = false
        this.text.splice(0, this.text.length)
        this.data.topicOption.forEach(element => {
          this.text.push(element.topicStem)
        });
      }
      callback()
    },
    handleVideoError: function(event, msg) {
      console.info(msg)
      this.videoErrTimes += 1
      if (this.videoErrTimes === 1) {
        console.info('load')
        event.target.load()
      } else if (this.videoErrTimes === 2) {
        console.info('nextTick')
        this.$nextTick(() => { event.target.load() })
      } else if (this.videoErrTimes === 3) {
        console.info('setTimeout')
        setTimeout(() => { event.target.load() }, 1000)
      } else if (this.videoErrTimes === 4) {
        console.info('setTimeout 5s')
        setTimeout(() => { event.target.load() }, 5000)
      } else this.handleVideoEnd()
    },
    handleVideoEnd: function() {
      this.videoErrTimes = 0
      typeof this.videoEndedFn === 'function' && this.videoEndedFn()
    },
    updateData: function () {
      if (this.data) {
        // let phase = this.phase - 1
        if (this.phase === 2) {
          this.onSetRec(
            $.getServerParams({
              type: 'scne',
              refText: this.getTopicRefText()
            })
          )
        } else {
          this.onSetRec(
            $.getServerParams({
              type: 'prtl',
              refText: this.currentData.standardAnswer
            })
          )
        }
      }
    },
    getTopicRefText () {
      let refTextArr = []
      let textArr = []
      let currentAnswer = ''
      currentAnswer = this.data.topicOption[this.phase - 2].topicAnswer.replace(/#/g, '|').replace(/<\/?[a-zA-Z]+[^><]*>/g, '')
      textArr = currentAnswer.split('|')
      for (var i = 0; i < textArr.length; i++) {
        refTextArr.push({
          text: textArr[i],
          active: '1',
          role: 'b',
          answer: 1
        })
      }
      return refTextArr
    },
    updataIndex() {
      this.text.splice(0, this.text.length)
      this.currentData = this.data.topicOption[this.phase - 2]
      this.text.push(this.currentData.topicStem)
    }
  },
  watch: {
    phase() {
      this.updataIndex()
      this.updateData()
    }
  }
};
</script>

<style lang="less">
#bk_lssB {
  width: 100%;
  padding: 10% 0;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    max-width: 620px;
    margin: 0;
    padding: 15px 0;
    font-size: 24px;
    line-height: 36px;
    color: #333;
  }
}
</style>
