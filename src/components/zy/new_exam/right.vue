<template lang="pug">
   div.right
    p(class='title color-21bd73') 考生信息
    img(:src='student.headPic||"/web/static/pic_head.png"')
    div
      div(class='item') 
        p(class='color-21bd73') 考生姓名：
        p(class='color-666666') {{student.name}}
      div(class='item') 
        p(class='color-21bd73') 准考证号：
        p(class='color-666666') {{passNumber}}
</template>

<script>
export default {
  props: ['student', 'passNumber']
}
</script>

<style lang="less" scoped>
.color-21bd73 {
  color: #21bd73;
}

.color-999999 {
  color: #999999;
}

.color-666666 {
  color: #666666;
}

.color-bababa {
  color: #bababa;
}

.right {
  .title {
    margin: 0;
    margin-bottom: 30px;
    font-size: 18px;
  }

  img {
    // width: 100px;
    // height: 100px;
    // border-radius: 100%;
    margin-bottom: 30px;
  }

  div {
    flex: 1;

    .item {
      padding: 0 40px;
      margin-bottom: 30px;

      p {
        margin: 0;
        font-size: 18px;
        font-family: "宋体";
        line-height: 27px;
      }
    }
  }
}
</style>
