/**
 * Created by roohy on 3/2/16.
 */
function bfcOnline(event,types){

    console.log("bfc ready");
    makeReadyBFC(types);
    for ( var i = 0 ; i< types.length ; i+=1){
        console.log("BFC print requested for type "+types[i]);
        getSignatureAndRunBFC(types[i]);
    }

    /*
    //diagram();
    var svg = makeSVG('chart');
    console.log(svg);
    receiveBFA(svg);*/

    event.preventDefault();

}

function makeReadyBFC(types){
    for (var i = 0 ; i < types.length ; i=i+1){
        $('#main-row').append("<div id='"+ types[i].replace('+','-') +"' class='BFCholder col-md-12'> <h1>BFC Diagram for type: "+ types[i]+"</h1> </div>");

    }
}
function getSignatureAndRunBFC(type){
    url = "./static/data/"+type+"_BFC";
    d3.json(url,function(data){
        d3renderBFC(data,'#'+type.replace('+','-'));
    });
}

function d3renderBFC(data,id){
    var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 1024 - margin.left - margin.right,
          height = 1024 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 256),
          legendElementWidth = gridSize*2,
          buckets = 9,
          //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]
          colors = ['red', 'white','blue'];
      var fields = [];
      for (var i=0; i < 256; ++i) {
        fields.push(i);
      }
    var svg = d3.select(id).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      var rowLabels = svg.selectAll(".rowLabel")
          .data(fields)
          .enter().append("text")
            .text(function (d) { if (d % 10 == 0) return d; else return "";})
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "rowLabel mono axis axis-workweek" : "rowLabel mono axis"); });
      var colLabels = svg.selectAll(".colLabel")
          .data(fields)
          .enter().append("text")
            .text(function (d) { if (d % 10 == 0) return d; else return "";})
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "colLabel mono axis axis-worktime" : "colLabel mono axis"); });

    //json callback function is pasted here
    var json = data;
    for (var i=0; i < json.BFC.length; ++i) {
            for (var j=i; j < json.BFC[i].length; ++j) {
              json.BFC[j][i] = json.BFC[i][j];
            }
          }
          // convert byte frequency to correlation
          for (var i=0; i < json.BFC.length; ++i) {
            for (var j=i; j < json.BFC[i].length; ++j) {
              json.BFC[i][j] = 1 - Math.abs(json.BFC[i][j]);
            }
          }

          var data = [];
          for (var i=0; i < json.BFC.length; ++i) {
            for (var j=0; j < json.BFC[i].length; ++j) {
              var d = {};
              d.value = json.BFC[i][j];
              d.x = j;
              d.y = i;
              data.push(d);
            }
          }
          /*
          var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(data, function (d) { return buckets * d.value; })])
              .range(colors);
          */
          var colorScale = d3.scale.linear().domain([-1,0,1]).range(colors)

          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.y+':'+d.x;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return d.x * gridSize; })
              .attr("y", function(d) { return d.y * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);

          cards.transition().duration(0)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });

          cards.exit().remove();

          legend_data = []
          for (var i=0; i <= 256; ++i) {
            legend_data.push(-1 + (i/256.0) * 2);
          }

          var legend = svg.selectAll(".legend")
            .data(legend_data)
            .enter()
            .append("g")
            .attr("class", "legend");
          legend.append("rect")
            .attr("x", function(d, i) {
              return gridSize * i;
             })
            .attr("y", height)
            .attr("height", gridSize * 5)
            .attr("width", gridSize)
            .style("fill", function(d, i) {
              return colorScale(d);
            });
          legend.append("text")
            .attr("class", "mono")
            .attr("width", legendElementWidth)
            .attr("x", function(d, i) {
              return gridSize * i;
            })
            .attr("y", height + (gridSize * 10))
            .text(function(d) {
              if (d % 0.5 == 0) { return d; }
            });
          legend.exit().remove();

}