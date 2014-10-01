$(window).ready(function() {
    $("#tag-photo").val(0);
    var mouseX,mouseY,windowWidth,windowHeight;
    var  popupLeft,popupTop;
    $(document).mousemove(function(e){
           mouseX = e.pageX;
           mouseY = e.pageY;
           //To Get the relative position
           if( this.offsetLeft !=undefined)
             mouseX = e.pageX - this.offsetLeft;
           if( this.offsetTop != undefined)
             mouseY = e.pageY; - this.offsetTop;
           if(mouseX < 0)
                mouseX =0;
           if(mouseY < 0)
               mouseY = 0;
           windowWidth  = $('#imageMap').width();
           windowHeight = $('#imageMap').height();
    });

    $("#imageMap").click(function(e){
        var tag_photo = $("#tag-photo").val();
        if(tag_photo == 1)  {
            var popupWidth  = $('#mapper').outerWidth();
            var popupHeight =  $('#mapper').outerHeight();

            if(mouseX + popupWidth > windowWidth)
              popupLeft = mouseX - popupWidth + 16;
            else
              popupLeft = mouseX;

            if(mouseY + popupHeight > windowHeight)
              popupTop = mouseY-popupHeight;
            else
              popupTop = mouseY;
            if(popupLeft < 0)
               popupLeft = 0;
            if(popupTop < 0)
               popupTop = 0;

            $('#mapper').css("width","32px")
             .css("height","32px")
             .show();
            $('#mapper').offset({top:popupTop - 10 ,left:popupLeft - 10});

            $("#mapper").popover("show");
            $(".procces").slideUp(300 , function(){ });


            // Tagged Image crop
            var imgSrc = $(this).attr('src');
            var offset = $(this).offset();
            var left = e.clientX - offset.left;
            var top  = e.clientY - offset.top;
            top = Math.round(top);
            left = Math.round(left);
            if(left < 0)
               left = 0;
            if(top < 0)
               top = 0;
            id = null;
            console.log("asaf", left,top);

            if(left > 200 && top > 150 ) {
              cropImage(left-150, top-150, imgSrc, id);
            }else {
              console.log("clipWidth");
              cropImage(left-20, top-20, imgSrc, id);
            }


        }
    });

        // Popover

        $("#mapper").popover({
              placement : 'bottom',
              html: 'true',
              content:function(e){
                $length = $("#planetmap").find(".popover").length;
                if($length > 0){
                  $("#planetmap").find(".popover").remove();
                }
                return '<div id="popOverBox"><div class="form-group"><label>Article Title</label><input class="form-control title" type="text" id="title" placeholder="Enter Article Title"></div><div class="form-group"></div><div class="form-group price"><label>Price</label><input type="text" class="form-control" id="pricet"  placeholder="Enter Price"></div><div class="form-group"><label>Description</label><textarea rows="1" id="desc" class="form-control"></textarea></div><div class="form-group"><input type="button" id="add-title" class="btn btn-default" value="Add Article"></div></div>';
              }
        }).parent().delegate('input#pricet', 'blur', function() {
              $('#pricet').formatCurrency();
        }).parent().delegate('input#add-title', 'click', function() {
                var title = $("#title").val();
                var desc = $("#desc").val();
                var price = $("#pricet").val();
                taggedImg = $("#tagImg").attr('src');
                var position = $('#mapper').position();
                var pos_x = position.left;
                var pos_y = position.top;
                var pos_width = $('#mapper').width();
                var pos_height = $('#mapper').height();

                var count = $("#planetmap").children().length;
                uniqueClass = count + 1;
  
                validatePrice = price.replace('$','');
                console.log(parseInt("validatePrice"), validatePrice);
               
               if(title != ""){
                 
               }else {
                $("#title").attr('style', "border-radius: 5px; border:#FF0000 2px solid;background-color: #FFFFD5;");
                 return true;
               }

               if(parseInt(validatePrice)){
                  $('#pricet').formatCurrency();
                }else{
                  $("#pricet").attr('style', "border-radius: 5px; border:#FF0000 2px solid;background-color: #FFFFD5;");
                  return true;
                }


                $('#planetmap').append('<div class="tagged" rel="popover" id="'+uniqueClass+'" style="width:'+pos_width+'px;height:'+
                    pos_height+'px;left:'+pos_x+'px;top:'+pos_y+'px;" ><div class="tagged_box" style="width:'+pos_width+'px;height:'+
                    pos_height+'px;" ></div><div class="tagged-cont"><div class="tagged_title" style="top:'+(pos_height - 8)+';display:block;" ><span>Title: </span><p class="tag_title">'+
                     title+'</p></div><div class="tagged_price" style="top:'+(pos_height+3)+'px;" ><span>Price: </span><p class="tag_price">'+
                     price+'</p></div><div class="tagged_dec" style="top:'+(pos_height+28)+'px;" ><span>Description: </span><p class="tag_dec">'+
                     desc+'</p></div><div class="tagged_img"><img id="tg" src="'+taggedImg+'"/></div></div></div>');
               
                 $( ".tagged" ).draggable({
                    containment:[$("#imageMap").offset().left,$("#imageMap").offset().top , $("#imageMap").offset().left + $("#imageMap").width() - $(this).find(".tagged_box").width(), $("#imageMap").offset().top + $("#imageMap").height() - $(this).find(".tagged_box").height()],
                    drag: function( event, ui ) {
                      // console.log("event", this);
                    },
                    stop: function (event, ui) {
                      var id = $(this).attr('id');
                      var Stoppos = $(this).position();
                      var imgSrc = $("#imageMap").attr('src');
                      var top = Stoppos.top - 240;
                      var left = Stoppos.left - 240;
                      cropImage(top, left, imgSrc, id);
                    }
                 });
                // $(document.body).on("click",'.tagged',function(){
                //     var id = $(this).attr('id');
                //     var img_scope_top = $("#imageMap").offset().top + $("#imageMap").height() - $(this).find(".tagged_box").height();
                //     var img_scope_left = $("#imageMap").offset().left + $("#imageMap").width() - $(this).find(".tagged_box").width();

                //      $(this).draggable({ containment:[$("#imageMap").offset().left,$("#imageMap").offset().top,img_scope_left,img_scope_top]  });
                //      $(this).on( "dragstop", function( event, ui ) {
                //       alert(1);
                //         var Stoppos = $(this).position();
                //         var imgSrc = $("#imageMap").attr('src');
                //         var top = Stoppos.top - 240;
                //         var left = Stoppos.left - 240;
                //         cropImage(top, left, imgSrc, id);

                //      });

                // });


                $("#mapper, .tagged-cont").hide();
                $("#mapper").popover("hide");
                var y = $("#imgy").val();
                var x = $("#imgx").val();
                var imgsrc = $("#imageMap").attr("src");
                var pos = {'top':y,'left': x ,'width':'200' , 'height':'200' , 'imgSrc': imgsrc};
                $("#tagImg").attr('src',' ');

              /* Popover edit code here. */
              $('[rel=popover]').popover({
                  html:true,
                  placement:'bottom',
                  content:function(e){
                    $length = $("#mapper").next(".popover").length;
                    if($length > 0){
                      $("#mapper").next(".popover").remove();
                      $("#mapper, .tagged-cont").hide();
                    }
                    $targetId = $(this).attr('id');
                    $d = $("#planetmap").find('.popover').length;
                    if($d > 0){
                      $("#planetmap").find(".popover").remove();
                    }
                    $(".tooltip").hide();
                    $tagged_title = $('#'+$targetId).find('.tagged-cont').find(".tagged_title").find('p').text();
                    $tagged_price = $('#'+$targetId).find('.tagged-cont').find(".tagged_price").find('p').text();
                    $tagged_desc  = $('#'+$targetId).find('.tagged-cont').find(".tagged_dec").find('p').text();
                    return '<div id="popOverBox"><div class="form-group"><label>Article Title</label><input class="form-control title" type="text" id="title" value="'+$tagged_title+'" placeholder="Enter Article Title"></div><div class="form-group"></div><div class="form-group price"><label>Price</label><input type="text" class="form-control" id="pricet" value= "'+$tagged_price+'"placeholder="Enter Price"></div><div class="form-group"><label>Description</label><textarea rows="1" id="desc" class="form-control">'+$tagged_desc+'</textarea></div><div class="form-group"><input type="button" id="edit-title" class="btn btn-default" value="edit"></div></div>';
                  }
                
              }).parent().delegate('input#edit-title', 'click', function(e) {
                  edit_title = $("#title").val();
                  edit_price = $("#pricet").val();
                  edit_desc  =  $("#desc").val();
                  $tagged_title = $('#'+$targetId).find('.tagged-cont').find(".tagged_title").find('p').text(edit_title);
                  $tagged_price = $('#'+$targetId).find('.tagged-cont').find(".tagged_price").find('p').text(edit_price);
                  $tagged_desc  = $('#'+$targetId).find('.tagged-cont').find(".tagged_dec").find('p').text(edit_desc);                 
                  $(".tagged").popover("hide");
              });

            });

        // $(document.body).on("mouseover",'.tagged' ,function(){
        //   $targetId = $(this).attr('id');
        //   popOverLength = $('#'+$targetId).next(".popover").length;
        //   if(popOverLength == 0){
        //     if($(this).find(".openDialog").length == 0){
        //         // $("#planetmap div").css( "position", "absolute");
        //         $(this).find(".tagged_box , .tagged-cont").css("display","block");
        //         $(this).css("border","0px solid #EEE");
        //         $(this).find(".tagged_title , .tagged-cont").css("display","block");
        //     }
        //   }
        // });


        // $(document.body).on("mouseout",'.tagged' ,function(){
        //     if($(this).find(".openDialog").length == 0){
        //         $(this).find(".tagged_box , .tagged-cont").css("display","none");
        //         $(this).css("border","none");
        //         $(this).find(".tagged_title , .tagged-cont").css("display","none");
        //     }

        // });
 
          $(document).mouseup(function (e) {
              if ($('.popover').has(e.target).length === 0) {
                  $('.popover').toggleClass('in').remove();
                  $("#mapper, .tagged-cont").hide();
                  return;
              }
          });
          

           


});
            var openDialog = function(){
                $("#mapper").popover("show");
                $("#form_panel").fadeIn("slow");
            };

            var showTags = function(){
                $(".tagged_box").css("display","block");
                $(".tagged").css("border","5px solid #EEE");
                $(".tagged_title").css("display","block");
            };

            var hideTags = function(){
                $(".tagged_box").css("display","none");
                $(".tagged").css("border","none");
                $(".tagged_title").css("display","none");
            };

            var editTag = function(obj){
                //$("#tag_png").popover("show");
                // $(obj).parent().parent().draggable( 'disable' );
                // $(obj).parent().parent().removeAttr( 'class' );
                // $(obj).parent().parent().addClass( 'tagged' );
                // $(obj).parent().parent().css("border","none");
                // $(obj).parent().css("display","none");
                // $(obj).parent().parent().find(".tagged_title").css("display","none");
                // $(obj).parent().html('');
                // return false;

            }

            var deleteTag = function(obj){
                $(obj).parent().parent().remove();
            };


        function cropImage(left,top,imgS,id) {
         var clipWidth = 320;
         var clipHeight = 320;
         var img = new Image();
            img.onload = function(){
                    canvas = $('<canvas width="320" height="320"/>')
                                .hide()
                                .appendTo('body'),
                ctx = canvas.get(0).getContext('2d'),
console.log('Hello',left,top);

                ctx.drawImage(img, left, top, clipWidth, clipHeight, 0, 0, clipWidth, clipWidth );
                
                var base64ImageData = canvas.get(0).toDataURL();
                if(id != null) {
                    $("#"+id+" img").attr('src', base64ImageData);
                }else {
                   $("#tagImg").attr('src', base64ImageData);
                }
                canvas.remove();
            }
          img.src = imgS;
        }

