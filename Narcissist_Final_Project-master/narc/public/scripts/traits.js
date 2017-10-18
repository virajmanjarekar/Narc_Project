// an array of selected attributes
function getSelectedCheckedBox(form) {

  var chx = [];
  var input = form.getElementsByTagName('input');
  var len = input.length;
  var y = document.getElementById('mytext').value;
  var x = document.getElementById('changeme').value = y;

  for (var i = 0; i < len; i++) {
    if (input[i].type == 'checkbox' && input[i].checked == true) {
      chx.push(input[i].value);
    }

  }
  return chx;
}

//disables checkboxes after 5

jQuery(function() {
  var limit = 5;
  var checked = $('input[type="checkbox"]');

  checked.change(function() {
    var count = checked.filter(':checked').length;
    checked.filter(':not(:checked)').prop('disabled', count >= limit);

  });
});

//hides text box until other is checked

jQuery(document).ready(function($) {
  $('input.uservar').change(function() {
    if ($(this).is(':checked'))
      $(this).next('div.custom_input').show();
    else
      $(this).next('div.custom_input').hide();
  }).change();
});

//submit button
//instead of alert send it to the back-end
$(document).ready(function() {
  function renderTrait(trait, element){
    console.log(trait);
    //<img id="profile-picture" src="/img/defaultprofilepic.png" class="img-responsive" style="width:500px">
    //var $traitP = $('<p></p>');
    //$traitP.append(trait);
    this.$element = $(element);
    this.$element.append('- ' + trait);
    this.$element.append('<br><br>');
  }

  function renderTraits(me){
    console.log(me.username);
      dpd.traits.get(
        {
          username:me.username
        }).then(function(results){
          results.forEach(function(trait){
            renderTrait(trait.traits, '#user-traits');
          });
        },
        function(err){
          if (err) {
            alert(err.message || (err.errors && err.errors.title));
            return;
          }
        });
  }


  dpd.users.me(function(me) {
    $('#submit-traits').click(function (){
      var chx = getSelectedCheckedBox(this.form);
      var data ={};
      data['username'] = me.username;
      chx.forEach(function(trait){
        dpd.traits.get({
          username:me.username
        }).then(function (results){
          if(results.length < 5){
            if (!results.includes(trait)){
              data['traits']=trait;
              console.log(data);
              dpd.traits.post(data);
            }
            else {
              console.log(trait +' already exists');
            }
          }
          else{
            alert('you already have 5 traits');
          }
        }, function(err) {
          if (err) {
            alert(err.message || (err.errors && err.errors.title));
            return;
          }
        });
      });
      this.form.reset();
    });//click

    renderTraits(me);
  });//user
});
