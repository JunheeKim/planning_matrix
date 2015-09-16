if (Meteor.isClient) {
  Template.addCard.events({
    "submit .new-task": function (event) {
      event.preventDefault();
      Tasks.insert({
        name: event.target.name.value,
        cost: event.target.cost.value,
        benefit: event.target.benefit.value,
        createdAt: new Date() // current time
      });
      event.target.name.value = "";
      event.target.cost.value = "";
      event.target.benefit.value = "";
    }
  });

  Template.board.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
  Template.cardList.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}