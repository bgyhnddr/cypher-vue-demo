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
      frozen_agent,
    ].map((o) => o.sync({
      force: true
    }))).then((result) => {
      return Promise.all([
        frozen_agent.create({
          agent_guid: "321"
        })
      ])
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
        agent:"321"
      }).then((result) => {
        return result.should.equal('代理未被冻结')
      })
    })
  })
})
