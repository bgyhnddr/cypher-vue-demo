function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}
function weekOfYear(date){
    var d = new Date(date.toUTCString());
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

function mysqlDateStr(date){
  return date.toISOString().split('.')[0].split('T').join(' ')
}

var Sequelize = require('sequelize')
// var sequelize = new Sequelize('database', null, null, {
//     dialect: 'sqlite',
//     storage: 'database.db',
//     // storage: ':memory:',
//     logging: false,
// })

var sequelize = new Sequelize('pmpprod', 'pmpadmin', 'PmpStart2016', {
    host:'rdssl1u0dsbhp7obuinml.mysql.rds.aliyuncs.com',
    dialect: 'mysql',
    timezone: '+8:00',
    pool: {
        max: 12,
        min: 0,
        idle: 60000
    },
    dialectOptions: {
      requestTimeout: 60000
    },
    logging: false
})

var PackTags = sequelize.define('pmp_pack_tags', {
  // id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
  full_code: {type:Sequelize.STRING,unique:true},
  tag_type: Sequelize.STRING,
  batch_id: Sequelize.INTEGER,
  supervisor_code: Sequelize.STRING,
  week_year: Sequelize.STRING,
  owner_id: Sequelize.STRING,
  product_id: Sequelize.STRING,
  brand_id: Sequelize.STRING,
  crate_id: Sequelize.STRING,
  pack_id: Sequelize.STRING,
  sold: Sequelize.BOOLEAN,
  sold_by: Sequelize.STRING,
  sold_date: Sequelize.STRING,
  scan_num: Sequelize.INTEGER,
},{underscored:true});

var PackTraces = sequelize.define('pmp_pack_traces', {
  // id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
  full_code: Sequelize.STRING,
  from_owner: Sequelize.STRING,
  to_owner: Sequelize.STRING,
},{underscored:true});

var GenCounts = sequelize.define('pmp_gen_count', {
  brand_id: Sequelize.STRING,
  weekyear: Sequelize.STRING,
  next_crate_start: Sequelize.INTEGER,
},{underscored:true});

var GenBatchs = sequelize.define('pmp_gen_batch', {
  brand_id: Sequelize.STRING,
  weekyear: Sequelize.STRING,
  crate_size: Sequelize.INTEGER,
  crate_amount: Sequelize.INTEGER,
  crate_start: Sequelize.INTEGER,
},{underscored:true});

var ProductSpecs = sequelize.define('pmp_product_spec', {
  product_name: Sequelize.STRING,
  product_retail_price: Sequelize.STRING,
},{underscored:true});

function packHash(brand_id,week,year,crate_id,pack_id){
  return ((brand_id*1117+week*year+crate_id*11+pack_id*477)%3840+256).toString(16).toUpperCase()
}

function crateHash(brand_id,week,year,crate_id){
  return ((brand_id*1117+week*year+crate_id*477)%3840+256).toString(16).toUpperCase()
}

function getWeekYear(today){
  var year = today.getYear()%100
  var week = weekOfYear(today)
  return padLeft(week,2)+padLeft(year,2)
}

function calcPack(batch_id, brand_id, crate_startnum, crate_totalnum, crate_size, today){
  brand_id=parseInt(brand_id)
  crate_startnum=parseInt(crate_startnum)
  crate_totalnum=parseInt(crate_totalnum)
  crate_size=parseInt(crate_size)

  var out = []

  var year = today.getYear()%100
  var week = weekOfYear(today)
  var weekyear = padLeft(week,2)+padLeft(year,2)

  var brand_code = padLeft(brand_id,2)

  var crate_total = parseInt(crate_totalnum)||1
  var pack_total = parseInt(crate_size)||48
  var stnum = parseInt(crate_startnum)

  for(var crate_id=stnum;crate_id<crate_total+stnum;crate_id++){
    var crateid = padLeft(crate_id,4)
    var crate_hash = crateHash(brand_id, week, year, crate_id)
    var crate_code = ['B',crate_hash,brand_code,weekyear,crateid].join('-')
    out.push({
      full_code: crate_code,
      tag_type:'B',
      batch_id: batch_id,
      supervisor_code: crate_code,
      owner_id: '1',
      product_id: 'none',
      brand_id: brand_id,
      crate_id: crate_id,
      pack_id: 0,
      week_year: weekyear,
      sold: false,
      // sold_by: '无',
      brand_name: '贝利龙',
      // scan_num: 0,
    })

    for(var pack_id=1;pack_id<=pack_total;pack_id++){
      var packid = padLeft(pack_id,2)
      var pack_hash = packHash(brand_id, week, year, crate_id, pack_id)
      var pack_code;
      pack_code = ['A',pack_hash,brand_code,weekyear,crateid,packid].join('-')
      // console.log(pack_code)
      out.push({
        full_code: pack_code,
        tag_type:'A',
        batch_id: batch_id,
        supervisor_code: crate_code,
        owner_id: '1',
        product_id: 'none',
        brand_id: brand_id,
        crate_id: crate_id,
        pack_id: pack_id,
        week_year: weekyear,
        sold: false,
        sold_by: '无',
        brand_name: '贝利龙',
        scan_num: 0,
      })
    }
  }
  return out
}

function genauto_tags(prm,today,res){
  return GenCounts.findOrCreate({
    where:{
      weekyear:getWeekYear(today),
      brand_id:prm.brand_id
    },
    defaults:{
      next_crate_start:1,
    }
  })
  .then(function(rs){
    var gen_rec = rs[0]
    return gen_rec.increment('next_crate_start',{by:parseInt(prm.crate_totalnum)})
  })
  .then(function(count){
    return GenBatchs.create({
      brand_id:prm.brand_id,
      crate_size:prm.crate_size,
      crate_amount:prm.crate_totalnum,
      crate_start:count.get('next_crate_start'),
      weekyear:count.get('weekyear'),
    })
  })
  .then(function(batch){
    var all_recs = calcPack(batch.get('id'), prm.brand_id, batch.get('crate_start'), prm.crate_totalnum, prm.crate_size, today)
    // .map(function(e){
    //   return PackTags.create(e);
    // })
    // Promise.all(all_recs)
    return PackTags.bulkCreate(all_recs)
  })
}

function show_brand_gen_batchs(brand_id){
  return GenBatchs.findAll({
    where:{
      brand_id:brand_id
    }
  })
}

function show_all_tags(){
  return PackTags.findAll().then(function(tags) {
    return Promise.resolve(tags.map(function(e){
      return e.dataValues
    }))
  })
}

function show_all_traces(){
  return PackTraces.findAll().then(function(traces) {
    return Promise.resolve(traces.map(function(e){
      return e.dataValues
    }))
  })
}

function show_tag_trace(fullcode){
  return PackTraces.findAll({where:{full_code:fullcode}}).then(function(traces) {
    return Promise.resolve(traces.map(function(e){
      return e.dataValues
    }))
  })
}

function show_my_tags(agentid){
  return PackTags.findAll({where:{
    owner_id:agentid
  }}).then(function(users) {
    return Promise.resolve(users.map(function(e){
      return e.dataValues
    }))
  })
}

function show_my_touched_tags(agentid){
  return PackTraces.findAll({where:{
    to_owner:agentid
  }}).then(function(tags) {
    return Promise.resolve(tags.map(function(e){
      return e.dataValues
    }))
  })
}

function show_pack(packcode){
  var arr = packcode.split('-')
  var tag_type = arr[0]
  if(tag_type!=='A')return Promise.reject('not pack tag')

  return PackTags.findOne({where:{full_code:packcode}})
  .then(function(tag) {
    if(tag){
      if(tag.get('sold')){
        return tag.increment('scan_num')
      }else{
        tag.set('product_name','幸运银内裤')
        return Promise.resolve(tag)
      }
    }else{
      return Promise.reject('no tag '+packcode)
    }
  })
}


function sell_pack(packcode){
  var arr = packcode.split('-')
  var tag_type = arr[0]
  if(tag_type!=='A')return Promise.reject(packcode+' not pack tag')

  return PackTags.findOne({where:{full_code:packcode}})
  .then(function(tag) {
    if(tag){
      return tag.update({
        sold:true
      })
    }else{
      return Promise.reject('pack '+packcode+' not found')
    }
  })
}

function pack_sold_by(packcode,who){
  var arr = packcode.split('-')
  var tag_type = arr[0]
  if(tag_type!=='A')return Promise.reject('not pack tag')

  return PackTags.findOne({
    where:{
      full_code:packcode
    }
  })
  .then(function(tag) {
    if(tag){
      if(tag.get('sold'))return Promise.reject(packcode+' already sold')
      return tag.update({
        sold:true,
        sold_by:who,
        sold_date:mysqlDateStr(new Date()),
      })
    }else{
      return Promise.reject('no tag '+packcode)
    }
  })
}

function pack_takeover(packcode,newowner){
  var arr = packcode.split('-')
  var tag_type = arr[0]
  if(tag_type!=='A')return Promise.reject(packcode+' not pack tag')

  return PackTags.findOne({
    where:{full_code:packcode}
  })
  .then(function(tag) {
    if(!tag)return Promise.reject('pack '+packcode+' not found')
    var full_code = tag.get('full_code')
    var from_owner = tag.get('owner_id')
    var to_owner = newowner

    return tag.update({
      owner_id:newowner
    }).then(function(tg){
      return PackTraces.create({
        full_code:full_code,
        from_owner:from_owner,
        to_owner:to_owner
      }).then(function(){
        return Promise.resolve(tg)
      })
    })
  })
}

function crate_takeover(cratecode,newowner){
  var arr = cratecode.split('-')
  var tag_type = arr[0]
  if(tag_type!=='B')return Promise.reject('not crate tag')

  // var brand_id = parseInt(arr[2])
  // var week_year = arr[3]
  // var crate_id = parseInt(arr[4])

  return PackTags.findOne({
    where:{
      full_code:cratecode
    }
  }).then(function(cratetag){
    if(!cratetag)return Promise.reject('no crate '+cratecode)
    var crate_owner = cratetag.get('owner_id')

    return PackTags.findAll({
      where:{
        supervisor_code:cratecode,
        owner_id:crate_owner,
      }
    }).then(function(tags){
      if(!tags.length)return Promise.reject('no packs under '+cratecode)
      var traces = tags.map(function(packtag){
        return {
          from_owner:packtag.get('owner_id'),
          to_owner:newowner,
          full_code:packtag.get('full_code')
        }
      })

      var all_prom = tags.map(function(packtag){
        packtag.update({
          owner_id:newowner
        })
        return packtag
      })
      return Promise.all(all_prom).then(function(out){

          var trace_prom = traces.map(function(trace){
            return PackTraces.create(trace)
          })
          return Promise.all(trace_prom).then(function(){
            return Promise.resolve(out)
          })
      })

    })
  })
}

function crate_product(cratecode,productid){
  var arr = cratecode.split('-')
  var tag_type = arr[0]
  if(tag_type!=='B')return Promise.reject(crate+' not crate tag')

  // var brand_id = parseInt(arr[2])
  // var week_year = arr[3]
  // var crate_id = parseInt(arr[4])

  PackTags.findAll({
    where:{
      supervisor_code:cratecode,
      // brand_id:brand_id,
      // week_year:week_year,
      // crate_id:crate_id
    }
  })
  .then(function(tags) {
    if(tags.length){
      var prom_all = tags.map(function(tag){
        return tag.update({
          product_id:productid
        })
      })
      return Promise.all(prom_all)
    }else{
      return Promise.reject('crate '+cratecode+' is empty')
    }
  })
}

function clearTestData(){
  return sequelize.sync({force: true})
}
function initTestData(){
  clearTestData()
  .then(function(){
    return genauto_tags({brand_id:'88',crate_totalnum:'7',crate_size:'4'},new Date('2016-11-21'))
  })
  .then(function(){
    return crate_takeover('B-55C-88-4716-004','lin')
  })
  .then(function(tag){
    return pack_takeover('A-EF1-88-4716-004-01','wang')
  })
  .then(function(tag){
    return pack_takeover('A-EF1-88-4716-004-01','bei')
  })
  .then(function(tag){
    return crate_takeover('B-55C-88-4716-004','sun')
  })
  .then(function(tag){
    return pack_sold_by('A-EF1-88-4716-004-01','xxxx')
  })
  .then(function(tag){
    return show_pack('A-EF1-88-4716-004-01')
  })
  .then(function(tag){
    return show_pack('A-EF1-88-4716-004-01')
  })
}


function run(){
  initTestData()
  var express = require('express')
  var bodyParser = require('body-parser');
  var app = express()
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  //auto generate tags
  app.all('/genauto/:brand_id/:crate_totalnum/:crate_size', function (req, res) {
    genauto_tags(req.params,new Date())
    .then(function(tags) {
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    });
  })

  //view all tags in db
  app.all('/viewall', function (req, res) {
    show_all_tags()
    .then(function(tags){
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //view all tags in db
  app.all('/viewtraces', function (req, res) {
    show_all_traces()
    .then(function(tags){
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //view my touched tags
  app.all('/viewtouched/:agentid', function (req, res) {
    show_my_touched_tags(req.params.agentid)
    .then(function(tags){
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //view my tags
  app.all('/viewmine/:agentid', function (req, res) {
    show_my_tags(req.params.agentid)
    .then(function(tags){
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //view a tag
  app.all('/viewpack/:fullcode', function (req, res) {
    show_pack(req.params.fullcode)
    .then(function(tag){
      res.send(tag)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  // trace a tag
  app.all('/tagtrace/:fullcode', function (req, res) {
    show_tag_trace(req.params.fullcode)
    .then(function(tag){
      res.send(tag)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //sell a tag
  app.all('/sellpack/:fullcode', function (req, res) {
    sell_pack(req.params.fullcode)
    .then(function(tag){
      res.send(tag)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //sell a tag
  app.all('/packsoldby/:fullcode/:who', function (req, res) {
    var p = req.params
    pack_sold_by(p.fullcode, p.who)
    .then(function(tag){
      res.send(tag)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //takeover a tag
  app.all('/takepack/:fullcode/:agentid', function (req, res) {
    var p = req.params
    pack_takeover(p.fullcode, p.agentid)
    .then(function(tag){
      res.send(tag)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //takeover a crate
  app.all('/takecrate/:fullcode/:agentid', function (req, res) {
    var p = req.params
    crate_takeover(p.fullcode, p.agentid)
    .then(function(tags){
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    })
  })

  //link tag with product #####
  app.all('/crateproduct/:fullcode/:productid', function (req, res) {
    var p = req.params
    crate_product(p.fullcode, p.productid)
    .then(function(tags){
      res.send(tags)
    })
    .catch(function(err){
      res.send(err)
    })
  })
  app.use(express.static('public'));
  app.listen(80)
}
// g.run = run
exports.db = {
  PackTags:PackTags,
  PackTraces:PackTraces,
  GenCounts:GenCounts,
  GenBatchs:GenBatchs,
}
exports.run = run
exports.genauto_tags = genauto_tags
exports.clearTestData = clearTestData
exports.crate_takeover = crate_takeover
exports.pack_takeover = pack_takeover
exports.pack_sold_by = pack_sold_by
exports.show_pack = show_pack
exports.show_all_tags = show_all_tags
exports.show_all_traces = show_all_traces
exports.show_tag_trace = show_tag_trace
exports.sell_pack = sell_pack
exports.show_my_touched_tags = show_my_touched_tags
exports.show_brand_gen_batchs = show_brand_gen_batchs
