<template lang="pug">
  div(id='thjl')
   img(:src='imgUrl')
   component(
     :is='currentView'
     :fillNumber='fillNumber'
     :data='currentData'
     :imgUrl='imgUrl'
     :onAnwser='getAnswer'
   )
</template>

<script>
import Config from '@/config/config.js'
import THJL0 from './thjl_tk'
import THJL1 from './thjl_zs'

export default {
  name: 'thjl',
  props: ['data', 'phase', 'onSetMyAnswer', 'onSetRec'], // phase 类型int 从1开始
  components: { THJL0, THJL1 },
  data() {
    return {
      imgUrl: '',
      currentPhase: '',
      currentView: '',
      currentData: '',
      fillNumber: '',
      componentList: ['THJL0', 'THJL1']
    }
  },
  methods: {
    getAnswer(param, type) {
      if (type === 0) this.onSetMyAnswer(param, 0)
      else if (type === 1) this.onSetRec(param)
    },
    updataData() {
      if (this.data) {
        let attachment = this.data.topicAttachment
        let _this = this
        attachment.forEach(function (value) {
          if (value.attachmentType === 3) {
            _this.imgUrl = (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + value.attachmentUrl
          }
        })
        this.fillNumber = parseInt(this.data.topicOption[0].placeholder)
      }
    },
    updataPhase() {
      let phase = this.currentPhase = this.phase - 1
      this.currentView = this.componentList[phase]
      this.currentData = this.data.topicOption[phase]
    }
  },
  watch: {
    data() {
      this.updataPhase()
      this.updataData()
    },
    phase() {
      this.updataPhase()
    }
  },
  mounted () {
    this.updataPhase()
    this.updataData()
  }
}
</script>

<style>
#thjl * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#thjl {
  width: 100%;
  img {
    display: block;
    max-height: 355px;
    min-height: 215px;
  }
}
</style>