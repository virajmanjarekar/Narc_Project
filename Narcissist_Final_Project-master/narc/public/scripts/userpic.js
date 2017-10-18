$(document).ready(function() {
  dpd.users.me(function(me) {
    var img = document.querySelector('#img_profile');
    img.src = "http://localhost:2403//imagesupload/images/" + me.profilepic;
  });
});

var files = [];

var uploadFiles = function() {
  var file_upload = $('#exampleInputFile').val();
  if(file_upload == ""){
      alert('Please Upload a File')
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
      if (this.status < 300) {
        dpd.users.me(function(me) {
          dpd.users.put(me.id, {profilepic: response[0].filename}, function(result, err) {
            if (err) return console.log(err);
            console.log(result, result.id);
            var img = document.querySelector('#img_profile');
            dpd.users.get(result.id, function(result) {
              console.log(result);
              img.src = "http://localhost:2403//imagesupload/images/" + result["profilepic"];
            });
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
};

var setFiles = function(element) {
  console.log('files:', element.files);
  // Turn the FileList object into an Array
  files = [];
  for (var i = 0; i < element.files.length; i++) {
    files.push(element.files[i]);
  }
};
