let nodeAttrWidth = document.querySelector("#nodeAttr").offsetWidth;
let nodeAttrHeight = document.querySelector("#nodeAttr").offsetHeight;
// let nodeAttrMargin = {
//     top:20,
//     right:20,
//     bottom:20,
//     left:20
// }
//
// let nodeAttrClipWidth = nodeAttrWidth - nodeAttrMargin.left - nodeAttrMargin.right;
// let nodeAttrClipHeight = nodeAttrHeight - nodeAttrMargin.top - nodeAttrMargin.bottom;
//
// const nodeAttrSvg = d3.select("#nodeAttr_svg")
//     .attr("width", nodeAttrWidth)
//     .attr("height", nodeAttrHeight);
//
// const nodeAttr_g = nodeAttrSvg.append("g")
//     .attr("transform", `translate(${nodeAttrMargin.left}, ${nodeAttrMargin.top})`);

let nodeAttrDom = document.getElementById('nodeAttr');
let nodeAttrChart = echarts.init(nodeAttrDom);
let nodeAttrOption;
nodeAttrOption = {
    color: [
        '#2f4554', '#d9c113'
    ],
    grid: {
        left: '10px',
        right: '10px',
        bottom: '10px',
    },
    tooltip:{
        show:true
    },
    radar: {
        // shape: 'circle',
        indicator: [
            { name: 'register_amt', max: 1 },
            { name: 'penalty', max: 1 },
            { name: 'employee', max: 1 },
            { name: 'graphNum', max: 1 },
            { name: 'encouraged', max: 1 },
            { name: 'high_tech', max: 1 },
            { name: 'nation_important', max: 1 }
        ],
        // axisTick: {
        //     show: false,
        //     alignWithLabel: false
        // },
    },
    series: [
        {
            name: 'select vs avg',
            type: 'radar',
            data: [
                {
                    value: [1, 1, 1, 1, 1, 1, 1],
                    name: 'Average Value'
                },
                {
                    value: [],
                    name: 'Select Value'
                }
            ]
        }
    ]
};
function drawNodeAttr(data) {
    nodeAttrOption["radar"]["indicator"][0]["max"] = d3.mean(data, d => d["register_amt"]/10000) * 2;
    nodeAttrOption["radar"]["indicator"][1]["max"] = d3.mean(data, d => d["penalty"]/10000) * 2;
    nodeAttrOption["radar"]["indicator"][2]["max"] = d3.mean(data, d => d["employee_number"]) * 2;
    nodeAttrOption["radar"]["indicator"][3]["max"] = d3.mean(data, d => d["graphNum"]) * 2;
    nodeAttrOption["radar"]["indicator"][4]["max"] = data.filter(d => d[nodeAttrPercent[0]] === 1).length/data.length * 2;
    nodeAttrOption["radar"]["indicator"][5]["max"] = data.filter(d => d[nodeAttrPercent[1]] === 1).length/data.length * 2;
    nodeAttrOption["radar"]["indicator"][6]["max"] = data.filter(d => d[nodeAttrPercent[2]] === 1).length/data.length * 2;
    let avgValue = [];
    nodeAttrValues.forEach((n,i) => i < 2 ? avgValue.push(d3.mean(data, d => d[n]/10000))
        : avgValue.push(d3.mean(data, d => d[n])))
    nodeAttrPercent.forEach(n => avgValue.push(data.filter(d => d[n] === 1).length/data.length))
    nodeAttrOption["series"][0]["data"][0]["value"] = avgValue
    nodeAttrOption && nodeAttrChart.setOption(nodeAttrOption);
}

function redrawNodeAttr(data) {
    if (data){
        let avgValue = [];
        nodeAttrValues.forEach((n,i) => i < 2 ? avgValue.push(d3.mean(data, d => d[n]/10000))
            : avgValue.push(d3.mean(data, d => d[n])))
        nodeAttrPercent.forEach(n => avgValue.push(data.filter(d => d[n] === 1).length/data.length))
        nodeAttrOption["series"][0]["data"][1]["value"] = avgValue
        nodeAttrOption && nodeAttrChart.setOption(nodeAttrOption);
    }else {
        nodeAttrOption["series"][0]["data"][1]["value"] = []
        nodeAttrOption && nodeAttrChart.setOption(nodeAttrOption);
    }
}
