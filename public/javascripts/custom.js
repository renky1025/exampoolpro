$(document).ready(function(){
	String.prototype.replaceAll = function(s1,s2){
　　		return this.replace(new RegExp(s1,"gm"),s2);
　　}	
	$(".sidebar-nav li a").on("click", function(e){
		var id = $(this).attr("data-id");
		if(!id) return ;
		queryknowledge(id);
		return false;
	});
	var queryknowledge = function(id){
		$.get("/course/"+id, function (result){
			var html = '<ul class="nav" id="knowledge-menu">';
			var html2 ="";
			result.forEach(function (item){
	            if(item.haschildren){
	            	html2 = '<ul class="nav nav-second-level"></ul>'
	            }
				html += '<li><a href="#" data-courseid="'+id+'" data-id="'+item.id+'">'+item.name+
	                  '<span class="fa arrow"></span></a>'+html2+'</li>';

			});
			html += "</ul>";
			$("#collapseOne .panel-body").html(html);
			$("#knowledge-menu li a").off("click").on("click", function(e){
				var id = $(this).attr("data-id");
				var courseid = $(this).attr("data-courseid");
				if(!id || !courseid) return ;
				var container = $(this).parent();
				if(container.find("ul.nav-second-level li").length==0){
					querysubknowledge(id,courseid, container);
				}
				queryquestions(courseid, id, 0);
				return false;
			});
			$('#knowledge-menu').metisMenu();
		});
	};
	var querysubknowledge = function(id,courseid, container){
		$.get("/course/"+courseid+"/knowledge/"+id, function (result){
			var html ="", html2='';
			result.forEach(function (item){
	            if(item.haschildren){
	            	html2 = '<ul class="nav nav-second-level"></ul>'
	            }
				html += '<li><a href="#" data-courseid="'+id+'" data-id="'+item.id+'">'+item.name+
	                  '</a>'+html2+'</li>';

			});
			container.find("ul.nav-second-level").eq(0).append(html);
			$("#knowledge-menu li a").off("click").on("click", function(e){
				var id = $(this).attr("data-id");
				var courseid = $(this).attr("data-courseid");
				if(!id || !courseid) return ;
				var container = $(this).parent();
				if(container.find("ul.nav-second-level li").length==0){
					querysubknowledge(id,courseid, container);
				}
				queryquestions(courseid, id, 0);
				return false;
			});
			$('#knowledge-menu').metisMenu();
		});
	};

	var queryquestions = function(courseid, kid, page){
	 	page = page||0;
		$.get("/question/"+courseid+"/"+kid+"/"+page, function (questions){
			var html = '';
			var i = 1;
			questions.forEach(function (question){
				html +='<p><b>NO '+i+'</b>'
				html +='<p>'+question.questiontype+'</p>';
				html +='<p>'+question.source+'</p>';
				html +=question.question.replaceAll('src="images/', 'src="public/images/')
				html +=question.answer.replaceAll('src="images/', 'src="public/images/')
				html +='<p>难度：'+question.difficult+'</p>';
				html +='<p>试题类型：'+question.qtype+'</p>';
				html +='</p>';
				i++;
			});
			if(page){
				$("#collapseTwo .panel-body").append(html);
			}else{
				$("#collapseTwo .panel-body").html(html);
			}
			
		});

	};



});