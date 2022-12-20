const width = window.innerWidth;
const height = window.innerHeight;
const margin = { left: 50, right: 0, top: 65, bottom: 0 };

const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

let nodes = [];
let structuredNodes = [];

let svg = d3
  .select("#viz")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let roots = svg.append("g").attr("class", "roots");
let stems = svg.append("g").attr("class", "stems");
let branches = svg.append("g").attr("class", "branches");
let leaves = svg.append("g").attr("class", "leaves");
let center = svg.append("g").attr("class", "center");

let linkstoRoots = roots.append("g").attr("class", "linkstoRoots");
let linkstoStems = stems.append("g").attr("class", "linkstoStems");
let linkstobranches = branches.append("g").attr("class", "branchesLinks");

let centerPosition = [width / 2, height / 2];
let rootsPosition = [];
let stemsPosition = [];
let branchesPosition = [];

let linkstoRootsList = [];
let linkstoStemsList = [];
let linkstobranchesList = [];

let path;
let totalLength;
let points;

let pi = Math.PI;

let stemsData = [];
let branchesData = [];

for (let i = 0; i < 78; i++) {
  stemsData.push(1);
}

for (let i = 0; i < 672; i++) {
  branchesData.push(1);
}

// NODES
let nodesInfo = [
  [630, 145, "#f44336"],
  [900, 80, "#e81e63"],
  [1080, 100, "#9c27b0"],
  [1200, 145, "#673ab7"],
  [1070, 300, "#3f51b5"],
  [1020, 420, "#2196f3"],
  [1000, 520, "#03a9f4"],
  [720, 600, "#00bcd4"],
  [420, 480, "#009688"],
  [170, 420, "#4caf50"],
  [540, 300, "#8bc34a"],
  [300, 300, "#cddc39"],
  [480, 150, "#ffeb3b"],
  [830, 600, "#ffc107"],
  [565, 500, "#ff9800"],
  //   [700, 250, "#ff5722"],
  //   [442, 50, "#795548"],
  //   [581, 625, "#607d8b"],
  //   [776, 445, "#accea1"],
  //   [763, 175, "#d8b9ff"],
];
console.log(nodesInfo.length);
let nodesPosition = [];

d3.csv("./data/data.csv").then((data) => {
  nodesGenerator(data);
  console.log("This is nodes data");
  console.log(nodes);
  center
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 6)
    .style("z-index", 3)
    .attr("transform", `translate(${centerPosition[0]}, ${centerPosition[1]})`)
    .style("fill", "orange")
    .style("opacity", 0);

  for (let i = 0; i < nodesInfo.length; i++) {
    circlesGenerator(
      roots,
      "roots",
      nodesInfo[i][0],
      nodesInfo[i][1],
      nodesInfo[i][2]
    );
  }
  centerToRootsLinks();

  //   , 18, 19, 20, 21, 22
  let n = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 17];
  for (let i = 0; i < nodesInfo.length; i++) {
    arcPathGenerator(55, 55, -pi, pi, nodesInfo[i]);
    layersGenerator(stems, "stems", nodes[n[i]], nodesInfo[i], 0, 0, 1.5, 0);
  }

  nodesPositionGenerator(n, "stems");
  console.log("This is nodePosition data");
  console.log(nodesPosition);

  stemsToNodesLinks();

  // arcPathGenerator(80, 80, -pi, pi, centerPosition);
  // layersGenerator(roots, "roots", nodes, centerPosition, 0, 0, 1);
  // positionGenerator(nodes, rootsPosition, "roots");
  // centerToRootsLinks();

  //   arcPathGenerator(160, 160, -pi, pi, centerPosition);
  //   layersGenerator(stems, "stems", stemsData, centerPosition, 0, 0, 2);
  //   positionGenerator(stemsData, stemsPosition, "stems");
  //   rootsToStemsLinks();

  //   arcPathGenerator(250, 250, -pi, pi, centerPosition);
  //   layersGenerator(
  //     branches,
  //     "branches",
  //     branchesData,
  //     centerPosition,
  //     0,
  //     0,
  //     1
  //   );
});

function nodesGenerator(data) {
  for (let i = 0; i < alphabets.length; i++) {
    nodes[i] = [];
    for (let j = 0; j < data.length; j++) {
      if (`${data[j]["terms"][0]}` === alphabets[i]) {
        nodes[i].push(data[j]["terms"]);
      }
    }
  }
  nodes = nodes.filter((d) => d.length > 0);

  for (let i = 0; i < nodes.length; i++) {
    structuredNodes[i] = [];
    for (let j = 0; j < parseInt(nodes[i].length / 10) + 1; j++) {
      structuredNodes[i][j] = [];
    }
    let layers = parseInt(nodes[i].length / 10);
    let last = nodes[i].length % 10;
    for (let k = 0; k < layers; k++) {
      for (let l = 0; l < 10; l++) {
        structuredNodes[i][k].push(nodes[i][l + k * 10]);
      }
    }
    for (let m = 0; m < last; m++) {
      structuredNodes[i][layers].push(nodes[i][layers + m]);
    }

    for (let n = 0; n < structuredNodes[i].length; n++) {
      structuredNodes[i] = structuredNodes[i].filter((d) => d.length > 0);
    }
  }
  console.log("This is structuredNodes data");
  console.log(structuredNodes);
}

