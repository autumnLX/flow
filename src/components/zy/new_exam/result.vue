<template lang="pug">
  div
    div(class='submitSuccess' v-if='submit === "submitted"')
      div.ss-title 考试完毕
      div.ss-content
        img(src='../../../assets/student/examination/avatar.png')
        div
          div
            div.ss-left
              span.ss-caption 考试姓名
              span ：{{stuInfo.name}}
            div.ss-right
              span.ss-caption 性别
              span ：{{stuInfo.gender == '1' ? '男':'女'}}
          div
            div.ss-left
              span.ss-caption 准考证号
              span ：{{passNumber}}
          div
            div.ss-left
              span.ss-caption 身份证号
              span ：
          div
            div.ss-left
              span.ss-caption 考场
              span ：
            div.ss-right
              span.ss-caption 座位号
              span ：
          div
            div.ss-left
              span.ss-caption 考点
              span ：{{stuInfo.stuSchool}}
      div.ss-footer
        p(class='ss-green') 提交答卷完成，请等待监考老师指令...
        p(class='ss-grey') 点击 <span @click='handleQuit'>返回首页</span> 体验咔咪英语更多功能！
    div(class='popup' v-if='submit === "submitting"')
      div
        i(class='icon submitting')
        p(class='text-green') 考试结束，正在努力交卷中...
    div(class='popup' v-if='submit === "fail"')
      div
        i(class='icon fail')
        p(class='text-666') 哎呀，网络又调皮了，交不了卷了！
        div(class='footer')
          button(class='secondary' @click='handleQuit') 返回首页
          button(@click='$emit("resubmit")') 重新交卷
    div(id='score'  v-if='submit === "result"')
      div(:class='{red: result.score === 0}')
        <p class='p1'><span>{{result.score}}</span>分</p>
        a(:href='result.report' target='_blank') 查看分数详情&gt
        p(class='p2') {{result.score > 0 ? '恭喜你同学，继续努力哟！' : '哎呀，要加油哦！'}} 
        p(class='p4' v-if='competitionType === "4"')
          span(class='fl') 历史最高分：{{result.highest}}
          span(class='fr') 当前排名：{{result.rank}}
        p(class='p4' style='text-align: center' v-else)
          span(class='fn') 历史最高分：{{result.highest}}
        div(style='display: flex;justify-content: center;margin-top: 30px;')
            button(name='again' @click='$emit("handleRetry")') 再试一次
            button(name='back' @click='handleQuit') 完成
        span(v-if='result.remain < 11') 还剩{{result.remain}}次机会
</template>

