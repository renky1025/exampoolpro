var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var uri = 'mongodb://localhost/exampool';
var db = mongoose.createConnection(uri, { server: { poolSize: 5 }});
db.on('error', console.error.bind(console, 'connection error:')); 
var Course = db.model( 'subject' );

/* GET users listing. */
router.get('/', function(req, res, next) {
  var page = req.query.page || 1;
  var limit = 10, offset = (page-1)*limit;
  Course.count({}, function(err, c){
         var total = c;
        Course.find({}).skip(offset).limit(limit).exec(function (err, data){
                if (err){
                    console.log('error occured');
                    return;
                }
                var results = data;
                var count = Math.ceil(total/limit);
                console.log({pageCount:count,currentPage:page});
                res.render('courselist.ejs', { title: '21世纪题库' ,results: results, pageCount:count,currentPage:page });
        });
    });

});

router.get('/add', function(req, res, next) {
  res.render('createcourse.ejs', { title: '21世纪题库',results:null});
});

router.post('/create', function(req, res, next) {
  var POST= req.body;
  if(POST.course && POST.setion){
    if(POST._id){
      Course.update({_id:POST._id}, {name: POST.course ,setion:POST.setion }, function(err,doc){
        if(err){
          
        }
      });
     res.redirect('/courses/'); 
    }
    var instance = new Course();
    // Create missing associations
    Course.find({ course: POST.course,setion:POST.setion }, function (err, docs) {
      if (!docs.length) {
        instance.course = POST.course;
        instance.setion = POST.setion;
        instance.save(function (err) {
              if(!err){
                res.redirect('/courses/');
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
    Course.findOne({ _id: id }).exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.render('editcourse.ejs', { title: '21世纪题库', course:doc, results:null });
    });
  }else{
    res.send('找不到 这个xuexiao！');
  }
  
  //
  
});

router.get('/remove/:id', function(req, res, next) {
  var id = req.params.id;
  if(id){
    Course.findOne({ _id: id }).remove().exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.redirect('/courses/');
    });
  }else{
    res.send('找不到 这个学习哦！');
  }
});

module.exports = router;
