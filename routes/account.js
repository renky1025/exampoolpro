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

var School = db.model( 'school' );
var Course = db.model( 'subject' );


var setAttributes = function (data){
    var returnval = {account:{},options:{}};
    if(!data) return ;
    
    returnval.account = {
              username : data.username,
              email : data.email,
              phone : data.phone,
              realname : data.realname,
              title : data.title
    };
    if(!data._id){
      returnval.account.created_date = Date.now();
    }
    returnval.account.updated_date = Date.now();
    if(data.password){
      returnval.account.password = sha1(data.password);
    }
    switch(data.optionsRadios){
      case "student":
        returnval.account.isstudent = true;
        returnval.account.isteacher = false;
        returnval.account.isdirector = false;
        returnval.account.isadmin = false;
        returnval.options={
              "grade":data.student_grade,
              "class":data.student_class,
              "student_number":data.student_number,
              "school":data.student_school,
              "schoolid":data.student_schoolid
        };    
        
        break;
      case "teacher":
        returnval.account.isstudent = false;
        returnval.account.isteacher = true;
        returnval.account.isdirector = false;
        returnval.account.isadmin = false;
        returnval.options={
              "grade":data.teacher_grade,
              "class":data.teacher_class,
              "courseid":data.teacher_courseid,
              "course":data.teacher_course,
              "school":data.teacher_school,
              "schoolid":data.teacher_schoolid
        }; 

        break;
      case "director":
        returnval.account.isstudent = false;
        returnval.account.isteacher = false;
        returnval.account.isdirector = true;
        returnval.account.isadmin = false;
        break;
      case "admin":
        returnval.account.isstudent = false;
        returnval.account.isteacher = false;
        returnval.account.isdirector = false;
        returnval.account.isadmin = true;
        break;
      default:
        returnval.account.isstudent = true;
        returnval.account.isteacher = false;
        returnval.account.isdirector = false;
        returnval.account.isadmin = false;
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
  var promisearr =[];
  var promise1 = new Promise(function (resolve, reject){
        School.find({}).exec(function (err, data){
          resolve(data);
          reject(err);
        });
    });
    promisearr.push(promise1);
  var promise2 = new Promise(function (resolve, reject){
        Course.find({}).exec(function (err, data){
          resolve(data);
          reject(err);
        });
    });
    promisearr.push(promise2);
    Promise.all(promisearr).then( function (data){
      
      res.render('createaccount.ejs', { title: '21世纪题库',results:null, school: data[0], course:data[1]});
      
    } );
  
});

router.post('/create', function(req, res, next) {
  var POST= req.body;

  if(POST.username && POST.email && POST.phone && POST.realname && POST.password){
    var savedata = setAttributes(POST);
    if(POST._id){
      savedata.options.accountid= POST._id;
      Account.update({_id:POST._id}, savedata.account, function(err,doc){
        if(!err){
          if(savedata.account.isstudent){
            Student.find({accountid:POST._id}, function(err, docs){
                if(docs.length){
                  Student.update(savedata.options,function(err, records){
                     console.log(records);
                  });
                }
            });
          }
          if(savedata.account.isteacher){
            Teacher.find({accountid:POST._id}, function(err, docs){
                if(docs.length){
                  Teacher.update(savedata.options,function(err, records){
                    console.log(records);
                  });
                }
            });
          }
        }
      });
     res.redirect('/account/'); 
    }
    var instance = new Account(savedata.account);
    // Create missing associations
    Account.find({ username: POST.username }, function (err, docs) {
      if (!docs.length) {
        instance.save(function (err, doc) {
              if(!err){
                //doc.id
                savedata.options.accountid= doc.id;
                
                if(savedata.account.isstudent){
                  var newstudent = new Student(savedata.options);
                  Student.find({accountid:doc.id}, function(err, docs){
                      if(!docs.length){
                        newstudent.save(function(err, records){
                           console.log(records);
                        });
                      }
                  });
                }
                if(savedata.account.isteacher){
                  var newteacher = new Teacher(savedata.options);
                  Teacher.find({accountid:doc.id}, function(err, docs){
                      if(!docs.length){
                        newteacher.save(function(err, records){
                          console.log(records);
                        });
                      }
                  });
                }
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
