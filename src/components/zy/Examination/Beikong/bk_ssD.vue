<template lang="pug">
  div(id='bk_ssD')
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
    img(:src='imgUrl' v-else)
</template>

<script>
import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
/**
 * 短文朗读
 */
export default {
  name: 'bk_ssD',
  props: ['data', 'index', 'onSetRec', 'onSetMyAnswer'],
  data() {
    return {
      showVideo: false,
      videoUrl: '',
      videoEndedFn: '',
      imgUrl: '',
      rerenderCount: 1,
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
      let tmpIdx = this.rerenderCount < 6 ? this.rerenderCount : 1

      this.showVideo = false
      this.imgUrl = pic || (this.data.topicAttachment[tmpIdx] ? (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + this.data.topicAttachment[tmpIdx].attachmentUrl : '')
      this.rerenderCount++
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
            type: 'prtl',
            refText: this.data.standardAnswer
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

<style lang="less" scoped>
#bk_ssD {
  width: 100%;
  padding: 10% 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
