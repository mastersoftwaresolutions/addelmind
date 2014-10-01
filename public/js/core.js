var facts = angular.module('facts', ['angularFileUpload']);

function mainController($scope, $http ,$upload) {
    $scope.formData = {};
    $scope.users = [];
      $scope.inputs = {
        'category': ['Art','Antiques','Cameras and Accessories','Phones and Telephones', 'Collectibles', 'Computing','Hobbies' ,'Sports'  , 'Appliances'  , 'Electronics' , 'Home and furniture ', ' Musical Instruments'  , 'Toys' ,'Books' , 'Music', 'Watches', 'Video','Movies' ,'Clothing']
      };

      $scope.setOutput = function(typeKey, $index, value) {
        $scope.formData[typeKey] = $scope.formData[typeKey] || [];
        $scope.formData[typeKey][$index] = value;
      };

    //when landing on the page, get all facts and show them
    // $http.get('/api/facts')
    //  .success(function(data) {
    //      console.log(data);
    //      $scope.allFacts = data;

    //  })
    //  .error(function(data) {
    //      console.log('Error: ' + data);
    //  });

    // when submitting the add form, send the text to the node API
    $scope.createLot = function(user) {
        var count = $("#planetmap").children().length;
        var top = [];
        var left = [];
        var title = [];
        var dec =  [];
        var single_prodcut_price = [];
        var taggedImg = new Array();
        for (var i=1; i<=count; i++) {
          topVal = $("#"+i).position().top;
          titleVal = $("#"+i).find(".tag_title").html();
          decVal = $("#"+i).find(".tag_dec").html();
          imgT = $("#"+i).find("#tg").attr('src');
          leftVal = $("#"+i).position().left;
          product_price = $("#"+i).find(".tag_price").html();
          top.push(topVal);
          dec.push(decVal);
          left.push(leftVal);
          title.push(titleVal);
          taggedImg.push(imgT);
          single_prodcut_price.push(product_price);
        }
        topValue = top.toString();
        titleValue = title.toString();
        decValue = dec.toString();
        leftValue = left.toString();
        imgSrc = taggedImg.toString();
        priceValue = single_prodcut_price.toString();
        if( taggedImg.length > 0 )
        {

        }else{
            taggedImg = "no value";
        }
        img = $('#imageMap').attr('src');
        if(typeof $scope.formData.full_price == 'undefined') {
           var price = $("#full-price").val();
           if(0 == parseInt(price.match(/\d+/)[0], 10)) {
              $(".msg").html("<p class='error'><font>Must indicate the selling price of the entire lot..</font><i class='fa fa-times'></i><p>");
              $(".error").fadeIn(400);
              return false;
           } else {
              $scope.formData['full_price'] = price;
           }
        }
        if(typeof $scope.formData.full_location == 'undefined') {

           $(".msg").html("<p class='error'><font>Must indicate the location of your lot...</font><i class='fa fa-times'></i><p>");
           $(".error").fadeIn(400);
           return false;
        }
        $("#loading_layer").show();
        $scope.formData['user'] = $scope.users;
        $scope.formData['image'] = img;
        $scope.formData['left'] = leftValue;
        $scope.formData['top'] = topValue;
        $scope.formData['title'] = titleValue;
        $scope.formData['taggedImages'] = taggedImg;
        $scope.formData['dec'] = decValue;
        $scope.formData['prices'] = priceValue ;
        $scope.users.push(user);
        var cleanFoo = {};
        for (var i in $scope.formData.category) {
          if ($scope.formData.category[i] !== undefined) {
            cleanFoo[i] = $scope.formData.category[i];
          }
        }
        $scope.formData.category = cleanFoo;
        console.log($scope.formData);
        $http.post('/api/createlot', $scope.formData)
            .success(function(data) {
                $("#loading_layer").hide();
                window.location = "/publish-done";
                $scope.insert = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
        });
    };

    // delete a facts after checking it
    $scope.deleteTodo = function(id) {

        $http.delete('/api/facts/' + id)
            .success(function(data) {
                $scope.deleted = data;
                $("#"+id).fadeOut();

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    // edit a facts after checking it
    $scope.editTodo = function(id,facts) {
      $http.put('/api/facts', facts)
        .success(function(data) {
            $scope.updated = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.uploadFile = function(files) {
        console.log('sdfsd');
        var fd = new FormData();
    //Take the first selected file
    fd.append("file", files[0]);
    var file = files[0];
     console.log(fd);
    if (file.type.indexOf('image') == -1) {
         $scope.error = 'image extension not allowed, please choose a JPEG or PNG file.'
    }
    if (file.size > 2097152){
         $scope.error ='File size cannot exceed 2 MB';
    }
};

$scope.file_changed = function(element, $scope) {
    //console.log($scope);
    var photofile = element[0];
         console.log(photofile);
         $http.put('/upload', photofile)
        .success(function(data) {
            $scope.updated = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};

$scope.onFileSelect = function($files) {
  console.log('heree');
  $('#submit-form').click();
  };

    $scope.updateUser = function(id,facts) {
        console.log(fd);
        console.log(id);
        console.log(facts);
      $http.put('/api/users'+id, facts)
        .success(function(data) {
            $scope.updated = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

  $scope.myCustomFunction = function() {
    console.log('myCustomFunction');
  };

}
