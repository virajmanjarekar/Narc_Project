$(document).ready(function() {

  $('#login-user').click(loginUser);

  function loginUser() {
    var username = $('#login-name').val();
    var password = $('#login-pass').val();

    if (username == "" || password == "") {
      alert('Please input Username and Password');
    } else {
      dpd.users.login({
        username: username,
        password: password
      }, function(result, err) {
        if (err) {
          alert('Incorrect Username or Password');
          return;
        }
      });
      window.location.replace("Profile.html");
      return false;
    }
  }

  $('#logout-user').click(logoutUser);

    function logoutUser() {
      var username = $('#login-name').val();
      var password = $('#login-pass').val();


      dpd.users.logout({
        username: username,
        password: password
      }, function(user, err) {
        if (err) {
          alert(err.message || (err.errors && err.errors.title));
          return;
        }
        window.location.replace("index.html");
      });
    }

});
