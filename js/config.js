let data;

let startIndex = 1;
let endIndex = 35;
const innerR = 3;
const outerR = 10;

// 平行坐标轴中被过滤掉的边的颜色
const deselectedColor = "#ddd";
const deselectedOpacity = 0.2;

// 记录被选中的节点, 平行坐标轴
const selected = [];

//stackBar 内环半径
const stackInnerR = 10;
// 主视图 brush刷中的数据
let brushData = null;

// 力导向图对象的网络数据
let forceNodesId = [];
let forceNodes = [];
let forceEdges = [];
let forceNodeSize = 5;

// 节点属性雷达图
const nodeAttrValues = ["register_amt", "penalty", "employee_number", "graphNum"];
const nodeAttrPercent = ["encouraged_flag", "high_tech_flag", "nation_important_flag"];

let currentGraphTag = "degree_out";

// 需要调整的数值
const totalMoveMax = 8;
const graphNumMax = 16;

let totalMoveSelectMin = 0;
let totalMoveSelectMax = totalMoveMax;

let graphNumSelectMin = 0;
let graphNumSelectMax = graphNumMax;
// 主图每个图元的内径和外径大小
const scatterInnerR = 2;
const scatterOuterR = 20;