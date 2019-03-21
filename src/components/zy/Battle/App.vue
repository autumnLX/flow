<template lang="pug">
  div(class='page' id='battle-page')
    //- 个人信息
    div(class='md-card top')
      //- div(class='title') 总览（以下信息统计基于同一年级）
      div(class='content')
        div(class='avatar')
          img(src='../../../assets/student_default_header_150x150.png')
          p(class='text-center') 点击图片更换头像
        div(class='column')
          div(class='caption') 个人信息
          p 姓名：{{user.name}}
          p(class='more' style='cursor:pointer') 等级：
            span(title='点击查看说明') 青石
          p(class='more') 势力：
            span(:title='organization') {{user.class_name}}
          p 组织：无
          p 守护：无
        div(class='column')
          div(class='caption') 战绩看板
          p 积分：0
          p 排名：1
          p 人气：129129
          p 胜利：1113次
          p 胜率：59.87%
        div(class='column col3')
          div(class='caption') 荣誉殿堂
    div(class='bottom')
      //- 我发起的挑战
      MyChallenge(:userId='id' :onRefreshReport='refreshReport')
      //- 向我发起的挑战
      ChallengeMe(:userId='id' :onRefreshReport='refreshReport' ref='challengeMe')
    //- 和我有关的战报
    div(class='md-card report')
      div(class='title') 今日战报
        router-link(to='/student' class='fr') 查看历史战报 >>
      div(class='no-report text-center' v-if='reports.length === 0') 想在这里出现内容吗？那就是去挑战吧！
      ul('@mousewheel.prevent'='scroll($event)' ref='reports' v-if='reports.length')
        li(v-for='r, i in reports' v-html='"◆ " + r')
      div(class='footer text-right') 截止 {{reportRefreshTime}}
        button('@click'='refreshReportAndChallengeMe') 刷新
</template>

<script>
import $ from '@/utility/dollar'
import MyChallenge from './MyChallenge'
import ChallengeMe from './ChallengeMe'

export default {
  name: 'Battle',
  components: { MyChallenge, ChallengeMe },
  data() {
    return {
      id: sessionStorage.getItem('id'),
      reportRefreshTime: '-',
      reports: []
    }
  },
  computed: {
    organization() {
      let user = this.user;
      return `北京市 ${user.country_name} ${user.school_name} ${user.category_name} ${user.class_name}`
    },
    user() {
      return this.$store.getters.personalBaseInfo
    }
  },
  methods: {
    scroll(event) {
      this.$refs.reports.scrollTop += event.deltaY > 0 ? 30 : -30
    },
    refreshReport() {
      this.reportRefreshTime = $.now()

      $.mock('/challengeLogsAbout/' + this.id, (res) => {
        this.reports = res.data // .splice(0, 9)
      })
    },
    refreshReportAndChallengeMe() {
      this.refreshReport()
      this.$refs.challengeMe.refresh()
    }
  },
  mounted() {
    this.refreshReport()
  }
}
</script>

<style lang='less' src='@/styles/personal.less' scoped></style>
<style lang="less">
#battle-page {
  .title {
    padding: 0 10px;

    a {
      color: #007bff;
      font-size: 12px;
    }
  }

  .n {
    padding: 0 2px;
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }

  .v {
    color: #28a745;
  }

  .x {
    color: red;
  }

  .top {

    .content {
      display: flex;
      padding: 10px;

      .avatar {
        .text-center {
          margin: 0;
          color: #868e96!important;
          font-size: 12px;
        }
      }

      .column {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 0 20px;
        margin-left: 20px;
        border-left: 1px solid #f0f0f0;

        &.col3 {
          flex: 1;
          padding-right: 0;
        }

        .caption {
          margin-bottom: 0.75rem;
          font-weight: bold;
        }

        p {
          margin: 0;
          margin-bottom: 0.5rem;

          &.more>span {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .bottom {
    display: flex;
    margin: 20px -10px;

    &>.left,
    &>.right {
      flex: 1;
      margin: 0 10px;
      overflow: hidden;

      .list {
        padding: 10px 10px 0 10px;

        ul {
          height: 210px;
          overflow: hidden;
        }

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 41px;
          padding: 0 5px;
          border-bottom: 1px solid #dcdcdc;
          color: #999;

          button {
            padding: 4px 8px;
            margin-left: 5px;
            border: 0;
            border-radius: .25rem;
            color: #fff;
            font-size: 12px;
            background-color: #007bff;
          }
        }

        &>div {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          height: 34px;
          padding: 0 5px 8px;

          a {
            color: #007bff;

            &:hover {
              border-bottom: 1px solid #007bff;
            }

            span {
              padding: 0 2px;
              color: red;
              font-size: 20px;
            }
          }
        }
      }
    }
  }

  .report {
    .no-report {
      height: 369px;
      border-bottom: 1px solid #f0f0f0;
      color: #b6b6b6;
      font-size: 16px;
      line-height: 369px;
    }

    ul {
      height: 369px;
      padding: 0 10px;
      overflow-y: scroll;

      li {
        border-bottom: 1px solid #dcdcdc;
        color: #999;
        line-height: 40px;

        span {
          padding: 0 2px;
        }
      }
    }

    .footer {
      padding: 10px;
      font-size: 12px;

      button {
        border: 0;
        color: #007bff;
        font-size: 12px;
        text-decoration: underline;
        background-color: transparent;
      }
    }
  }
}
</style>