$(window).ready(function() {
    $(".search-hide").click(function() {
        $(".search-input-show").show();
        $(".search-hide").hide();
    });
    $(".close-search").click(function (){
       $(".search-input-show").hide();
       $(".search-hide").show();     
    });
    $(document.body).on("mouseover",'.image-tag' ,function(){
        $(this).find(".tagged-cont").css("display","block");
        $(this).css("border","0px solid #EEE");
        $(this).find(".tagged_title , .tagged-cont").css("display","block");

    });

    $(document.body).on("mouseout",'.image-tag' ,function(){
            $(this).find(".tagged-cont").css("display","none");
            $(this).css("border","none");
            $(this).find(".tagged_title , .tagged-cont").css("display","none");

    });

    /*  Tooltip to show edit message.  */
    $(document.body).on("mouseover",'.tagged' ,function(){
      $targetId = $(this).attr('id');
      popOverLength = $('#'+$targetId).next(".popover").length;
      if(popOverLength == 0 ){
        $(this).append('<div class="tooltip"><p>Click to edit Draggging to move</p></div>');
      }
    });

    $(document.body).on("mouseout",'.tagged' ,function(){ 
        if($(this).find(".openDialog").length == 0){
          $("div.tooltip").remove();
        }

    });
});
   





                   $(document.body).on("click",'.tagged',function(){
                    var id = $(this).attr('id');
                    var img_scope_top = $("#imageMap").offset().top + $("#imageMap").height() - $(this).find(".tagged_box").height();
                    var img_scope_left = $("#imageMap").offset().left + $("#imageMap").width() - $(this).find(".tagged_box").width();

                     $(this).draggable({ containment:[$("#imageMap").offset().left,$("#imageMap").offset().top,img_scope_left,img_scope_top]  });
                     $(this).on( "dragstop", function( event, ui ) {
   
                        var Stoppos = $(this).position();
                        var imgSrc = $("#imageMap").attr('src');
                        var top = Stoppos.top - 240;
                        var left = Stoppos.left - 240;
                        cropImage(top, left, imgSrc, id);

                     });

                });
