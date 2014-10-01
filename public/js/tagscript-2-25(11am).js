$(window).ready(function() {
    $("#tag-photo").val(0);
    $("#imageMap").click(function(e){
        var tag_photo = $("#tag-photo").val();
        if(tag_photo == 1)  {

            var image_left = $(this).offset().left;
            var click_left = e.pageX;
            var left_distance = click_left - image_left;

            var image_top = $(this).offset().top;
            var click_top = e.pageY;
            var top_distance = click_top - image_top;

            var mapper_width = $('#mapper').width();
            var imagemap_width = $('#imageMap').width();

            var mapper_height = $('#mapper').height();
            var imagemap_height = $('#imageMap').height();

            if((top_distance + mapper_height > imagemap_height) && (left_distance + mapper_width > imagemap_width)){
                $('#mapper').css("left", (click_left - mapper_width - image_left - 16  ))
                .css("top",(click_top - mapper_height - image_top + 50 ))
                .css("width","32px")
                .css("height","32px")
                .show();

            }
            else if(left_distance + mapper_width > imagemap_width){
                $('#mapper').css("left", (click_left - mapper_width - image_left  - 16  ))
                .css("top",top_distance + 50)
                .css("width","32px")
                .css("height","32px")
                .show();

            }
            else if(top_distance + mapper_height > imagemap_height){
                $('#mapper').css("left", left_distance  - 16 )
                .css("top",(click_top - mapper_height - image_top  + 50))
                .css("width","32px")
                .css("height","32px")
                .show();

            }
            else{
                $('#mapper').css("left",left_distance + 106)
                .css("top",top_distance + 45)
                .css("width","32px")
                .css("height","32px")
                .show();
            }


            $("#mapper").popover("show");
            $(".procces").slideUp(300 , function(){

            });
       }

       // Tagged Image crop

       var imgSrc = $(this).attr('src');
       var posX = $(this).position().left,
       posY = $(this).position().top;
       var top = e.pageY - posY ;
       var left = e.pageX - posX ;
       top = Math.round(top) - 240;
       left = Math.round(left)- 240;
       id = null;
       cropImage(top, left, imgSrc, id);

    });

        // Popover

        $("#mapper").popover({
              placement : 'bottom',
              html: 'true',
              content : '<div id="popOverBox"><div class="form-group"><label>Article Title</label><input class="form-control title" type="text" id="title" placeholder="Enter Article Title"></div><div class="form-group"></div><div class="form-group price"><label>Price</label><input type="text" class="form-control" id="pricet" placeholder="Enter Price"></div><div class="form-group"><label>Description</label><textarea rows="1" id="desc" class="form-control"></textarea></div><div class="form-group"><input type="button" id="add-title" class="btn btn-default" value="Add Article"></div></div>'
        }).parent().delegate('input#pricet', 'blur', function() {

             $('#pricet').formatCurrency();

          }).parent().delegate('input#add-title', 'click', function() {

               var title = $("#title").val();
               var desc = $("#desc").val();
                if($('#sell').is(':checked')){
                  var price = $("#pricet").val();
                }else {
                  var price = "No Price Add";
                }
                taggedImg = $("#tagImg").attr('src');

                var position = $('#mapper').position();
                var pos_x = position.left;
                var pos_y = position.top;
                var pos_width = $('#mapper').width();
                var pos_height = $('#mapper').height();

                var count = $("#planetmap").children().length;
                uniqueClass = count + 1;
                $('#planetmap').append('<div class="tagged" id="'+uniqueClass+'" style="width:'+pos_width+'px;height:'+
                    pos_height+'px;left:'+pos_x+'px;top:'+pos_y+'px;" ><div class="tagged_box" style="width:'+pos_width+'px;height:'+
                    pos_height+'px;display:none;" ></div><div class="tagged-cont"><div class="tagged_title" style="top:'+(pos_height - 8)+';display:none;" ><span>Title: </span><p class="tag_title">'+
                     title+'</p></div><div class="tagged_price" style="top:'+(pos_height+3)+'px;display:none;" ><span>Price: </span><p class="tag_price">'+
                     price+'</p></div><div class="tagged_dec" style="top:'+(pos_height+28)+'px;display:none;" ><span>Description: </span><p class="tag_dec">'+
                     desc+'</p></div><div class="tagged_img"><img id="tg" src="'+taggedImg+'"/></div></div></div>');

                $("#mapper, .tagged-cont").hide();
                $("#mapper").popover("hide");
                var y = $("#imgy").val();
                var x = $("#imgx").val();
                var imgsrc = $("#imageMap").attr("src");
                var pos = {'top':y,'left': x ,'width':'200' , 'height':'200' , 'imgSrc': imgsrc};
                $("#tagImg").attr('src',' ');

            });

        $(document.body).on("mouseover",'.tagged' ,function(){
            if($(this).find(".openDialog").length == 0){
                $(this).find(".tagged_box , .tagged-cont").css("display","block");
                $(this).css("border","0px solid #EEE");
                $(this).find(".tagged_title , .tagged-cont").css("display","block");
            }

        });


        $(document.body).on("mouseout",'.tagged' ,function(){
            if($(this).find(".openDialog").length == 0){
                $(this).find(".tagged_box , .tagged-cont").css("display","none");
                $(this).css("border","none");
                $(this).find(".tagged_title , .tagged-cont").css("display","none");
            }

        });

        $(document.body).on("click",'.tagged',function(){
            var id = $(this).attr('id');
            // $("#tagged").resizable({ containment: "parent" });
            $("#"+ id).draggable({ containment: "parent" });
            //$("#mapper2").popover("show");


             // $(this).find(".tagged_box").html("<img src='images/tag_img.png' id='tag_png' onclick='editTag(this);' value='Save' />");

             var img_scope_top = $("#imageMap").offset().top + $("#imageMap").height() - $(this).find(".tagged_box").height();
             var img_scope_left = $("#imageMap").offset().left + $("#imageMap").width() - $(this).find(".tagged_box").width();

             $(this).draggable({ containment:[$("#imageMap").offset().left,$("#imageMap").offset().top,img_scope_left,img_scope_top]  });
             $(this).on( "dragstop", function( event, ui ) {

                var Stoppos = $(this).position();
                 // alert("STOP:Left: "+ Stoppos.left + " Top: " + Stoppos.top);
                var imgSrc = $("#imageMap").attr('src');
                var top = Stoppos.top - 240;
                var left = Stoppos.left - 240;
                cropImage(top, left, imgSrc, id);

             } );

        });
        // $("#mapper2").popover({
        //       placement : 'bottom',
        //       html: 'true',
        //       content : '<div id="popOverBox"><div class="form-group"><label>Article Title</label><input class="form-control title" type="text" id="title" placeholder="Enter Article Title"></div><div class="form-group"><label class="checkbox-inline"><input type="checkbox" id="sell" value="sell">Sell</label></div><div class="form-group price"><label>Price</label><input type="text" class="form-control" id="pricet" placeholder="Enter Price"></div><div class="form-group"><label>Description</label><textarea rows="1" id="desc" class="form-control"></textarea></div><div class="form-group"><input type="button" id="add-title" class="btn btn-default" value="Add Article"></div></div>'
        // })

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


        function cropImage(top,left,imgS,id) {
         var clipWidth = 320;
         var clipHeight = 320;
         var img = new Image();
            img.onload = function(){
                    canvas = $('<canvas width="320" height="320"/>')
                                .hide()
                                .appendTo('body'),
                    ctx = canvas.get(0).getContext('2d'),
                ctx.drawImage(img, left,top , clipWidth, clipHeight, 0, 0, clipWidth, clipHeight );
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
