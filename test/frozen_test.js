var should = require('should')
var employment_term = require('../db/models/employment_term')
var team = require('../db/models/team')
var team_agent = require('../db/models/team_agent')
var agent = require('../db/models/agent')
var agent_detail = require('../db/models/agent_detail')
var agent_brand_role = require('../db/models/agent_brand_role')
var frozen_agent = require('../db/models/frozen_agent')

describe('frozen-test', () => {
  before(function() {
    this.timeout(10000)
      // runs before all tests in this block
    return Promise.all([
      agent,
      agent_detail,
      agent_brand_role,
      employment_term,
      team,
      team_agent,
      frozen_agent,
    ].map((o) => o.sync({
      force: true
    }))).then((result) => {
      return agent.create({
        user_account: "frozen-tester",
        guid: "123"
      }).then((result) => {
        agent_guid = result.guid
        return Promise.all([
          agent_detail.bulkCreate([{
            agent_guid:agent_guid,
            key: 'name',
            value: "冻结者"
          }, {
            agent_guid:agent_guid,
            key: 'wechat',
            value: "frozener"
          }, {
            agent_guid:agent_guid,
            key: 'cellphone',
            value: "17777777777"
          }, {
            agent_guid:agent_guid,
            key: 'IDType',
            value: "身份证"
          }, {
            agent_guid:agent_guid,
            key: 'IDNumber',
            value: "440402199525256666"
          }, {
            agent_guid:agent_guid,
            key: 'address',
            value: "法兰西"
          }, {
            agent_guid:agent_guid,
            key: 'addressDetail',
            value: "巴黎"
          }, {
            agent_guid:agent_guid,
            key: 'headImg',
            value: "1"
          }]),
          agent_brand_role.create({
            agent_guid: result.guid,
            brand_role_code: "brand_role2"
          }),
          employment_term.create({
            agent_guid: result.guid,
            term_from: "2017-01-13",
            term_to: "2018-01-13"
          }),
          team.create({
            brand: "B",
            code: "XXX"
          }),
          team_agent.create({
            agent_guid: result.guid,
            team_code: "XXX"
          }),
          frozen_agent.create({
            agent_guid: "321"
          })
        ])
      })
    })
  })
  var cres = {
    send: function(text) {
      return text
    },
    status: (code) => {
      console.log(code)
      return {
        send: function(text) {
          return text
        }
      }
    }
  }
  var testfunction = (action, params) => {
    try {
      return require('../server/private/frozen')({
        session: {
          userInfo: {
            name: "tester"
          }
        },
        params: {
          action
        },
        query: params,
        body: params
      }, cres)
    } catch (e) {
      console.log(e)
    }
  }
  describe('FrozenAgent', () => {
    it('frozen agent', () => {
      return testfunction("FrozenAgent", {
        agent:"123"
      }).then((result) => {
        return result.should.equal('OK')
      })
    })
  })
  describe('ThawAgent', () => {
    it('thaw agent frozen', () => {
      return testfunction("ThawAgent", {
        agent:"321"
      }).then((result) => {
        return result.should.equal('OK')
      })
    })
    it('thaw agent not_frozen', () => {
      return testfunction("ThawAgent", {
        agent:"213"
      }).then((result) => {
        return result.should.equal('代理未被冻结')
      })
    })
  })
})
