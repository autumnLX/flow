<template lang="pug">
  div(class='bottom')
    div.left
      p.tip(v-html="tip" :class="{short:showProcess && showCountdown}")
      countdown(:time="time" :showProcess="showProcess" v-if="showCountdown" @end="countEnd")
    div.right
      i.big.rec.iconfont(:class='{highlight: highlightRec}' v-if='showRec') &#xe600;
      i.big.iconfont(:class='{highlight: !disabled}' v-if='showPlay') &#xe64c;
      div.adjust(v-show="showAdjust")
        adjust.mic(@set="setMicVolume($event/146)" :width="146" :start_position="start_position_mic")
          i.iconfont &#xe600;
        adjust(@set="setPlayVolume($event/146)" :width="146" :start_position="start_position_play")
          i.iconfont &#xe64c;
      voice_icon(:disabled="disabled" v-if="showVoice")
</template>

<script>
export default {
  props: {
    recorder: ''
  },
  data () {
    return {
      disabled: true,
      showCountdown: false,
      time: 0,
      tip: '',
      showProcess: false,
      showAdjust: false,
      showVoice: true,
      showRec: true,
      highlightRec: false,
      showPlay: true,
      start_position_mic: 0,
      start_position_play: 0
    }
  },
  methods: {
    setMicVolume (event) {
      this.recorder && this.recorder.setMicVolume(event)
    },
    setPlayVolume (event) { // 调节放音音量
      this.recorder && this.recorder.setVolume(event)
    },
    countEnd () {
      this.showCountdown = false
    }
  },
  watch: {
    recorder () {
      this.start_position_mic = this.recorder.getMicVolume() * 146
      this.start_position_play = this.recorder.getVolume() * 146
    }
  },
  mounted () {
    this.$eventbus.$on('recordStart', (time) => {
      this.highlightRec = this.showProcess = this.showCountdown = true
      this.time = time / 1000
    })
    this.$eventbus.$on('recordStop', (a) => {
      this.highlightRec = this.showProcess = this.showCountdown = false
    })
    this.$eventbus.$on('tip', (tip) => {
      this.tip = tip
    })
    this.$eventbus.$on('countdown', (time, type) => {
      this.showCountdown = true
      this.time = time / 1000
      this.showProcess = type !== 'num'
    })
    this.$eventbus.$on('showAdjust', (flag) => {
      this.showAdjust = flag
    })
    this.$eventbus.$on('playStart', (time) => {
      this.disabled = false
    })
    this.$eventbus.$on('playStop', (a) => {
      this.disabled = true
    })
    this.$eventbus.$on('showVoice', (flag) => {
      this.showVoice = flag
    })
    this.$eventbus.$on('showRec', (flag) => {
      this.showRec = flag
    })
    this.$eventbus.$on('showPlay', (flag) => {
      this.showPlay = flag
    })
  }
}
</script>

<style lang="less" scoped>
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  padding: 0 40px 0 52px;
  background-color: #21bd73;
  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none; /* Non-prefixed version, currently
not supported by any browser */
  .tip {
    width: 430px;
    color: #fff;
    font-size: 20px;
  }
  .mic {
    margin-bottom: 5px;
  }
  .iconfont {
    font-size: 24px;
    color: white;
    margin-right: 7px;
  }
  i.big {
    width: 45px;
    font-size: 34px;
    color: #63d09d;
    text-align: center;
  }
  i.big.highlight {
    color: white;
  }
  i.rec {
    border-right: 1px solid #4dc98f;
  }

  .left {
    display: flex;
    align-items: center;

    .tip {
      width: 430px;
      color: #fff;
      font-size: 20px;

      &.short {
        width: 180px;
      }
    }

    .countdown {
      color: #fff;
      font-size: 30px;
      font-weight: bold;
    }
  }

  .right {
    display: flex;
    align-items: center;
    > .adjust {
      margin-right: -20px;
    }
  }
}
</style>
