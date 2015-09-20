updatePosition = function () {
  existingTasks = Tasks.find({}, {fields: {'cost': 1, 'benefit': 1}}).fetch()
  costs = _.map(_.pluck(existingTasks, 'cost'), function (x) {return parseInt(x);}) //FIXME: We need schema. it's not a number in DB!
  benefits = _.map(_.pluck(existingTasks, 'benefit'), function (x) {return parseInt(x);}) //FIXME: We need schema. it's not a number in DB!
  var costsRange, benefitRange
  if (_.size(existingTasks) > 1) {
    costsRange = Math.abs(_.max(costs) - _.min(costs));
    benefitRange = Math.abs(_.max(benefits) - _.min(benefits));
  } else {
    costsRange = benefitRange = 1
  }
  center = [(_.min(costs) + _.max(costs)) / 2, (_.min(benefits) + _.max(benefits)) / 2]
  _.each(existingTasks, function (task) {
    Tasks.update(task._id, {$set:
      {
        costDiff: (task.cost - center[0])/costsRange*80 + 40,
        benefitDiff: (task.benefit - center[1])/benefitRange*80 + 40
      }
    })
  })
};

if (Meteor.isClient) {
  Template.addCard.events({
    "submit .new-task": function (event) {
      event.preventDefault();
      Tasks.insert({
        name: event.target.name.value,
        cost: parseInt(event.target.cost.value), //FIXME: We need schema. it's not a number in DB!
        benefit: parseInt(event.target.benefit.value), //FIXME: We need schema. it's not a number in DB!
        costDiff: null,
        benefitDiff: null,
        createdAt: new Date() // current time
      });
      event.target.name.value = "";
      event.target.cost.value = "";
      event.target.benefit.value = "";
      updatePosition();
    }
  });

  Template.board.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
  Template.card.events({
    "click .delete": function (event) {
      event.preventDefault();
      Tasks.remove({
        _id: event.target.id
      });
      updatePosition();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
