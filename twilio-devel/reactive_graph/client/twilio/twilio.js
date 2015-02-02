Template.displayMessages.helpers({
    messages: function () {
      return Messages.find().fetch();
    }
  });

  Template.sendMessage.events({
    'click #send': function () {
      
      var recipient = "+" + $('#number').val();
      var message = $('#message').val();

      Meteor.call('sendIt', recipient, message);
    }
  });