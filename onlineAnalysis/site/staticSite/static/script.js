function load_basic_types() {
    var ddd = {};
    console.log("starting to fetch the types");
    $.ajax({
        url: 'data.json',
        success: function (data) {
            console.log("basic types loaded");

            print_pie(data);
        },
        dataType: "json"
    });
    console.log(ddd);
    /*    var width = 400;
     var height = 400;
     var radius = Math.min(width,height)/2;

     var color = d3.scale.category20b();
     var svg = d3.select('#chart')
     .append('svg')
     .attr('width',width)
     .attr('height',height)
     .append('g')
     .attr('transform','translate('+(width/2)+','+(height/2)+')');
     var arc = d3.svg.arc()
     .outerRadious(radius);
     var pie = d3.layout.pie()
     .value(function(d){return d.count();}).sort(null);*/
}
function print_pie(input){
    var w = 800,                        //width
        h = 800,                            //height
        r = 400,                            //radius
        color = d3.scale.category20c();     //builtin range of colors
    data = [];
    for(var key in input){
        console.log(key);
        data.push({'label':key, 'value':input[key]});
    }

    var vis = d3.select("#chart")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
        .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
        .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
        .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice");    //allow us to style things in the slices (like text)

    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

    arcs.append("svg:text")                                     //add a label to each slice
        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function(d, i) { return data[i].label; });        //get the label from our original data array

}

function clearPage(event){

    $('#main-row').text('');
    $('.nav-sidebar li').removeClass('active');
    $(event.target.parentNode).addClass('active');
}
TYPES = ['application_x-msdownload','application_x-tika-msoffice','application_atom+xml','application_rdf+xml','video_mpeg','audio_x-wav','image_gif','image_svg+xml','image_x-ms-bmp','video_quicktime',
        'video_x-m4v','video_x-msvideo','xscapplication_zip','application_octet-stream'];
document.__types=['application_x-msdownload','application_x-tika-msoffice','application_atom+xml','application_rdf+xml','video_mpeg'];

$(document).ready(function(){
    //load_basic_types();
    for( var i = 0 ; i< TYPES.length ; i+=1){
        $('#mimeSelector').append('<option value="'+TYPES[i]+'">'+ TYPES[i]+'</option>')
    }
    $('#mimeSelector').change(function(event){
        $( "#mimeSelector option:selected" ).each(function() {

            console.log($(this).text()+" was selected");
            document.__types = [$(this).text()];
        });

    });
    console.log("BFA report clicked");
    $('#bfa-online').click(function(event){
        clearPage(event);
        bfaOnline(event, document.__types);
    });
    $('#fht4-online').click(function(event){
        clearPage(event);
        fhtOnline(event,document.__types,4);
    });
    $('#fht8-online').click(function(event){
        clearPage(event);
        fhtOnline(event,document.__types,8);
    });
    $('#fht16-online').click(function(event){
        clearPage(event);
        fhtOnline(event,document.__types,16);
    });
    $('#bfc-online').click(function(event){
        clearPage(event);
        bfcOnline(event,document.__types);
    });
});

function makeSVG(tagID){
    return d3.select('#'+tagID).append('svg').attr('class','wideSVG');
}