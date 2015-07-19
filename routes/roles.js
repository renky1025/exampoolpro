var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var uri = 'mongodb://localhost/exampool';
var db = mongoose.createConnection(uri, { server: { poolSize: 5 }});
db.on('error', console.error.bind(console, 'connection error:')); 
var Roles = db.model( 'roles' );

/* GET users listing. */
router.get('/', function(req, res, next) {
  Roles.find({}).limit(20).exec(function (err, data){
          if (err){
              console.log('error occured');
              return;
          }
          var results = data;
          res.render('rolelist.ejs', { title: '21世纪题库' ,results: results});
  });
});

router.get('/add', function(req, res, next) {
  res.render('createrole.ejs', { title: '21世纪题库',results:null});
});

router.post('/create', function(req, res, next) {
  var POST= req.body;
  if(POST.name && POST.aliasname){
    if(POST._id){
      Roles.update({_id:POST._id}, {name: POST.name ,alias:POST.aliasname }, function(err,doc){
        if(err){
          
        }
      });
     res.redirect('/roles/'); 
    }
    var instance = new Roles();
    // Create missing associations
    Roles.find({ name: POST.name }, function (err, docs) {
      if (!docs.length) {
        instance.name = POST.name;
        instance.alias = POST.aliasname;
        instance.save(function (err) {
              if(!err){
                res.redirect('/roles/');
              }else{
                res.send(err);
              }
            });    
      }
    });
  }
});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  if(id){
    Roles.findOne({ _id: id }).exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.render('editrole.ejs', { title: '21世纪题库',role:doc, results:null });
    });
  }else{
    res.send('找不到 这个角色！');
  }
  
  //
  
});

router.get('/remove/:id', function(req, res, next) {
  var id = req.params.id;
  if(id){
    Roles.findOne({ _id: id }).remove().exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.redirect('/roles/');
    });
  }else{
    res.send('找不到 这个角色！');
  }
});

module.exports = router;
