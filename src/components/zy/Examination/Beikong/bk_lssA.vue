<template lang="pug">
  div(id='bk_lssA')
    video(
      :src='videoUrl'
      id='introVideo'
      v-if='showVideo'
      autoplay='true'
      width='auto'
      height='100%'
      @ended='handleVideoEnd'
      @error='handleVideoError($event, "error")'
      @stalled='handleVideoError($event, "stalled")'
    )
    video(
      :src='topicVideoUrl'
      v-else-if='showTopicVideo'
      autoplay='true'
      width='auto'
      height='100%'
      @ended='handleTopicVideoEnd'
    )
    img(:src='imgUrl' v-else)
</template>

<script>
import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
/**
 * 短文朗读
 */
export default {
  name: 'bk_lssA',
  props: ['data', 'index', 'onSetRec', 'onSetMyAnswer'],
  data() {
    return {
      showVideo: false,
      showTopicVideo: false,
      videoUrl: '',
      videoEndedFn: '',
      imgUrl: '',
      currentData: {},
      topicVideoUrl: '',
      topicVideoEndedFn: '',
      phase: 0,
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
      this.showVideo = false
      this.showTopicVideo = false
      if (!pic) this.updateData()
      else this.imgUrl = pic
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
        this.onSetRec(
          $.getServerParams({
            type: 'scne',
            refText: this.getTopicRefText()
          })
        )
      }
    },
    getTopicRefText () {
      let refTextArr = []
      let textArr = []
      let currentAnswer = ''
      currentAnswer = this.data.topicOption[this.phase].optionDesc.replace(/#/g, '|').replace(/<\/?[a-zA-Z]+[^><]*>/g, '')
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
    videoFn: function(video, callback) {
      this.currentData = this.data.topicOption[this.phase]
      this.topicVideoUrl = this.currentData.audio && (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + this.currentData.audio.attachmentUrl

      this.showVideo = false
      this.showTopicVideo = true
      this.topicVideoEndedFn = callback
      this.phase++
    },
    handleTopicVideoEnd() {
      typeof this.topicVideoEndedFn === 'function' && this.topicVideoEndedFn()
    }
  }
};
</script>

<style lang="less" scoped>
#bk_lssA {
  width: 100%;
  padding: 10% 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
