<template lang="pug">
  div(id='bk_ssA')
    video(
      :src='videoUrl'
      v-if='showVideo'
      autoplay='true'
      disabled='true'
      width='auto'
      height='100%'
      @ended='handleVideoEnd'
      @error='handleVideoError($event, "error")'
      @stalled='handleVideoError($event, "stalled")'
    )
    div(v-else)
      img(:src='imgUrl' v-if='imgUrl')
      p(v-else width='auto' height='100%') {{topicContent}}
</template>

<script>
import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
/**
 * 短文朗读
 */
export default {
  name: 'bk_ssD',
  props: ['data', 'index', 'onSetRec'],
  data() {
    return {
      showVideo: false,
      videoUrl: '',
      videoEndedFn: '',
      topicContent: '',
      imgUrl: '',
      rerenderCount: 0,
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
      let tmpIdx = this.rerenderCount < 2 ? this.rerenderCount : 0
      this.showVideo = false
      if (pic) this.imgUrl = pic
      this.topicContent = this.data.topicOption[tmpIdx].topicContent
      this.rerenderCount++
      this.updateData()
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
            type: 'sent',
            refText: this.topicContent
          })
        )
      }
    }
  },
  mounted () {
  }
};
</script>

<style lang="less" scoped>
#bk_ssA {
  width: 100%;
  padding: 10% 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align:center;

  & p {
    text-align: left;
    display:inline-block;
    max-width: 620px;
    font-size: 24px;
    color: #333;
    line-height: 36px;
  }
}
</style>
