$(document).ready(function(){
	$("input[name=optionsRadios]").on("click", function(e){
		var val = $(this).val();
		$(".otherfields").addClass("hidden");
		$("#otherfieldsfor"+val).removeClass("hidden");
		
	});
	
	$("select.form-control").on("change", function(){
		if($(this).val() == "other"){
			$(this).next().removeClass("hidden");
		}else{
			$(this).next().addClass("hidden");
		}
		
	});
});
