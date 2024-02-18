//总体移动距离过滤
$( "#moveSlide" ).slider({
    range:true,
    min: 0,
    max: totalMoveMax,
    values: [ 0, totalMoveMax ],
    change: function( event, ui ) {
        rings_g.attr("visibility", d => d["totalMove"]>=ui.values[0] && d["totalMove"]<=ui.values[1] ? "visible" : "hidden");
    },
    slide: function( event, ui ) {
        $( "#move_value" )
            .val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    }
});

//节点对应网络数量过滤
$( "#graphSlide" ).slider({
    range:true,
    min: 0,
    max: graphNumMax,
    values: [ 0, graphNumMax],
    change: function( event, ui ) {
        rings_g.attr("visibility", d => d["graphNum"]>=ui.values[0] && d["graphNum"]<=ui.values[1] ? "visible" : "hidden");
    },
    slide: function( event, ui ) {
        $( "#graph_value" )
            .val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    }
});