$(document).ready(function() {
  dpd.users.me(function(me) {
    getAllUserBlogPost(me);
    var img = document.querySelector('#img_profile');
    img.src = "http://localhost:2403//imagesupload/images/" + me.profilepic;
  });
});
var files = [];

$('.alert-success').hide();
var addBlogpost = function(fd){
  var uniqueFilename = "true";
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/imagesupload&uniqueFilename=' + uniqueFilename);
  xhr.onload = function() {
    var response = JSON.parse(this.responseText);
    console.log(response);
    if (this.status < 300) {
      dpd.users.me(function(me) {
        var data = {};
        data["username"] = me.username;
        data["Blogpost"] = "";
        data["Timestamp"] =  Date.now();
        data["blogimg"]="abc";
        dpd.blog.post(data, function(result, err) {
          if (err) return console.log(err);
          console.log(result, result.id);
        });
        });
    } else {
      alert(response.message);
    }
  };
  xhr.onerror = function(err) {
    alert("Error: ", err);
  }
  xhr.send(fd);
}

var updateProfilePic = function(fd){
  var uniqueFilename = "true";
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/imagesupload&uniqueFilename=' + uniqueFilename);
  xhr.onload = function() {
    var response = JSON.parse(this.responseText);
    console.log(response);
    if (this.status < 300) {
      dpd.users.me(function(me) {
        dpd.users.put(me.id, {profilepic: response[0].filename}, function(result, err) {
          if (err) return console.log(err);
          console.log(result, result.id);
        });
        });
    } else {
      alert(response.message);
    }
  };
  xhr.onerror = function(err) {
    alert("Error: ", err);
  }
  xhr.send(fd);

};

var writeBlog = function() {

  var msg = $('#msg').val();


  if (msg == "") {
    alert('Blogs Cant be Submitted Empty');
  }
else {
  var file_upload = $('#exampleInputFile').val();
if(file_upload == ""){
  dpd.users.me(function(me) {
  var data = {};
  var message = document.querySelector('#msg');
  data["username"] = me.username;
  data["Blogpost"] = message.value;
  data["Timestamp"] =  Date.now();
  dpd.blog.post(data, function(result, err) {
    if (err) return console.log(err);
    console.log(result, result.id);
    $('#user-blogposts').children("div.media").remove();
    $('#exampleInputFile').val('');
    $('#msg').val('');
    $('#newpost').removeClass("in");
    getAllUserBlogPost(me);
  });
  });
}
else {
  var fd = new FormData()
  for (var i in files) {
    fd.append("uploadedFile", files[i])
  }
  var uniqueFilename = "true";
  var xhr = new XMLHttpRequest();
    xhr.open('POST', '/imagesupload?subdir=images&uniqueFilename=' + uniqueFilename);
    xhr.onload = function() {
      var response = JSON.parse(this.responseText);
      console.log(response);
      if (this.status < 300){
      dpd.users.me(function(me) {
      var data = {};
      var message = document.querySelector('#msg');
      data["username"] = me.username;
      data["Blogpost"] = message.value;
      data["Timestamp"] =  Date.now();
      data["blogimg"] = response[0].filename;
      dpd.blog.post(data, function(result, err) {
        if (err) return console.log(err);
        console.log(result, result.id);
        $('#user-blogposts').children("div.media").remove();
        $('#exampleInputFile').val('');
        $('#msg').val('');
        $('#newpost').removeClass("in");
          getAllUserBlogPost(me);
      });
  });
  }
  else {
    alert(response.message);
  }
    };
    xhr.send(fd);
}


}
};

var uploadFiles = function() {

  var fd = new FormData()
  for (var i in files) {
    fd.append("uploadedFile", files[i])
  }
  addBlogpost(fd);
  updateProfilePic(fd);

};

var setFiles = function(element) {
  console.log('files:', element.files);
  // Turn the FileList object into an Array
  files = [];
  for (var i = 0; i < element.files.length; i++) {
    files.push(element.files[i]);
  }
};

var deleteFile = function(element, id) {
  $(element).closest('tr').remove();
  dpd.upload.del(id, function(data, status) {
    $('.alert-success').show();
    $('.alert-success').append("File removed!");
  })
}

function getAllUserBlogPost(user) {
  // get all blogposts in descending order
  dpd.blog.get({
    username: user.username,
    $sort: {
      Timestamp: -1
    }
  }).then(function(results) {
    results.forEach(function(item) {
      renderBlogPost(item, '#user-blogposts', user.profilepic)
    });
  }, function(err) {
    if (err) {
      alert(err.message || (err.errors && err.errors.title));
      return;
    }
  });
}

function renderBlogPost(item, element, userpic) {
  var $mediaDiv = $('<div></div>', {
    'class': 'media'
  });
  var $mediaLeftDiv = $('<div></div>', {
    'class': 'media-left'
  });
  var $profileImg = $('<img></img>', {
    'src': 'http://localhost:2403//imagesupload/images/' + userpic,
    'class': 'media-object',
    'style': 'width:45px'
  });
  var $mediaBodyDiv = $('<div></div>', {
    'class': 'media-body'
  });
  var $profileNameHeading = $('<h4></h4>', {
    'class': 'media-heading'
  });
  var profileName = item['username'] + ' ';
  var $timeStampSmallHeading = $('<small></small>', {
    'style': 'color:white'
  });
  var $timeStampItalic = $('<i></i>');
  var timeStampText = (new Date(item['Timestamp'])).toLocaleString();
  var $blogPostTextP = $('<p></p>');
  var blogPostText = item['Blogpost'];


  $timeStampItalic.append(timeStampText);
  $timeStampSmallHeading.append($timeStampItalic);
  $profileNameHeading.append(profileName);
  $profileNameHeading.append($timeStampSmallHeading);
  $mediaBodyDiv.append($profileNameHeading);
  if(item['blogimg']!=undefined){
    var $blogPostImg = $('<img></img>', {
      'src': 'http://localhost:2403//imagesupload/images/' + item['blogimg'],
      'class':'img-responsive',
      'style': 'width:200px;height:200px'
    });
  $mediaBodyDiv.append($blogPostImg);
  }
  $blogPostTextP.append(blogPostText);
  $mediaBodyDiv.append($blogPostTextP);
  $mediaLeftDiv.append($profileImg);
  $mediaDiv.append($mediaLeftDiv);
  $mediaDiv.append($mediaBodyDiv);

  this.$element = $(element);
  this.$element.append($mediaDiv);
}
