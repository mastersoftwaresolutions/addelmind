
    var options = {iframe: {url: 'upload.php'}}
    // 'zone' is an ID but you can also give a DOM node:
    var zone = new FileDrop('zone', options);

    // Do something when a user chooses or drops a file:
    zone.event('send', function (files) {
      readURL(files[0]);
      // FileList might contain multiple items.
      files.each(function (file) {
        // Send the file:
        file.sendTo('upload.php');
      });
    });

    function readURL(files) {
        if (files) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('#imageMap').attr('src', e.target.result);
                adjustBigImage(e.target.result);
                $(".file-upload").hide();
                $(".chosse").slideDown(400);
            }
            reader.readAsDataURL(files.nativeFile);
        }
    }
     $("#another-one").change(function(){
         readURL2(this);
     });

    function readURL2(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
            	adjustBigImage(e.target.result);
                //$('#imageMap').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

	function adjustBigImage(Img) {
      var imgobj = new Image();
       imgobj.onload = function(){
       	  var actualHeight = imgobj.height,
           actualWidth = imgobj.width,
	       imgWidth = 1140,
	       imgHeight = 800;
	       var canvas = $('<canvas width="'+ imgWidth +'" height="'+ actualHeight +'"/>');
           var ctx = canvas.get(0).getContext('2d');
           if(actualWidth > imgWidth){              
              ctx.drawImage(imgobj,0,0,imgWidth, actualHeight,0,0,imgWidth,actualHeight);  
              var base64ImageData = canvas.get(0).toDataURL();          
              $('#imageMap').attr('src', base64ImageData); 
           }else {
           	  $('#imageMap').attr('src', Img); 
           } 

       }
      imgobj.src = Img;
	}


	$("#choose-this").click(function() {

	     $(".category").slideDown(400);
	     $(".chosse").hide();
	});

	$("#go-back").click(function() {
		$(".msg").html(' ');
	     $(".category").slideUp(400,function(){
	     	$(this).hide();
	     });
	     $(".chosse").slideDown(400);
	});

	$("#continue").click(function() {
		 $("#imageMap").css('cursor','pointer');
		var checked_num = $('input[ng-model="x"]:checked').length;
		if (checked_num===0) {
		    $(".msg").html("<p class='error'><font>You must select at least one category.</font><i class='fa fa-times'></i><p>");
            $(".error").fadeIn(400);
            $(".error").slideDown(400);
            $("#tag-photo").val(0);
		}
		else {
		    $(".msg").html(' ');
		    $("#tag-photo").val(1);
			$(".category").slideUp(400,function()  {
	    	 	$(this).hide();
	        });
	        $(".procces").slideDown(400);
	        $("#continue-pub , #go-back-cat").fadeIn(400);
		}
	});

	$( ".msg" ).on( "click", ".fa-times", function() {
		$(".error").fadeOut(400,function()  {
		    $(this).hide();
		 });
	});

	$("#continue-pub").click(function()  {
		$(".procces").hide();
		$("#mapper").popover("hide");
		$("#mapper").hide();
        var total = 0;
        $( ".tag_price" ).each(function( index ) {
            var num = parseInt($(this).text().match(/\d+/)[0], 10);
            total += num;
        });
        $("#full-price").val(total)

        $(".full-tag").slideDown(400,function(){
            $("#continue-pub , #go-back-cat").fadeOut(200);
        });
        $('#full-price').formatCurrency();
	});

	$("#go-back-full").click(function()  {

		$(".full-tag").slideUp(400,function()  {
	    	 $('.procces').slideDown(300);
	    	 $("#continue-pub , #go-back-cat").fadeIn(200);
	     });
	});

	$("#go-back-cat").click(function()  {
		$("#imageMap").css('cursor','default');
		$(".procces").slideUp(200,function()  {
	    	 $('.category').slideDown(300);
	    	 $("#continue-pub , #go-back-cat").fadeOut(200);
	     });
	});

	$(document.body).on("blur",'#full-price',function(){

		$('#full-price').formatCurrency();

	});


