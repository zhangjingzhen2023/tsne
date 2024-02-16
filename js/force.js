// // 首先向bottom div中插入 startIndex 到 endIndex数量的 div
// $("#bottom").append('<div class="force-item"></div>');
const force_id = d3.range(startIndex-1, endIndex + 1)

let forceHeight = document.querySelector("#bottom").offsetHeight;
let forceWidth = forceHeight;

const forceEl = d3.select("#bottom");
const fg = forceEl.selectAll("div")
    .data(force_id)
    .join("div")
    .attr("id", d => `f${d}`)
    .attr("class", "border")
    .text(d =>`${d}frame`)
    .on("mouseover", function (_, d) {
        this.title = `${d}frame`;
    });
fg.each(function(i){
    d3.select(this).append("svg")
        .attr("id", `fg${i}`)
        .attr("width", forceWidth)
        .attr("height", forceHeight)
})

let forceLinkWidth =d3.scaleLinear().range([1,10]);
function drawForceGraph(svg, g, node, edge, width, height) {
    let nodes = _.cloneDeep(node);
    let edges = _.cloneDeep(edge);
    let forceSimulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody()
            .strength(-50))
        .force("link", d3.forceLink(edges))
        .force("center", d3.forceCenter())
        .force("x", d3.forceX())
        .force("y", d3.forceY());
    let colorScale = d3.scaleOrdinal()
        .domain(d3.range(nodes.length))
        .range(d3.schemeCategory10);
    //生成节点数据
    forceSimulation.nodes(nodes)
        .on("tick",ticked);
    //生成边数据
    forceSimulation.force("link")
        .links(edges)
        .distance(50)
    //设置图形的中心位置
    forceSimulation.force("center")
        .x(width/2)
        .y(height/2);
    forceLinkWidth.domain(d3.extent(edges, e => e["value"]))
    //绘制边
    let links = g.append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke",(d, i) => colorScale(d["source"]["index"]))
        .attr("stroke-width",d => forceLinkWidth(d.value));
    let gs = g.selectAll(".circleText")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform",function(d,i){
            let cirX = d.x;
            let cirY = d.y;
            return "translate("+cirX+","+cirY+")";
        })
        .call(drag(forceSimulation)
        );
    //绘制节点
    gs.append("circle")
        .attr("r",forceNodeSize)
        .attr("fill",function(d,i){
            return colorScale(i);
        });
    //文字
    gs.append("text")
        .attr("x",-10)
        .attr("y",-20)
        .attr("dy",10)
        .text(d => d["id"]);
    function ticked(){
        links
            .attr("x1",function(d){return d.source.x;})
            .attr("y1",function(d){return d.source.y;})
            .attr("x2",function(d){return d.target.x;})
            .attr("y2",function(d){return d.target.y;});
        
        gs
            .attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
    
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    
    svg.call(d3.zoom()
        .extent([[-300, -300], [300, 300]])
        .scaleExtent([-8, 8])
        .on("zoom", zoomed));
    
    function zoomed({transform}) {
        g.attr("transform", transform);
    }
}

function drawGraphFormData(da){
    let tmp = _.cloneDeep(da)
    tmp = tmp.map(t => t["pos"]).flat()
    let edgeTmp = [];
    force_id.forEach(f => {
        let t = tmp.filter(t => t["index"] === f).map(t => t["edge"]).flat().filter(t => t!== 0)
        edgeTmp.push(t)
    })
    edgeTmp.forEach((edge, i) =>{
        if (edge.length === 0) {
            d3.select(`#f${i}`)
                .style("display", "none");
        } else {
            d3.select(`#f${i}`)
                .style("display", "block");
            forceEdges = edge;
            forceNodesId.length = 0;
            forceNodes.length = 0;
            forceEdges.forEach(e => {
                forceNodesId.push(e["source"]);
                forceNodesId.push(e["target"]);
            });
            forceNodesId = [...new Set(forceNodesId)];
            forceNodesId.forEach(i => forceNodes.push(data[i]));
            forceEdges.forEach(e => {
                e["source"] = forceNodesId.indexOf(e["source"]);
                e["target"] = forceNodesId.indexOf(e["target"]);
            });
            let svg = d3.select(`#fg${i}`);
            svg.selectAll("g").remove();
            let g = svg.append("g");
            drawForceGraph(svg, g, forceNodes, forceEdges, forceWidth, forceHeight);
        }
    })
}