<script>
import $ from '@/utility/dollar.js'
export default {
  props: ['submit', 'competitionType', 'result', 'passNumber'],
  data () {
    return {
      stuInfo: {
        name: $.getUrlParam('name', 'decodeURIComponent'),
        gender: $.getUrlParam('gender', 'decodeURIComponent'),
        stuSchool: $.getUrlParam('stuSchool', 'decodeURIComponent')
      },
    }
  },
  methods: {
    handleQuit () {
      let fromUrl = $.getUrlParam('fromUrl', 'decodeURIComponent') || ''
      window.location.href = fromUrl ? fromUrl.replace(/{{q}}/g, '?').replace(/{{a}}/g, '&') : '/stu'
    },
    handleRetry () {
      if (this.result.remain > 0) {
        this.$emit('handleRetry')
      } else {
        this.$alert('已经没有多余练习机会了！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@width: 1014px;
@image-base-url: "../../../assets/student/examination";

.submitSuccess {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  .ss-title {
    box-sizing: border-box;
    width: 560px;
    padding-left: 36px;
    color: #fff;
    font-size: 20px;
    line-height: 44px;
    background-color: #21bd73;
  }

  .ss-content {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 560px;
    padding: 40px 0 0 36px;
    background-color: #f5fff9;

    img {
      width: 120px;
      height: 120px;
      margin: 0;
    }

    & > div {
      flex: 1;
    }

    & > div > div {
      display: flex;
      margin: 20px 0 20px 32px;

      .ss-left {
        flex: 1;
      }

      .ss-right {
        width: 133px;
      }

      span {
        color: #333;
      }

      span.ss-caption {
        color: #21bd73;
      }
    }
  }

  .ss-footer {
    justify-content: center;
    align-items: center;
    width: 560px;
    height: 110px;
    background-color: #d9fce9;

    p {
      width: 100%;
      text-align: center;
    }

    .ss-green {
      height: 22px;
      line-height: 22px;
      margin: 32px auto 16px;
      color: #21bd73;
      font-size: 22px;
    }

    .ss-grey {
      color: #999;
      font-size: 14px;
      line-height: 14px;
      height: 14px;

      span {
        color: #21bd73;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}

.popup {
  position: fixed;
  top: 61px;
  left: 0;
  z-index: 90;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);

  & > div {
    display: flex;
    flex-direction: column;
    width: 400px;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
    transform: translateY(-91px);

    button {
      width: 100px;
      padding: 0;
      margin: 0 25px;
      border: 1px solid #f76260;
      border-radius: 2px;
      color: #fff;
      font-size: 16px;
      line-height: 38px;
      background-color: #f76260;
      cursor: pointer;

      &.secondary {
        border: 1px solid #ccc;
        color: #666;
        background-color: #fff;
      }
    }

    .body {
      padding: 40px 40px 0;

      p {
        margin: 0;
        color: #666;
        font-size: 16px;
        text-align: center;
        line-height: 30px;
      }
    }

    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 97px;
    }
  }

  p.text-green {
    margin: 0;
    color: #21bd73;
    font-size: 18px;
    font-weight: bold;
    text-align: center;

    &:last-child {
      margin-bottom: 60px;
    }
  }

  p.text-gray {
    margin: 25px 0 35px;
    color: #999;
    text-align: center;
  }

  p.text-666 {
    margin: 0;
    color: #666;
    font-size: 16px;
    text-align: center;
  }

  i.icon {
    display: block;
    width: 60px;
    height: 60px;

    &.submitting {
      margin: 50px auto 20px;
      background-image: url("@{image-base-url}/pic_download.gif");
    }

    &.submitted {
      margin: 35px auto 20px;
      background-image: url("@{image-base-url}/pic_finish.png");
    }

    &.fail {
      width: 101px;
      height: 81px;
      margin: 30px auto 10px;
      background-image: url("@{image-base-url}/pic_neterror.png");
    }
  }
}
#score {
  position: fixed;
  top: 61px;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);

  & > div {
    position: relative;
    box-sizing: border-box;
    width: 386px;
    height: 417px;
    padding-top: 70px;
    background-image: url("@{image-base-url}/score_green.png");
    transform: translateY(-61px);

    .p1 {
      margin-bottom: 0;
      color: #fff;
      font-size: 18px;
      text-align: center;

      span {
        width: 60px;
        font-size: 68px;
      }
    }

    .p2 {
      margin-top: 30px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    .p3 {
      margin-top: 16px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      height: 18px;
      line-height: 18px;

      span {
        color: #f9c911;
        font-size: 14px;
        font-weight: bold;
      }

      a {
        color: #fff;
        text-decoration: underline;
      }
    }

    .p4 {
      margin-top: 40px;
      padding: 0 40px;
      overflow: hidden;

      span {
        padding-left: 24px;
        color: #9e9e9e;
        font-size: 16px;
        background-repeat: no-repeat;
        background-position: left center;

        &.fl,
        &.fn {
          background-image: url("@{image-base-url}/score_history.png");
        }

        &.fr {
          background-image: url("@{image-base-url}/score_rank.png");
        }
      }
    }

    button {
      width: 100px;
      height: 35px;
      margin: 0 20px;
      border: 0;
      border-radius: 8px;
      background-color: #fff;
      cursor: pointer;

      &[name="again"] {
        border-color: 1px solid #3ebe7d;
        color: #fff;
        background-color: #3ebe7d;
      }

      &[name="back"] {
        border: 1px solid #616161;
        color: #616161;
      }
    }

    a {
      display: block;
      width: 100px;
      margin: 0 auto;
      color: #fff21c;
      text-decoration: underline;
    }

    & > span {
      position: absolute;
      bottom: 18px;
      left: 73px;
      width: 100px;
      color: #c1c1c1;
      font-size: 12px;
      text-align: center;
    }

    &.red {
      background-image: url("@{image-base-url}/score_red.png");

      button[name="again"] {
        border-color: #ea492c;
        background-color: #ea492c;
      }
    }
  }
}
</style>
