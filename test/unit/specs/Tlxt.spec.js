import Vue from 'vue'
import Topic from '@/components/zy/Examination/Yinchuan/yc_tlxt'

describe('Topic.vue', () => {
  const Constructor = Vue.extend(Topic)
  const vm = new Constructor({
    propsData: {
      data: {
        topicOption: [{
          topicStem: 'No.1 topic.',
          options: [{
            option: 'A',
            optionDesc: '1.A'
          }, {
            option: 'B',
            optionDesc: '1.B'
          }]
        }, {
          topicStem: 'No.2 topic.',
          options: [{
            option: 'A',
            optionDesc: '2.A'
          }, {
            option: 'B',
            optionDesc: '2.B'
          }]
        }]
      }
    }
  }).$mount()

  it('should render two questions', () => {
    expect(vm.$el.querySelectorAll('#yc_tlxt > dl').length).to.equal(2)
  })

  it('should have a checked option', done => {
    vm.myAnswer = ['A', '']

    Vue.nextTick(() => {
      expect(vm.$el.querySelectorAll('#yc_tlxt .checked').length).to.equal(1)
      done()
    })
  })
})
