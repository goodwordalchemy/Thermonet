

if (Meteor.isClient) {

  Template.displayMessages.helpers({
    messages: function () {
      console.log('in messages helper');
      messageList = Meteor.call('listMessages');
      console.log('messageList: ' + messageList);
      return messageList;
    }
  });

  Template.sendMessage.events({
    'click #send': function () {
      console.log("button clicked");
      
      var recipient = "+" + $('#number').val();
      var message = $('#message').val();

      Meteor.call('sendIt', recipient, message);


    }


  });
}

if (Meteor.isServer) {

  
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    
    sendIt: function(recipient, message){

      var accountSid = 'AC01a06caf0c6b52d3a9f9a1d1276ac329';
      var authToken = '050eebeb13a334c1aa7ec5e540690467'; 
      twilio = Twilio(accountSid, authToken);

      console.log('in Sendit function.  Recipient: ' + recipient);
      twilio.sendSms({
        to: recipient, // Any number Twilio can deliver to
        from: '+16503326848', // A number you bought from Twilio and can use for outbound communication
        body: message // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
        }
        else if (error) {
          console.log('Error: ' + err.message);
        }
      });
    },

    listMessages: function(){
      var accountSid = 'AC01a06caf0c6b52d3a9f9a1d1276ac329';
      var authToken = '050eebeb13a334c1aa7ec5e540690467'; 
      twilio = Twilio(accountSid, authToken);
      console.log('in listMessages function...');
      twilio.listSms({
        from: '+14152696222'
      }, function (err, responseData) {
        responseData.smsMessages.forEach(function(message) {
          console.log('Message sent on: ' + message.dateCreate.toLocaleDateString());
          console.log(message.body);
        });
        console.log('responseData: ' + responseData);
        return responseData.smsMessages;
      });
    }
  });
}
