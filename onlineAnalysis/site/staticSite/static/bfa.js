/**
 * Created by roohy on 2/19/16.
 */

function bfaOnline(event,types){

    console.log("bfa ready");
    makeReadyBFA(types);
    for ( var i = 0 ; i< types.length ; i+=1){
        console.log("BFA print requested for type "+types[i]);
        getSignatureAndRunBFA(types[i]);
    }

    /*
    //diagram();
    var svg = makeSVG('chart');
    console.log(svg);
    receiveBFA(svg);*/

    event.preventDefault();

}

function makeReadyBFA(types){
    for (var i = 0 ; i < types.length ; i=i+1){
        $('#main-row').append("<div id='"+ types[i].replace('+','-').replace('.','-').replace('.','-') +"' class='BFAholder col-md-12'> <h1>BFA Diagram for type: "+ types[i]+"</h1> </div>");

    }
}
function getSignatureAndRunBFA(type){
    url = "./static/data/"+type+"_BFA";
    d3.json(url,function(data){
        d3renderBFA(data,'#'+type.replace('+','-').replace('.','-').replace('.','-'));
    });
}



function d3renderBFA(data,id) {

        var margin = {top: 30, right: 30, bottom: 75, left: 50};
        var width =1000 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;

        // Set up axes
        var bytenums = [];
        for (k=0;k<255;k++) {bytenums.push(k);}
        var x = d3.scale.ordinal()
            .domain(bytenums)
            .rangeBands([0,width],0);

        var y = d3.scale.linear()
            .domain([0, 1])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues([0,50,100,150,200,250])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(5)
            .orient("left");

        // put the graph in the "bfa" div
        //console.log("select is",d3.select(id));
        var svg = d3.select(id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //console.log("type is ",id , "svg is ",svg);
        //Mouseover tip
    	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([120, 40])
		.html(function(d,i) {
	    return "Byte number: " + i + "<br>" + "Frequency: " + d + "<br>" + "Correlation: " + data.corelation[i] + "<br>";
	});

        // add the x axis and x-label
    	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	  .selectAll("text")
	  .attr("x", -5)
	  .attr("dy", ".8em")
	  .style("text-anchor", "start");
    	svg.append("text")
	  .attr("class", "xlabel")
	  .attr("text-anchor", "middle")
	  .attr("x", width / 2)
	  .attr("y", height + margin.bottom/2)
	  .text("Byte value");
	// add the y axis and y-label
    	svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxis);
    	svg.append("text")
	  .attr("class", "ylabel")
	  .attr("y", 0 - margin.left)
	  .attr("x", 0 - (height / 2))
	  .attr("dy", "1em")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor", "middle")
	  .text("Frequency");

	//make the bars

	svg.selectAll(".bar")
	      .data(data.signature)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d,i) { return x(i); })
	      .attr("y", function(d) { return y(d); })
	      .attr("width", x.rangeBand())
	      .attr("height", function(d) { return height-y(d); })
	      .style("fill", function(d,i) {
	      		if (data.corelation[i]<.25) {
				return "#cedb9c";
			} else if (data.corelation[i]<.5) {
				return "#b5cf6b";
			} else if (data.corelation[i]<.75) {
				return "#8ca252";
			} else {
		      		return "#637939"; }
		      	})
	      .on('mouseover', tip.show)
	      .on('mouseout', tip.hide);

	svg.call(tip);

	//define legend
	var legend = svg.selectAll(".legend")
	      .data([0,1,2,3])
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	var color = ["#cedb9c","#b5cf6b","#8ca252","#637939"];
	    vals = ["<.25", "<.50", "<.75", "<1"];
	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", function(d,i) {return color[i]});

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d,i) { return vals[i]; });
}





//bull**t don't care about this part below. All the way to the end
function receiveBFA(svg) {
  $.ajax({
        url: '/static/data.json',
        success: function (data) {
            console.log("basic types loaded");
            console.log(data);
          result = [];
          for(var i = 0 ; i < 256 ; i++){
            result[i] = [data.signature[i],data.corelation[i]];
          }
            draw(svg,result);
        },
        dataType: "json"
    });
}


function draw(svg,data){
  var w = 2000;
  var h = 500;
    var barWidth = 6;
    var barCount = 256;
    var barHeight= 400;
  var xScale = d3.scale.linear().domain([0,barCount]).range([0,barCount*barWidth])
  var Yscale = d3.scale.linear();
  Yscale.domain([0,1]);
  Yscale.range([0,barHeight]);
  svg.attr("width", w)
   .attr("height", h);
  svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x',function(d,i){
        return xScale(i);
      })
      .attr('y',function(d){return barHeight-(Yscale(d[0]));})
      .attr('width',barWidth )
      .attr('height',function(d){return Yscale(d[0])})
      .attr('fill',function(d){
        //console.log('rgb(0, 0, '+ d[1]*256+')');
        return 'rgb(0,'+ Math.round((1-d[1])*256)+','+ Math.round((1-d[1])*256)+')';
      });
  var xAxis = d3.svg.axis();
  xAxis.scale(xScale).orient('bottom');
  svg.append('g').call(xAxis);
/*
  svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x',function(d,i){
        return i*5;
      })
      .attr('y',function(d){return 100-(d[1]*100);})
      .attr('width',4)
      .attr('height',function(d){return d[1]*100})
      .attr('fill','red');/*function(d){
        //console.log('rgb(0, 0, '+ d[1]*256+')');
        return 'rgb(200,0,200)';//'+ Math.round(d[1]*256)+','+ Math.round(d[1]*256)+')';
      });*/
  /*
  var dataset = [ 5, 10, 15, 20, 25 ];
var circles = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle");

  circles.attr("cx", function(d, i) {
            return (i * 50) + 25;
        })
       .attr("cy", h/2)
       .attr("r", function(d) {
            return d;
       }).attr("fill", "yellow")
          .attr("stroke", "orange")
        .attr("stroke-width", function(d) {
            return d/2;
        });*/



}
function diagram(){
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, temperature: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (ºF)");

  var city = svg.selectAll(".city")
      .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});
}