//"http://www.msmk.jsyxl360.com",
//129.211.12.41
//"http://c"
//http://192.168.8.85:9999
//"http://192.168.8.76:9999",
const args = require('minimist')(process.argv.slice(2))
const NODE_ENV = process.env.NODE_ENV !== "development"
const type = args['type'] || 'dev'

module.exports = {
  test: {
    vueConfig: {
      publicPath: NODE_ENV ? "/" : "/",
      proxys: {
        "api": "http://kualigotestlesson.zkmsmk.com:8888",
      },
      webUrl: {
        'event-ui': 'http://kualigotestevent.zkmsmk.com:8888'
      }
    },
    uploadConfig: {
      path: '/data/btbc-ui/lesson-ui',
      sshConfig: {
        host: '192.168.8.12',
        port: 22,
        username: 'root',
        password: 'msmk@123456'
      }
    }
  },
  /* test: {
    vueConfig: {
      publicPath: NODE_ENV ? "/lesson-ui/" : "/",
      proxys: {
        "api": "http://10.10.80.20:80",
      }
    },
    uploadConfig: {
      path: '/data/btbc-ui/lesson-ui',
      sshConfig: {
        host: '10.10.80.20',
        port: 22,
        username: 'root',
        password: 'msmk@123'
      }
    }
  }, */
  prod: {
    vueConfig: {
      publicPath: NODE_ENV ? "/lesson-ui/" : "/",
      proxys: {
        "api": "http://kualigo.com:81",
      },
      webUrl: {
        'event-ui': 'http://kualigotestevent.zkmsmk.com:8888'
      }
    },
    uploadConfig: {
      path: '/data/btbc-ui/lesson-ui',
      sshConfig: {
        host: '115.239.226.103',
        port: 22,
        username: 'root',
        password: 'Msmk@123456'
      }
    }
  },
  /* prod: {
    vueConfig: {
      publicPath: NODE_ENV ? "/lesson-ui/" : "/",
      proxys: {
        "api": "http://kualigo.com:81",
      }
    },
    uploadConfig: {
      path: '/data/btbc-ui/lesson-ui',
      sshConfig: {
        host: '101.71.103.189',
        port: 40022,
        username: 'root',
        password: 'Gr5!Pt12Q'
      }
    }
  }, */
  pre: {
    vueConfig: {
      publicPath: NODE_ENV ? "/" : "/",
      proxys: {
        "api": "http://kualigodevlesson.zkmsmk.com:8890",
      },
      webUrl: {
        'event-ui': 'http://kualigodevevent.zkmsmk.com:8890'
      }
    },
    uploadConfig: {
      path: '/data/btbc-ui/lesson-ui',
      sshConfig: {
        host: '139.224.53.111',
        port: 22,
        username: 'root',
        password: 'msmk@123456'
      }
    }
  },
  dev: {
    vueConfig: {
      publicPath: NODE_ENV ? "/" : "/",
      proxys: {
        "api": "http://192.168.8.115:9999",
        // "api": "http://192.168.8.106:9999",
      },
      webUrl: {
        'event-ui': 'http://kualigotestevent.zkmsmk.com:8888'
      }
    },
  },
  /* test: {
    vueConfig: {
      publicPath: NODE_ENV ? "/lesson-ui/" : "/",
      proxys: {
        "api": "http://192.168.8.12",
      }
    },
    uploadConfig: {
      path: '/data/btbc-ui/lesson-ui',
      sshConfig: {
        host: '192.168.8.12',
        port: 22,
        username: 'root',
        password: 'msmk@123456'
      }
    }
  }, */
  getConfigType () {
    return type
  },
  getConfig () {
    return this[type]
  },
};