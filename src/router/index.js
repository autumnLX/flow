import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import StudentApp from '@/components/zy/App'
import Personal from '@/components/zy/Personal/_export'
import Home from '@/components/zy/Home'
import Exam from '@/components/zy/Exam'
import Learn from '@/components/zy/Learn'
import Word from '@/components/zy/Word'
import Grow from '@/components/zy/Grow/Grow'
import Battle from '@/components/zy/Battle/App'
import Examination_old from '@/components/zy/Examination/App'
import new_exam from '@/components/zy/new_exam/app'

import TeacherApp from '@/components/cp/App'

const modelId = window.location.href.match(/(?<=modelId=)\d*/)[0]
const mids = {
  2: 'Beijing',
  3: 'Yinchuan',
  4: 'KuaiLeMaiTian',
  5: 'Shenyang',
  8: 'JiangSuZhongKao',
  9: 'Newshengyang',
  10: 'Ningbo'
}

let Examination = new_exam
if (mids[modelId]) {
  Examination = Examination_old
}

const whiteList = (identity, toPath) => {
  if (identity === 'student' && (toPath === '/examination')) {
    return true
  }
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    component: Login,
  }, {
    path: '/student',
    component: StudentApp,
    children: [{
      path: 'personal',
      component: Personal.App,
      children: [{
        path: '',
        redirect: 'info'
      }, {
        path: 'info',
        component: Personal.Info
      }, {
        path: 'certificate',
        component: Personal.Certificate
      }, {
        path: 'password',
        component: Personal.Password
      }, {
        path: 'message',
        component: Personal.Message
      }]
    }, {
      path: '',
      redirect: 'home'
    }, {
      path: 'home',
      name: 'home',
      component: Home
    }, {
      path: 'exam',
      name: 'exam',
      component: Exam
    }, {
      path: 'learn',
      name: 'learn',
      component: Learn
    }, {
      path: 'word',
      name: 'word',
      component: Word
    }, {
      path: 'grow',
      name: 'grow',
      component: Grow
    }, {
      path: 'battle',
      name: 'battle',
      component: Battle
    }]
  }, {
    path: '/teacher',
    component: TeacherApp,
  }, {
    path: '/examination',
    component: Examination
  }, {
    path: '/newExam',
    component: new_exam
  }]
})

router.beforeEach((to, from, next) => {
  let toPath = to.path;

  if (toPath === '/login') {
    sessionStorage.removeItem('login');
    next()
  } else {
    let login = sessionStorage.getItem('login') === '1';
    let identity = sessionStorage.getItem('identity') || 'student';
    let match = new RegExp('^/((' + identity + ')(/|$)|$)');
    if ((login && match.test(toPath)) || whiteList(identity, toPath)) {
      if (toPath === '/') {
        next('/' + identity)
      } else {
        next()
      }
    } else {
      next('/login')
    }
  }
});

export default router
