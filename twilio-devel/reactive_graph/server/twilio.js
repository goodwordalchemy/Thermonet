var accountSid = Meteor.settings.twilio.accountSid;
var authToken = Meteor.settings.twilio.authToken; 
twilio = Twilio(accountSid, authToken);

var Fiber = Npm.require('fibers');
var Future = Npm.require("fibers/future");
var lastUpdate = new Date();

Meteor.startup(function () {
  getMessageList();
});

Fiber(function(){
  (function(){
    var fut = new Future();
    setInterval(function(){
      getMessageList();
    },10000);
    return fut.wait();
  })();
  
}).run();

Meteor.methods({
  sendIt: function(recipient, message){
    console.log('in Sendit function.  Recipient: ' + recipient);
    twilio.sendSms({
      to: recipient, // Any number Twilio can deliver to
      from: '+16503326848', // A number you bought from Twilio and can use for outbound communication
      body: message // body of the SMS message
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (!err) { // "err" is an error received during the request, if any
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
      }
      else if (error) {
        console.log('Error: ' + err.message);
      }
    });
  },
});


function getMessageList(){
  var accountSid = Meteor.settings.twilio.accountSid;
  var authToken = Meteor.settings.twilio.authToken; 
  twilio = Twilio(accountSid, authToken);

  Fiber(function(){
    var updateTime = lastUpdate;
    lastUpdate = new Date(); // filters out old messages from updating again
    console.log("lastUpdate: " + lastUpdate);
    

    twilio.messages.get(Meteor.bindEnvironment(function(err, data){
      data.messages.forEach(function(message){
        
        if(message.dateCreated > updateTime) {
          console.log("inserting...");
          Messages.insert({
            message: message.body,
            time: new Date(message.dateCreated) ,
            from: message.from
          });
        }
        else {
          
        }
      });
    }));
  }).run();
}