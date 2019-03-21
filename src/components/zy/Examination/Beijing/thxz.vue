<template lang="pug">
  div(id='thxz')
    dl(v-for='(topicOption, i) in data.topicOption' :key='i')
      dt
        span {{index * 2 + i + 1}}.
        div(v-html='topicOption.topicStem')
      dd(v-for='(option, j) in topicOption.options' :key='i + "@" + j' @click='onSelectAnswer($event, i, option.option)') 
        label(:class='{checked: myAnswer[i] === option.option}')
        span {{option.option}}.
        div(class='optionDesc' v-html='option.optionDesc')
</template>

<script>
export default {
  name: 'thxz',
  props: ['data', 'index', 'onSetMyAnswer'],
  data() {
    return {
      myAnswer: ['', '']
    }
  },
  methods: {
    onSelectAnswer: function (event, i, option) {
      this.myAnswer[i] = option
      this.myAnswer = this.myAnswer.concat()
      this.onSetMyAnswer(this.myAnswer.join(','))
    },
    updateData: function () {
      this.myAnswer = ['', '']
      this.onSetMyAnswer(this.myAnswer.join(','))
    }
  },
  watch: {
    data: function () {
      this.updateData()
    }
  },
  mounted () {
    this.updateData()
  }
};
</script>

<style>
#thxz * {
  margin: 0;
  font-size: 22px;
  line-height: 36px;
  color: #333;
  font-family: "Times New Roman", "SimSun";
}
</style>

<style lang="less" scoped>
@image-base-url: "../../../../assets/student/examination";

#thxz {
  width: 100%;

  dl {
    margin-bottom: 20px;

    dt {
      font-weight: bold;

      span {
        float: left;
      }

      div {
        display: block;
      }
    }

    dd {
      cursor: pointer;

      * {
        display: block;
      }

      label {
        width: 36px;
        height: 36px;
        background: url("@{image-base-url}/radio_normal.png") no-repeat center
          center;
        float: left;
        cursor: pointer;
      }

      label.checked {
        background: url("@{image-base-url}/radio_select.png") no-repeat center
          center;
      }

      span {
        float: left;
      }
    }
  }
}
</style>
