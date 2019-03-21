<template lang="pug">
  div(ref='wrapper')
    div(class='title') 我的证书
    div(class='content')
</template>

<script>
export default {
  name: 'PersonalCertificate',
  props: ['resize'],
  mounted() {
    let height = getComputedStyle(this.$refs.wrapper).getPropertyValue('height').replace('px', '');
    height = height < 200 ? 200 : height
    this.resize(height)
  }
}
</script>

<style lang='less' src='@/styles/personal.less' scoped></style>
<style lang="less" scoped>
.title {
  background-image: url('../../../assets/student/personal/ic_certificate_normal.png');
}
</style>

