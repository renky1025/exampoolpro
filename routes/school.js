var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var uri = 'mongodb://localhost/exampool';
var db = mongoose.createConnection(uri, { server: { poolSize: 5 }});
db.on('error', console.error.bind(console, 'connection error:')); 
var School = db.model( 'school' );

/* GET users listing. */
router.get('/', function(req, res, next) {
  School.find({}).limit(20).exec(function (err, data){
          if (err){
              console.log('error occured');
              return;
          }
          var results = data;
          res.render('schoollist.ejs', { title: '21世纪题库' ,results: results});
  });
});

router.get('/add', function(req, res, next) {
  res.render('createschool.ejs', { title: '21世纪题库',results:null});
});

router.post('/create', function(req, res, next) {
  var POST= req.body;
  if(POST.name && POST.region){
    if(POST._id){
      School.update({_id:POST._id}, {name: POST.name ,region:POST.region }, function(err,doc){
        if(err){
          
        }
      });
     res.redirect('/school/'); 
    }
    var instance = new School();
    // Create missing associations
    School.find({ name: POST.name }, function (err, docs) {
      if (!docs.length) {
        instance.name = POST.name;
        instance.region = POST.region;
        instance.save(function (err) {
              if(!err){
                res.redirect('/school/');
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
    School.findOne({ _id: id }).exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.render('editschool.ejs', { title: '21世纪题库', school:doc, results:null });
    });
  }else{
    res.send('找不到 这个xuexiao！');
  }
  
  //
  
});

router.get('/remove/:id', function(req, res, next) {
  var id = req.params.id;
  if(id){
    School.findOne({ _id: id }).remove().exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.redirect('/school/');
    });
  }else{
    res.send('找不到 这个学习哦！');
  }
});

module.exports = router;
