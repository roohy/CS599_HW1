/**
 * Created by roohy on 3/2/16.
 */

function fhtOnline(event,types,bCount){

    makeReadyFHT(types);
    for ( var i = 0 ; i< types.length ; i+=1){
        console.log("FHT print requested for type "+types[i]);
        getSignatureAndRunFHT(types[i],bCount);
    }

    /*
    //diagram();
    var svg = makeSVG('chart');
    console.log(svg);
    receiveBFA(svg);*/

    event.preventDefault();

}

function makeReadyFHT(types){
    for (var i = 0 ; i < types.length ; i=i+1){
        $('#main-row').append("<div id='"+ types[i].replace('+','-') +"' class='FHTholder col-md-12'> <h1>FHT Diagram for type: "+ types[i]+"</h1> </div>");

    }
}
function getSignatureAndRunFHT(type,bCount){
    url = "./static/data/"+type+"_FHT_"+bCount;
    d3.json(url,function(data){
        d3renderFHT(data.FHT,'#'+type.replace('+','-'));
    });
}


//render each byte position (row of matrix)============================
function d3renderFHT(data,id) {
var margin = {top: 20, right: 50, bottom: 50, left: 40},
    width = 800 - margin.left - margin.right,
    height = Math.min(50*data.length - margin.top - margin.bottom, 600);

/*
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

var xData = [];
    yData = [];
    str = [];
    tickVals = [];
for (i=0;i<data.length;i++) {
	tickVals.push(i);
	for (j=0;j<data[0].length;j++) {
		if (data[i][j] !=0) {
			xData.push(j);
			yData.push(i);
			str.push(data[i][j]);
		}
	}
}

// setup x
var xValue = xData, // data -> value
    xScale = d3.scale.linear()
    	.range([0, width]) // value -> display
    	.domain([0, 255]),
    xMap = xScale(xValue), // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = yData, // data -> value
    yScale = d3.scale.linear()
    	.range([height, 0]) // value -> display
    	.domain([0,data.length]),
    yMap = yScale(yValue), // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(data.length).tickValues(tickVals);



var tickArr = yScale.ticks(data.length),
    tickDistance  = yScale(tickArr[tickArr.length - 1]) - yScale(tickArr[tickArr.length - 2]);

// add the graph canvas to the body of the webpage

var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Mouseover tip
    var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([20, 100])
		.html(function(d,i) {
	    return ("Byte value " + xData[i] + "<br> occurs at byte position "
		+ yValue[i] + "<br> with correlation strength " + Math.round(str[i]*100)/100);
	});

  // x-axis
  // add the x axis and x-label
    	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + (height+10) + ")")
	  .call(xAxis)
	  .selectAll("text")
	  .attr("x", -5)
	  .attr("dy", ".5em")
	  .style("text-anchor", "start");
    	svg.append("text")
	  .attr("class", "xlabel")
	  .attr("text-anchor", "middle")
	  .attr("x", width / 2)
	  .attr("y", height + margin.bottom*.7)
      	  .text("Byte value");

  // y-axis
  // add the y axis and y-label
    	svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxis)
	  .selectAll("text")
	  .attr("y", tickDistance/2)
    	svg.append("text")
	  .attr("class", "ylabel")
	  .attr("y", 0 - margin.left)
	  .attr("x", 0 - (height / 2))
	  .attr("dy", "1em")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor", "middle")
      	  .text("Byte position");

  // draw rectangles
  svg.selectAll("rect")
      .data(xData)
    .enter().append("rect")
    	.attr('fill', 'grey')
    	.attr('width',4)
    	.attr('height',-tickDistance+.1)
    	.attr("x", function(d,i) { return xScale(xValue[i]); })
        .attr("y", function(d,i) { return yScale(yValue[i]+1); })
        .style("fill", function(d,i) {
	      		if (str[i]<.25) {
				return "#cedb9c";
			} else if (str[i]<.5) {
				return "#b5cf6b";
			} else if (str[i]<.75) {
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
	      .attr("transform", function(d, i) { return "translate(60," + i * 20 + ")"; });
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
};
