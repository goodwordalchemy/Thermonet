  Template.sendMessage.events({
    'click #send': function () {
      
      var recipient = "+" + $('#number').val();
      var message = $('#message').val();

      Meteor.call('sendIt', recipient, message);
    }
  });