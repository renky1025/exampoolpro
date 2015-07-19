var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var mongoose = require( 'mongoose' );
var uri = 'mongodb://localhost/exampool';
var db = mongoose.createConnection(uri, { server: { poolSize: 5 }});
db.on('error', console.error.bind(console, 'connection error:')); 
var Account = db.model( 'account' );
var Student = db.model( 'student' );
var Teacher = db.model( 'teacher' );

var setAttributes = function (data){
    var returnval = {};
    if(!data) return ;
    
    returnval.username = data.username;
    returnval.email = data.email;
    returnval.phone = data.phone;
    returnval.realname = data.realname;
    returnval.title = data.title;
    if(!data._id){
      returnval.created_date = Date.now();
    }
    returnval.updated_date = Date.now();
    if(data.password){
      returnval.password = sha1(data.password);
    }
    switch(data.optionsRadios){
      case "student":
        returnval.isstudent = true;
        returnval.isteacher = false;
        returnval.isdirector = false;
        returnval.isadmin = false;
        break;
      case "teacher":
        returnval.isstudent = false;
        returnval.isteacher = true;
        returnval.isdirector = false;
        returnval.isadmin = false;
        break;
      case "director":
        returnval.isstudent = false;
        returnval.isteacher = false;
        returnval.isdirector = true;
        returnval.isadmin = false;
        break;
      case "admin":
        returnval.isstudent = false;
        returnval.isteacher = false;
        returnval.isdirector = false;
        returnval.isadmin = true;
        break;
      default:
        returnval.isstudent = true;
        returnval.isteacher = false;
        returnval.isdirector = false;
        returnval.isadmin = false;
        break;
    }
    return returnval;
};
/* GET users listing. */
router.get('/', function(req, res, next) {
  Account.find({}).limit(20).exec(function (err, data){
          if (err){
              console.log('error occured');
              return;
          }
          var results = data;
          res.render('accountlist.ejs', { title: '21世纪题库' ,results: results});
  });
});

router.get('/add', function(req, res, next) {
  res.render('createaccount.ejs', { title: '21世纪题库',results:null});
});

router.post('/create', function(req, res, next) {
  var POST= req.body;
 
  if(POST.username && POST.email && POST.phone && POST.realname && POST.password){
    var savedata = setAttributes(POST);
    if(POST._id){
      Account.update({_id:POST._id}, savedata, function(err,doc){
        if(err){
          
        }
      });
     res.redirect('/account/'); 
    }
    var instance = new Account(savedata);
    // Create missing associations
    Account.find({ username: POST.username }, function (err, docs) {
      if (!docs.length) {
        instance.save(function (err) {
              if(!err){
                res.redirect('/account/');
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
    Account.findOne({ _id: id }).exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.render('editaccount.ejs', { title: '21世纪题库', account:doc, results:null });
    });
  }else{
    res.send('找不到 account');
  }
  
  //
  
});

router.get('/remove/:id', function(req, res, next) {
  var id = req.params.id;
  if(id){
    Account.findOne({ _id: id }).remove().exec(function(err, doc){
      if(err){
        res.send(err);
      }
      res.redirect('/account/');
    });
  }else{
    res.send('找不到 这个account哦！');
  }
});

module.exports = router;
