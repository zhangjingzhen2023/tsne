d3.json("./data/frame36/fiance_0.6_edge3.json").then(res => {
        data = JSON.parse(res);
        drawScatter(data);
        drawParallel(data);
        drawStackBar(data);
        drawGraphFormData(data);
        drawNodeAttr(data);
        drawGraphStatic(data, currentGraphTag);
    }
);

function dataProcess(data, xScale, yScale) {
    // 模拟排斥力之前记录节点坐标信息
    data = data.map((d, i) => {
        d.lx = d["x"];
        d.ly = d["y"];
        d.id = i;
        return d;
    });
    // 记录每个节点移动的总距离
    data = data.map(d => {
        d["totalMove"] = d3.sum(d["pos"], da => da["move"]);
        return d;
    });
    // 记录是否显示当前节点轨迹
    data.forEach(d => {
        d.showPos = false;
    });
    // 对于 pos 内的数据 模拟排斥力之前记录节点坐标信息
    data.forEach(d => {
        d["pos"] = d["pos"].map(p => {
            p["lx"] = p["x"];
            p["ly"] = p["y"];
            p["x"] = xScale(p["x"]);
            p["y"] = yScale(p["y"]);
            return p;
        });
    });
    // 记录节点是否被过滤，这里平行坐标轴对应的就是平行坐标轴
    data.forEach(d => d["parallelTag"] = true);
    // 记录节点有网络的数目
    data.forEach(d => d["graphNum"] = d["pos"].filter(item => item["edge"] !== 0).length);
    
    // console.log(d3.extent(data, d => d["graphNum"]))
    // console.log(d3.extent(data, d => d["totalMove"]))
    return data;
}