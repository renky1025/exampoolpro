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
			/*
				currentPage: 0
				items: Array[0]
				pageCount: 0
			*/	
			if(!questions.items.length) return ;
			questions.items.forEach(function (question){
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
			/*
			if(questions.pageCount){
				var paginationhtml = '<nav>';
			        paginationhtml += '<ul class="pagination">';
			        paginationhtml += '<li><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a></li>';
			        for (var j=1;j<questions.pageCount;j++){
						var act = '', act2 = '';
						if(j == questions.currentPage){
							act = ' class="active" ';
							act2 = ' <span class="sr-only">(current)</span> ';
						}
						paginationhtml += '<li'+act+'><a href="#">'+j+' '+act2+'</a></li>';
					}
					paginationhtml += '<li><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>';
			     	paginationhtml += '</ul>';
			   		paginationhtml += '</nav>';
					html += paginationhtml;
			}
			*/
			
			if(page){
				$("#collapseTwo .panel-body").append(html);
			}else{
				$("#collapseTwo .panel-body").html(html);
			}
			
			$(window).off("scroll").on("scroll", function (e){
				var scrollTop = $(document).scrollTop();
				var height = $("#collapseTwo .panel-body").height();
				if((height - scrollTop)< 250){
					queryquestions(courseid, kid, page++);
				}
			});
			
		});

	};



});