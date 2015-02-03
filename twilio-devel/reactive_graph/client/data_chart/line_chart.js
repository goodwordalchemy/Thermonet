var Points = new Meteor.Collection(null);
/*
Points.date must be replaced by Messages[item].time
Points.value gonna have to be Messages[item].message

Going to mark this with "//<---"
*/

/*// This adds 20 data points to the points collection if nothing in the Points Colection--remove
if(Points.find({}).count() === 0){
  for(i = 0; i < 20; i++)
    Points.insert({
      date:moment().startOf('day').subtract(Math.floor(Math.random() * 1000), 'days').toDate(),
      value:Math.floor(Math.random() * 100)+500
    });
}

//Adds, removes, or randomizes points in the graph--remove
Template.lineChart.events({
  'click #add':function(){
    Points.insert({
      date:moment().startOf('day').subtract(Math.floor(Math.random() * 1000), 'days').toDate(),
      value:Math.floor(Math.random() * 100)+500
    });
  },
  'click #remove':function(){
    var toRemove = Random.choice(Points.find().fetch());
    Points.remove({_id:toRemove._id});
  },
  'click #randomize':function(){
    //loop through bars
    Points.find({}).forEach(function(point){
      Points.update({_id:point._id},{$set:{value:Math.floor(Math.random() * 100)+500}});
    });
  }
});*/


Template.lineChart.rendered = function(){
  //Width and height
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) {
      return x(d.time); //changed from "date" to "time"
    })
    .y(function(d) {
      return y(d.message); //changed from "value" to "message"
    });

  var svg = d3.select("#lineChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end") 
    /*.text("Price ($)");  // this needs to become temperature*/
    .text("temp (F)");

  Deps.autorun(function(){

    //For line below, I'm thinking:
    /*var dataset = Points.find({},{sort:{date:-1}}).fetch();  */
    var dataset = Messages.find({}).fetch();

    var paths = svg.selectAll("path.line")
      .data([dataset]); //todo - odd syntax here - should use a key function, but can't seem to get that working

    /*x.domain(d3.extent(dataset, function(d) { return d.date; })); //return d.time
    y.domain(d3.extent(dataset, function(d) { return d.value; })); //return d.message*/

    x.domain(d3.extent(dataset, function(d) { return d.time; })); //return d.time
    y.domain(d3.extent(dataset, function(d) { return d.message; })); //return d.message

    //Update X axis
    svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);
      
    //Update Y axis
    svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(yAxis);
    
    paths
      .enter()
      .append("path")
      .attr("class", "line")
      .attr('d', line);

    paths
      .attr('d', line); //todo - should be a transisition, but removed it due to absence of key
      
    paths
      .exit()
      .remove();
  });
};