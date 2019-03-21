<template lang="pug">
    div#detail
      div
        div 统计时间：
        div
          span {{startDate}} ~ 
          span {{endDate}}
      div 
        div(class="title")
          span 作业情况汇总
        div(class="content")
          div(class="f1")
            p(class="caption") 平均成绩：
              span(class="bad") 14分
            p(class="desc") 成绩不如人意，加油~
            div#chart1
          div(class="fr")
            p(class="caption") 已提交：
              span(class="good") 14分
            p(class="desc") 作业率完成较低，加油~
            div#chart2
      div
        div(class="title")
          span 成绩曲线
        div(class="content")
          div(class="filter")
          div#chart3
      div
        div(class="content")
          table
            thead
              tr
                th 序号
                th 作业名称
                th 提交时间
                th 成绩
                th 完成时长
            tbody
              tr(v-for='stu,index in practiceList')
                td {{index + 1}}
                td 
                  p
                   span {{stu.worksetName}}
                  p
                   span {{stu.practiceName}}
                td {{stu.sumbitDate}}
                td {{stu.avgScore}}
                td {{Math.ceil(stu.doneSec / 60)}}分钟
        div#page 
          ul
            li(class="prev disabled") <上一页
            li(class="current") 1
            li(class="next disabled") 下一页>
</template>

<script>
import $ from '@/utility/dollar.js';

export default {
  name: 'Grow',
  data() {
    return {
      practiceList: [],
      startDate: '',
      endDate: ''
    };
  },
  computed: {},
  methods: {
    bind() {
      // this.flag = !this.flag;
    }
  },
  mounted() {
    this.startDate = '2017-09-01';
    this.endDate = '2017-11-03';
    $.post('records/getOneStuPracticeList', {
      startDate: this.startDate,
      endDate: this.endDate,
      page: 1,
      row: 6
    }, (res) => {
      if (res.status === 1 && res.data.list.length > 0) {
        this.practiceList = res.data.list;
      }
    });
  }
};
</script>

<style lang='less' src='./grow.less' scoped></style>
<style lang='less' scoped>

</style>
