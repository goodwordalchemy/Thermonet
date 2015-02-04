Template.mongoTable.helpers({
    messages: function () {
      return Messages.find({}, {sort: {time: -1} });
    }
  });