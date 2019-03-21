<template lang="pug">
  div(ref='wrapper')
    div(class='title') 个人信息
    div(class='content')
      table
        tbody
          tr(v-for='row in rows')
            td *
            td {{row.text}}
            td(v-if='status===2 && row.key==="name"')
              input(v-model='name')
            td(v-else-if='status===2 && row.key==="gender"')
              div(class='md-radio')
                label
                  input(type='radio' v-model='gender' value='1')
                  span 男
                label
                  input(type='radio' v-model='gender' value='0')
                  span 女
            td(v-else) {{user[row.key]}}
      br
      button(v-if='status===1' '@click'='edit') 编辑
      button(v-if='status===2' '@click'='save') 保存
      button(v-if='status===2' '@click'='cancel') 取消
</template>

<script>
export default {
  name: 'PersonalInfo',
  props: ['resize'],
  data() {
    return {
      status: 1,
      name: this.$store.state.user.name,
      gender: this.$store.state.user.gender,
      rows: [
        {
          text: '姓名：',
          key: 'name'
        },
        {
          text: '性别：',
          key: 'gender'
        },
        {
          text: '手机号：',
          key: 'phone'
        },
        {
          text: '所在地区：',
          key: 'country_name'
        },
        {
          text: '所在学校：',
          key: 'school_name'
        },
        {
          text: '所在年级：',
          key: 'category_name'
        },
        {
          text: '所在班级：',
          key: 'class_name'
        }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.getters.personalBaseInfo
    }
  },
  methods: {
    edit() {
      this.status = 2;
    },
    save() {
      let newPersonalInfo = Object.assign({}, this.user);

      newPersonalInfo.name = this.name;
      newPersonalInfo.gender = this.gender;

      this.$store.commit('setUser', newPersonalInfo);
      this.status = 1;
    },
    cancel() {
      this.status = 1;
    }
  },
  mounted() {
    let height = getComputedStyle(this.$refs.wrapper).getPropertyValue('height')
    this.resize(height.replace('px', ''))
  }
}
</script>

<style lang='less' src='@/styles/personal.less' scoped></style>
<style lang="less" scoped>
.title {
  background-image: url('../../../assets/student/personal/ic_personacenter_normal.png');
}

button {
  margin-right: 15px;
}

table {
  width: 100%;

  tbody>tr>td {
    line-height: 30px;

    &:first-child {
      width: 9px;
      color: red;
    }

    &:nth-child(2) {
      width: 70px;
      padding: 0 10px;
      text-align: right;
    }
  }
}
</style>

