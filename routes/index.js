var express = require('express');
var router = express.Router();
const mocks = require('../mocks/index.js');
let challenges = [];

const getNowTime = () => {
  return (new Date()).toISOString().replace('T', ' ').replace(/\s(\d\d):/, (str, $1) => { return ' ' + (parseInt($1) + 8) + ':' }).split('.')[0]
};

router.post('/a', function (req, res) {
  res.status(302).send('Go to /demos/chart.html');
  // res.redirect('/demos/chart.html');
});

/**
 * 获得除自己以外的用户信息列表
 */
router.get('/usersExcept/:id', (req, res) => {
  let users = [];

  for (let id in mocks.user) {
    if (req.params.id !== id) {
      users.push(mocks.user[id]);
    }
  }

  return res.json({
    result: 1,
    data: users
  });
});

/**
 * 获得用户信息
 */
router.get('/user/:id', (req, res) => {
  const user = mocks.user[req.params.id];

  if (user) {
    res.json({
      result: 1,
      data: user
    });
  } else {
    res.json({
      result: 0
    });
  }
});

/**
 * 发起挑战
 * req.body
 *  .from 发起挑战的用户ID
 *  .fromName 发起挑战的用户姓名
 *  .to 接受挑战的用户ID
 *  .toName 接受挑战的用户姓名
 */
router.post('/challenge', (req, res) => {
  /**
   * status
   * 1. 被撤回
   * 2. 未被响应
   * 3. 被忽略
   * 4. 胜利
   * 5. 失败
   */
  let challenge = Object.assign({}, {
    id: challenges.length + 1,
    status: 1
  }, req.body);

  challenges.push(challenge);

  let t = getNowTime();
  mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">你</span>以<span class="x">${challenge.score}分</span>的成绩向<span class="n">${challenge.toName}</span>发起了#挑战${challenges.length}#。`);
  mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">${challenge.fromName}</span>以<span class="x">${challenge.score}分</span>的成绩向<span class="n">你</span>发起了#挑战${challenges.length}#。`);

  res.json({
    result: 1
  });
})

/**
 * 获取我发起的挑战
 */
router.get('/challengeFrom/:id', (req, res) => {
  let list;
  let untreatedCount = 0;
  let challengeFromMe = challenges.filter((challenge) => {
    return challenge.from === req.params.id;
  });

  if (challengeFromMe.length > 5) {
    list = challengeFromMe.splice(0, 5);

    challengeFromMe.forEach((challenge) => {
      if (challenge.status === 1 || challenge.status === 3) {
        untreatedCount += 1
      }
    });
  } else {
    list = challengeFromMe;
  }

  res.json({
    result: 1,
    data: { list, untreatedCount }
  })
});

/**
 * 获得向我发出的挑战（仅包括需要处理的挑战）
 */
router.get('/challengeTo/:id', (req, res) => {
  let list = [];
  let untreatedCount = 0;
  let challengeToMe = challenges.filter((challenge) => {
    let status = challenge.status;
    return challenge.to === req.params.id && (status === 1 || status === 2);
  });

  if (challengeToMe.length > 5) {
    list = challengeToMe.splice(0, 5);

    challengeToMe.forEach((challenge) => {
      if (challenge.status === 1) {
        untreatedCount += 1;
      }
    });
  } else {
    list = challengeToMe;
  }

  res.json({
    result: 1,
    data: { list, untreatedCount }
  })
});

/**
 * 获取与我有关的战报
 */
router.get('/challengeLogsAbout/:id', (req, res) => {
  let id = req.params.id;

  res.json({
    result: 1,
    data: mocks.log[id]
  });
});

/**
 * 撤回挑战
 */
router.post('/cancelChallenge', (req, res) => {
  let body = req.body;
  let challenge = challenges[body.id - 1];

  if (challenge.status === 1 || challenge.status === 3) { // 未被响应或者已被忽略
    challenge.status = 0;

    let t = getNowTime();
    mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">你</span>撤回了对<span class="n">${challenge.toName}</span>的#挑战${body.id}#。`);
    mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">${challenge.fromName}</span>撤回了对<span class="n">你</span>的#挑战${body.id}#。`);

    res.json({
      result: 1,
      data: challenges.filter((challenge) => {
        return challenge.from === body.userId && challenge.status > 0;
      })
    });
  } else {
    res.json({
      result: 0
    });
  }
});

/**
 * 接受挑战
 */
router.post('/takeUpTheChallenge', (req, res) => {
  let body = req.body;
  let challenge = challenges[body.id - 1];

  if (challenge.status === 1) {
    challenge.status = 2;

    let t = getNowTime();
    mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">${challenge.toName}</span>接受了<span class="n">你</span>的#挑战${body.id}#。`);
    mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">你</span>接受了来自<span class="n">${challenge.fromName}</span>的#挑战${body.id}#。`);

    res.json({
      result: 1
    });
  } else {
    res.json({
      result: 0
    });
  }
});

/**
 * 拒绝/忽略挑战
 */
router.post('/rejectOrIgnoreChallenge', (req, res) => {
  let body = req.body;
  let challenge = challenges[body.id - 1];

  if (challenge.status === 1) {
    let status = challenge.status = Number(body.status);
    let t = getNowTime();

    if (status === 3) { // 忽略
      mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">你</span>忽略了来自<span class="n">${challenge.fromName}</span>的#挑战${body.id}#。`);
    } else if (status === 6) { // 拒绝
      mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">${challenge.toName}</span>拒绝了<span class="n">你</span>的#挑战${body.id}#。`);
      mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">你</span>拒绝了来自<span class="n">${challenge.fromName}</span>的#挑战${body.id}#。`);
    } else {
      // 其他情况忽略
    }

    res.json({
      result: 1,
      data: challenges.filter((challenge) => {
        return challenge.to === body.userId && challenge.status !== 3 && challenge.status !== 6;
      })
    });
  } else {
    res.json({
      result: 0
    });
  }
});

/**
 * 应战
 */
router.post('/challenge/beat', (req, res) => {
  let body = req.body;
  let challengeId = body.id;
  let challenge = challenges[challengeId - 1];
  let score = body.score;
  let t = getNowTime();

  if (score > challenge.score) {
    challenge.status = 5; // 挑战者失败
    mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">你</span>在#挑战${body.id}#中被<span class="n">${challenge.toName}</span>打败了。`);
    mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">你</span>在#挑战${body.id}#中战胜了<span class="n">${challenge.fromName}</span>。`);
  } else if (score < challenge.score) {
    challenge.status = 4; // 挑战者胜利
    mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">你</span>在#挑战${body.id}#中战胜了<span class="n">${challenge.toName}</span>。`);
    mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">你</span>在#挑战${body.id}#中被<span class="n">${challenge.fromName}</span>打败了。`);
  } else {
    challenge.status = 7; // 平局
    mocks.log[challenge.from].unshift(`[ ${t} ] <span class="n">你</span>在#挑战${body.id}#中与<span class="n">${challenge.toName}</span>。打成了平手`);
    mocks.log[challenge.to].unshift(`[ ${t} ] <span class="n">你</span>在#挑战${body.id}#中与<span class="n">${challenge.fromName}</span>。打成了平手`);
  }

  res.json({
    result: 1,
    data: challenge.status
  });
});

module.exports = router;
