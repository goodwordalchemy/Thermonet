Template.lineChart.rendered = function(){
  // Setup
    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;
  

  

  // append svg element and layout features
    var svg = d3.select("#lineChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
      
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
          .attr("class", "focus")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("width", width);

    var context = svg.append("g")
          .attr("class", "context")
          .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
          .attr("width", width);
    
  // border around context graph
    svg.append("rect")
          .attr("x", margin2.left - 2)
          .attr("width", width + 4)
          .attr("y", margin2.top - 8)
          .attr("height", height2 + 8)
          .style({
            "fill": "none",
            "stroke": "black",
            "stroke-width": "0.5px"
          });

  // Scales
    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
    
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);


  // Define Axis functions
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left");

  // append axes
    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end") 
        .text("temp (F)");

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

  // features
    var line = d3.svg.line()
          .x(function(d) { return x(d.time); })
          .y(function(d) { return y(d.message); });

    var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

    function brushed() {
      console.log(brush.extent());
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select("path.line").attr("d", line)
            .attr('clip-path', 'url(#clip)');
        focus.select(".x.axis").call(xAxis);
    }



// update data and scales
  Deps.autorun(function(){
    var dataset = Messages.find({}).fetch();
    
    //update scales
    x.domain(d3.extent(dataset, function(d) { return d.time; })); 
    y.domain(d3.extent(dataset, function(d) { return d.message; })); 
    x2.domain(x.domain());
    y2.domain(y.domain());

    //update axes
    focus.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);

    focus.select('.y.axis')
      .transition()
      .duration(1000)
      .call(yAxis);

    context.select(".x.axis")
      .call(xAxis2);

  //draw line graph
    var paths = focus.selectAll("path.line")
        .data([dataset]);

    paths.enter().append("path")
        .attr("class", "line");

    paths.attr('d', line); 
      
    paths.exit().remove();


  // draw context bars
    var bars = context.selectAll(".bar")
          .data(dataset);
    
    bars.enter().append("rect")
        .attr("class", "bar");
    
    bars
        .attr("x", function(d) { return x2(d.time) - 1; })
        .attr("width", 1)
        .attr("y", function(d) { return y2(d.message); })
        .attr("height", function(d) { return height2 - y2(d.message); });

    bars.exit().remove();

  // draw brush
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -7)
        .attr("height", height2 + 5);


  
  });

};

