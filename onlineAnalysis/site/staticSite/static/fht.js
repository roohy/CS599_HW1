/**
 * Created by roohy on 3/2/16.
 */

function fhtOnline(event,types){

    makeReadyFHT(types);
    for ( var i = 0 ; i< types.length ; i+=1){
        console.log("BFA print requested for type "+types[i]);
        getSignatureAndRunFHT(types[i]);
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
        $('#main-row').append("<div id='"+ types[i].replace('+','-') +"' class='BFAholder col-md-12'> <h1>FHT Diagram for type: "+ types[i]+"</h1> </div>");

    }
}
function getSignatureAndRun(type){
    url = "/static/data/"+type+"_BFA";
    d3.json(url,function(data){
        d3renderFHT(data,'#'+type.replace('+','-'));
    });
}
