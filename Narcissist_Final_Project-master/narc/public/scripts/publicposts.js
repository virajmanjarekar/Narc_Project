$(document).ready(function() {
  dpd.users.me(function(me) {
    getAllUserBlogPost(me);
    var img = document.querySelector('#img_profile');
    img.src = "http://localhost:2403//imagesupload/images/" + me.profilepic;
  });
});

function getAllUserBlogPost(user) {
  // get all blogposts in descending order
  var logged_in_user = user.username;
  dpd.blog.get({
    username: {$ne: logged_in_user},
    $sort: {
      Timestamp: -1
    }
  }).then(function(results) {
    results.forEach(function(item) {
      renderBlogPost(item, '#user-blogposts')
    });
  }, function(err) {
    if (err) {
      alert(err.message || (err.errors && err.errors.title));
      return;
    }
  });
}

function renderBlogPost(item, element) {
  var $mediaDiv = $('<div></div>', {
    'class': 'media'
  });
  var $mediaLeftDiv = $('<div></div>', {
    'class': 'media-left'
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

  dpd.users.get({
    username: item['username']
  }).then(function(results) {
    results.forEach(function(item1) {
      var $profileImg = $('<img></img>', {
        'src': 'http://localhost:2403//imagesupload/images/' + item1['profilepic'],
        'class': 'media-object',
        'style': 'width:45px'
      });
      $mediaLeftDiv.append($profileImg);
    });
  }, function(err) {
    if (err) {
      alert(err.message || (err.errors && err.errors.title));
      return;
    }
  });


  $mediaDiv.append($mediaLeftDiv);
  $mediaDiv.append($mediaBodyDiv);

  this.$element = $(element);
  this.$element.append($mediaDiv);
}
