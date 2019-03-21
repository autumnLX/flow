<template lang="pug">
  div
    component(:flow="flow" v-if="flow" :is="modelIds[modelId]")
</template>

<script>
import $ from '@/utility/dollar.js'
// import _flow from './zibo/flow.json'
const new_shenyang = () => import('./test/app')
const zibo = () => import('./zibo/app')
export default {
  components: { new_shenyang, zibo },
  data () {
    return {
      flow: '',
      modelId: -1,
      modelIds: {
        12: 'zibo'
      }
    }
  },
  methods: {
    getFlow () {
      console.log(this.modelId)
      return new Promise((resolve, reject) => {
        $.jsonp('/paperProcedures/getProcedureForWeb', { // 获取考试流程
          modelId: this.modelId
        }, (res) => {
          if (res.status === 1) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    }
  },
  mounted () {
    this.modelId = $.getUrlParam('modelId')
    // if (!_flow) {
    this.getFlow().then(res => {
      this.flow = res.data
    }).catch(res => {
      this.$alert('获取流程失败', res.info)
    })
    // } else {
    //   this.flow = _flow
    // }
  }
}
</script>
<style lang="less" scoped>
@import url("../../../ui/css/ui.css");
</style>

