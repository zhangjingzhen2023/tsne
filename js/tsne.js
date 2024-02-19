// // 首先向bottom div中插入 startIndex 到 endIndex数量的 div
// $("#bottom").append('<div class="force-item"></div>');
const tsne_id = d3.range(startIndex - 1, endIndex + 1);

let tsneHeight = document.querySelector("#bottom").offsetHeight;
let tsneWidth = tsneHeight;
let tsneMargin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 10
};
let tsneClipWidth = tsneWidth - tsneMargin.left - tsneMargin.right;
let tsneClipHeight = tsneHeight - tsneMargin.top - tsneMargin.bottom;

const tsneEl = d3.select("#bottom-left");
const tg = tsneEl.selectAll("div")
    .data(tsne_id)
    .join("div")
    .attr("id", d => `t${d}`)
    .attr("class", "border")
    .text(d => `${d}frame`);
tg.each(function (i) {
    d3.select(this).append("svg")
        .attr("id", `tg${i}`)
        .attr("width", tsneHeight)
        .attr("height", tsneWidth);
});

let tsneXScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, tsneClipWidth]);
let tsneYScale = d3.scaleLinear()
    .domain([0, 1])
    .range([tsneClipHeight, 0]);


function drawTSNEGraph(data) {
    let tmp = _.cloneDeep(data);
    tmp = tmp.map(t => t["pos"]).flat();
    tsne_id.forEach(f => {
        let t = tmp.filter(t => t["index"] === f);
        let t_svg = d3.select(`#tg${f}`);
        t_svg.selectAll("g").remove();
        let tBrush = d3.brush()
            .on("end", tsneBrushed);
        let tBrush_g = t_svg.append("g")
            .attr("class", "brush")
            .call(tBrush);
        let t_g = t_svg.append("g")
            .attr("transform", `translate(${tsneMargin.left}, ${tsneMargin.top})`);
        t_g.selectAll("circle")
            .data(t)
            .join("circle")
            .attr("cx", d => tsneXScale(d["lx"]))
            .attr("cy", d => tsneYScale(d["ly"]))
            .attr("fill", d => parallelColorScale(d["label"]))
            .attr("fill-opacity", 0.5)
            .attr("r", 3);
    });
}

function tsneBrushed(event, i) {
    let s = event.selection;
    if (!event.sourceEvent) return;
    if (!s) {
        ringShow();
    } else {
        // rings_g.attr("visibility", d => tsneXScale(d['pos'][i]["lx"]) >= s[0][0]
        // && tsneXScale(d['pos'][i]["lx"]) <= s[1][0]
        // && tsneYScale(d['pos'][i]["ly"]) >= s[0][1]
        // && tsneYScale(d['pos'][i]["ly"]) <= s[1][1] ? "visible" : "hidden");
        ringShow(i, s);
    }
    
}