function circlesGenerator(elements, name, x, y, z) {
  elements
    .append("g")
    .attr("class", `${name}Circles`)
    .append("circle")
    .attr("cx", `${x}`)
    .attr("cy", `${y}`)
    .attr("fill", "#2d2d2d")
    .attr("r", 3)
    .style("opacity", "0");
}

function arcGenerator(i, o, s, e) {
  return d3.arc().innerRadius(i).outerRadius(o).startAngle(s).endAngle(e);
}

function arcPathGenerator(i, o, s, e, coordinates) {
  path = svg
    .append("path")
    .attr("d", arcGenerator(i, o, s, e))
    .attr("transform", `translate(${coordinates[0]}, ${coordinates[1]})`);
  totalLength = path.node().getTotalLength();
}

function layersGenerator(elements, name, data, coordinates, x, y, r, opacity) {
  elements
    .append("g")
    .attr("class", `${name}Circles`)
    .selectAll(`${name}Circles`)
    .data(data)
    .enter()
    .append("circle")
    .attr("class", `${name}Circle`)
    .attr("data-index", (d, i) => `${i}`)
    .attr(
      "cx",
      (d, i) =>
        path.node().getPointAtLength((totalLength / data.length / 2) * i).x +
        coordinates[0] +
        x
    )
    .attr(
      "cy",
      (d, i) =>
        path.node().getPointAtLength((totalLength / data.length / 2) * i).y +
        coordinates[1] +
        y
    )
    .attr("r", r)
    .style("opacity", opacity);
}

function positionGenerator(data, position, name) {
  for (let i = 0; i < data.length; i++) {
    position.push([
      +document.querySelectorAll(`.${name}Circle`)[i].attributes.cx.value,
      +document.querySelectorAll(`.${name}Circle`)[i].attributes.cy.value,
    ]);
  }
}

function centerToRootsLinks() {
  for (let i = 0; i < nodesInfo.length; i++) {
    linkstoRootsList.push(
      d3.linkHorizontal()({
        source: centerPosition,
        target: nodesInfo[i],
      })
    );
    //   for (let i = 0; i < rootsPosition.length; i++) {
    //     linkstoRootsList.push(
    //       d3.linkHorizontal()({
    //         source: centerPosition,
    //         target: rootsPosition[i],
    //       })
    //     );

    linkstoRoots
      .append("line")
      .attr("class", "rootsLink")
      // .attr("d", linkstoRootsList[i])
      .attr("x1", centerPosition[0])
      .attr("y1", centerPosition[1])
      .attr("x2", nodesInfo[i][0])
      .attr("y2", nodesInfo[i][1])
      .attr("stroke", "#2d2d2d")
      .attr("fill", "none")
      .style("opacity", 0.5);
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * max) + min;
}

// NODES
function nodesPositionGenerator(n, name) {
  let counts = 0;
  for (let i = 0; i < n.length; i++) {
    nodesPosition[i] = [];
    for (let j = 0; j < nodes[n[i]].length; j++) {
      nodesPosition[i].push([
        +document.querySelectorAll(`.${name}Circle`)[counts + j].attributes.cx
          .value,
        +document.querySelectorAll(`.${name}Circle`)[counts + j].attributes.cy
          .value,
      ]);
    }
    counts += nodes[n[i]].length;
  }
}

function stemsToNodesLinks() {
  for (let i = 0; i < nodesInfo.length; i++) {
    for (let j = 0; j < nodesPosition[i].length; j++) {
      linkstoStems
        .append("line")
        .attr("class", "stemslink")
        .attr("x1", nodesInfo[i][0])
        .attr("y1", nodesInfo[i][1])
        .attr("x2", nodesPosition[i][j][0])
        .attr("y2", nodesPosition[i][j][1])
        .attr("stroke", nodesInfo[i][2])
        .attr("fill", "none")
        .style("opacity", 0.8);
    }
    // for (let j = 0; j < nodesPosition[1].length; j++) {
    //     linkstoStems
    //       .append("line")
    //       .attr("class", "stemslink")
    //       .attr("x1",  nodesInfo[1][0])
    //       .attr("y1",  nodesInfo[1][1])
    //       .attr("x2", nodesPosition[1][][0])
    //       .attr("y2", nodesPosition[1][j][1])
    //       .attr("stroke", "black")
    //       .attr("fill", "none");
    //   }
  }
}
// function rootsToStemsLinks() {
//     let m = 0;
//     let n = 0;
//     for (let i = 0; i < nodes.length; i++) {
//       for (let j = 0; j < structuredNodes[i].length; j++) {
//         linkstoStemsList.push(
//           d3.linkHorizontal()({
//             source: rootsPosition[i],
//             target: stemsPosition[m + j],
//           })
//         );
//       }
//       m += structuredNodes[i].length;
//     }
//     for (let i = 0; i < stemsData.length; i++) {
//       linkstoStems
//         .append("path")
//         .attr("class", "stemslink")
//         .attr("d", linkstoStemsList[i])
//         .attr("stroke", "black")
//         .attr("fill", "none");
//     }
// }
