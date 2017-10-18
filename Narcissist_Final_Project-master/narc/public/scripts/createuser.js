$(document).ready(function() {

  $('#add-user').click(addUser);

  function addUser() {
    var username = $('#user-name').val();
    var password = $('#user-pass').val();
    var email = $('#user-email').val();

    if (username == "" || password == "" || email == "") {
      alert('Please input Username, Email and Password');
    }
    else if(ValidateEmail(email) == false){
      alert('Enter Valid Email Address');
    }
    /*else if(chk_user_exists(username) == true){
      alert('Username Already Exists');
    }*/
    else {
      dpd.users.post({
        username: username,
        password: password,
        email: email,
        profilepic:'defaultprofilepic.png'
      }, function(user, err) {
        if (err) {
          alert(err.message || (err.errors && err.errors.title));
          return;
        }
        else {
          alert('Registration Done Successfully');
          return false;
        }
      });
    }
  }

  function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true)
  }
  return (false)
}
function chk_user_exists(username) {
  var query = {"username":username};
  dpd.users.get(query, function(result) {
    console.log(result);
    if (result) {
      var resultAr = [];
      resultAr = result;
      if (resultAr.length == 0) {
        return false;
      }
      return true;
    }
  });
}
});
