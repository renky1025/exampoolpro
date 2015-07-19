var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var uri = 'mongodb://localhost/exampool';
var db = mongoose.createConnection(uri, { server: { poolSize: 5 }});
db.on('error', console.error.bind(console, 'connection error:')); 
var Subject = db.model( 'subject' );
var Knowledge = db.model( 'knowledge' );
var Question = db.model( 'question' );

/* GET home page. */
/**tool functions**/
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

router.get('/', function(req, res, next) {
	var filterData = function(data){
		var obj = {
			'middle':[],
			'hightmiddle':[]
		};
		data.forEach(function (item){
			switch(item.setion){
				case "初中":
					if(!obj.middle.includes(item)){
						obj.middle.push(item);
					}
					
				break;
				case "高中":
					if(!obj.hightmiddle.includes(item)){
						obj.hightmiddle.push(item);
					}
				break;
			}
		});
		return obj;
	};
	//find().skip(from).limit(to)

    Subject.find({}).limit(20).exec(function (err, data){
            if (err){
                console.log('error occured');
                return;
            }
            var results = filterData(data);
            res.render('index.ejs', { title: '21世纪题库' ,results: results});
    });

});

router.get('/course/:courseId', function(req, res) {
  var queryId = req.params.courseId;

  var querydata = {"subjectid":parseInt(queryId),"parentid":parseInt(0)};
  console.log(querydata);
  Knowledge.find(querydata , function (err, items){
        if (err){
            console.log('error occured');
            console.log(err);
            return;
        }
  		var results = [];
  		items.forEach(function (item){
  			console.log(item);
  			var data = {
  				"haschildren":item.haschildren,
				"id":item.kid,
				"name":item.knowledge,
				"parentid":0,
				"courseid":item.subjectid
  			};
  			results.push(data);
  		});
  		res.json(results);
  	});
 
});

router.get("/course/:courseId/knowledge/:kId", function (req, res){
  var queryId = req.params.courseId;
  var kId = req.params.kId;
  Knowledge.find({"subjectid":parseInt(queryId),"parentid":parseInt(kId)},function (err, items){
        if (err){
            console.log('error occured');
            console.log(err);
            return;
        }
  		var results = [];
  		items.forEach(function (item){
  			var data = {
  				"haschildren":item.haschildren,
				"id":item.kid,
				"name":item.knowledge,
				"parentid":kId,
				"courseid":item.subjectid
  			};
  			results.push(data);
  		});
  		res.json(results);
  	});
});

router.get("/question/:sid/:kid/:page", function (req, res){
  var sid = req.params.sid;
  var kid = req.params.kid;
  var perPage = 20, page = Math.max(0, req.params.page);

  console.log({"subjectid":parseInt(sid),"kid":kid});
  Question.find({"subjectid":parseInt(sid),"kid":kid}).limit(perPage).skip(perPage * page).exec(function (err, items){
        if (err){
            console.log('error occured');
            console.log(err);
            return;
        }
  		res.json(items);
  	});
});



module.exports = router;
