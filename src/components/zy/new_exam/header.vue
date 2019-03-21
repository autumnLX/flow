<template lang="pug">
  header.exanm_header
    div
      p(:title='competitionName') {{ competitionName }}
      a(@click='handleConfirmQuit') 退出
</template>

<script>
import $ from '@/utility/dollar.js'
export default {
  props: {
    competitionName: '',
    submit: ''
  },
  methods: {
    handleConfirmQuit () {
      if (this.submit !== 'submitted' && this.submit !== 'result') {
        this.$confirm('确定要退出？', '退出后将不保存进度，下次需重新开始测评', {
          confirmTxt: '退出',
          cancelTxt: '暂不退出',
          class_rel: 'exam_header_confirm_layer'
        }).then(() => {
          this.quit()
        }).catch((e) => {

        })
      } else {
        this.quit()
      }
    },
    quit () {
      const fromUrl = $.getUrlParam('fromUrl', 'decodeURIComponent') || ''
      window.location.href = fromUrl ? fromUrl.replace(/{{q}}/g, '?').replace(/{{a}}/g, '&') : '/stu'
    }
  }
}
</script>

<style lang="less" scoped>
@width: 1014px;
@image-base-url: "../../../assets/student/examination";
header {
  background-color: #21bd73;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: @width;
    height: 61px;
    margin: 0 auto;

    * {
      color: #fff;
      font-size: 18px;
      font-style: normal;
    }

    p {
      width: 468px;
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    a {
      padding-left: 30px;
      background: url("@{image-base-url}/icon_quit.png") no-repeat left center;
      cursor: pointer;
    }
  }
}
</style>
<style>
.exam_header_confirm_layer .content.center {
  min-height: 200px !important;
  min-width: 400px !important;
}
.exam_header_confirm_layer .button div:first-child {
  border: 1px solid #f76260;
  border-radius: 2px;
  color: #fff !important;;
  background-color: #f76260;
}
.exam_header_confirm_layer .button div:first-child:hover {
  border: 1px solid #f76260!important;
  border-radius: 2px;
  color: #fff !important;
  background-color: #f76260!important;
}
.exam_header_confirm_layer .button div:last-child {
  border-radius: 2px;
  border: 1px solid #ccc;
  color: #666 !important;;
  background-color: #fff;
}
.exam_header_confirm_layer .button div:last-child:hover {
  border-radius: 2px;
  border: 1px solid #ccc!important;
  color: #666!important;
  background-color: #fff!important;
}
</style>

