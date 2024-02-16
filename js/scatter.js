let scatterWidth = document.querySelector("#scatter").offsetWidth;
let scatterHeight = document.querySelector("#scatter").offsetHeight;
let scatterMargin = {
    top:40,
    right:40,
    bottom:40,
    left:40
}

let scatterClipWidth = scatterWidth - scatterMargin.left - scatterMargin.right;
let scatterClipHeight = scatterHeight - scatterMargin.top - scatterMargin.bottom;
const scatterSvg = d3.select("#scatter_svg")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight);

const scatter_contour_g = scatterSvg.append("g")
    .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`);
const scatter_g = scatterSvg.append("g")
    .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`);

// draw pos line for Each node
const posLine_g = scatterSvg.append("g")
    .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)
    .attr("class", "posLines");

const colorLegendHeight = 20;
const colorLegendWidth = 200;
//绘制颜色比例尺
const colorLegend_g = scatterSvg.append("g")
    .attr("transform", `translate(${scatterClipWidth - colorLegendWidth}, ${colorLegendHeight})`)
const defs = scatterSvg.append("defs");

defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 13)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .append("path")
    .attr("class", "arrow")
    .attr("d", "M 0, -5 L 20, 0 L 0, 5")
    .attr("fill", "#818080")
    .style("stroke", "none");

const scatterXScale = d3.scaleLinear()
    .range([scatterMargin.left, scatterClipWidth]);

const scatterYScale = d3.scaleLinear()
    .range([scatterClipHeight, scatterMargin.top]);

let scatterXDomain, scatterYDomain;

// let scatterBrush = d3.brush()
//    .on("end", brushed)

let scatterBrush_g = scatterSvg.append("g")
    .attr("class", "brush");
let scatterSimulation;
let rings_g, rData_g;

let scatterMoveScale = d3.scaleLinear()
    .range([scatterInnerR, scatterOuterR]);

let opacityScale = d3.scaleLinear()
    .range([0.3, 1]);

let indexScale = d3.scaleLinear()
    .range([innerR, outerR])

let scatterColorScale = d3.scaleSequential(d3.interpolateTurbo);

// 生成节点轨迹
const posLineMaker = d3.line()
    .curve(d3.curveNatural)
    .x(d => d["x"])
    .y(d => d["y"]);

function drawScatter(res) {
    scatterXDomain = d3.extent(res, d => d["x"]);
    scatterYDomain = d3.extent(res, d => d["y"]);
    scatterXScale.domain(scatterXDomain);
    scatterYScale.domain(scatterYDomain);
    data = dataProcess(res, scatterXScale, scatterYScale);
    scatterMoveScale.domain(d3.extent(data, d => d["totalMove"]));
    opacityScale.domain(d3.extent(data.map(d => d["pos"]).flat().map(d => d.move)));
    indexScale.domain([startIndex, endIndex + 1]);
    scatterColorScale.domain([startIndex, endIndex]);
    const clg = colorLegend_g.selectAll(".cl")
        .data(d3.range(startIndex, endIndex + 1))
        .join("g")
        .attr("transform", (_, i) => `translate(${colorLegendWidth/(endIndex + 1 - startIndex) * i}, 0)`)
    clg.append("rect")
        .attr("width", colorLegendWidth/(endIndex + 1 - startIndex))
        .attr("height", colorLegendHeight)
        .attr("fill", d => scatterColorScale(d));
    colorLegend_g.append("text")
        .attr("x",10)
        .attr("y",35)
        .text("start");
    colorLegend_g.append("text")
        .attr("x",colorLegendWidth-30)
        .attr("y",35)
        .text("end");
    let contourData = data.map(d => d["pos"]).flat();
    const contours = d3.contourDensity()
        .x(d => d["x"])
        .y(d => d["y"])
        .weight(d => d["index"] === 0 ? 1 : d["move"])
        .size([scatterWidth, scatterHeight])
        .bandwidth(30)
        .thresholds(30)
        (contourData);
    
    scatter_contour_g.append("g")
        .attr("stroke", "#6b6b6b")
        .attr("stroke-opacity", 0.8)
        .attr("stroke-linejoin", "miter")
        .selectAll()
        .data(contours)
        .join("path")
        .attr("stroke-width", (d, i) => i % 5 ? 0.15 : 0.5)
        // .attr("fill", d => cScale(d.value))
        .attr("fill", "none")
        .attr("fill-opacity", "0.2")
        .attr("d", d3.geoPath());
    
    rings_g = scatter_g.selectAll("g")
        .data(data)
        .join("g")
        .attr("class", "rings")
        .attr("transform", d => `translate(${scatterXScale(d["x"])}, ${scatterYScale(d["y"])})`)
        .attr("visibility", "visible");
    
    rData_g = rings_g.selectAll(".rd")
        .data(d => getRingData(d))
        .join("path")
        .attr("d", d => getArc(d, indexScale, scatterMoveScale))
        .attr("fill", d => scatterColorScale(d["index"]))
        .attr("fill-opacity", d => opacityScale(d["move"]));
    
    scatterSimulation = d3.forceSimulation(data)
        .force("collide", d3.forceCollide().radius(d => scatterMoveScale(d["totalMove"])))
        // .force("center", d3.forceCenter(scatterWidth/2, scatterHeight/2))
        .force("x", d3.forceX(d => scatterXScale(d["x"])))
        .force("y", d3.forceY(d => scatterYScale(d["y"])))
        .on("tick", function () {
            rings_g
                .attr("transform", d => `translate(${d["x"]}, ${d["y"]})`);
            // 当实际的位置坐标固定之后 更新数据中 pos 数组内的位置坐标
            data.forEach(d => {
                d["pos"][startIndex - 1]["x"] = d["x"];
                d["pos"][startIndex - 1]["y"] = d["y"];
            });
        });
}

function getRingData(data) {
    let pos = data["pos"].filter(d => d["index"] >= startIndex && d["index"] <= endIndex);
    pos.reduce((pre, cur, i) => {
        cur["totalMove"] = pre["totalMove"] + cur["move"];
        cur["beforeMove"] = pre["totalMove"];
        return cur;
    }, {"totalMove": 0});
    return pos;
}

function getArc(d, indexScale, moveScale) {
    // console.log(d)
    let a = d3.arc()
        .innerRadius(moveScale(d["beforeMove"]))
        .outerRadius(moveScale(d["totalMove"]))
        .startAngle(0)
        .endAngle(Math.PI * 2);
    return a();
}