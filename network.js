const width = window.innerWidth;
const height = window.innerHeight;
const margin = { left: 150, right: 0, top: 150, bottom: 0 };
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
  "Z",
];
const nodesColor = [
  "#f44336",
  "#e81e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
  "#accea1",
  "#d8b9ff",
  "#e34262",
  "#ccccff",
  "#94683e",
  "#ffcf40",
  "#ff6ac2",
  "#359189",
];

const tooltip = d3.select("body").append("div").attr("class", "tooltip");
const term = d3.select(".term");

let svg = d3
  .select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let rootToBranchLinks = svg.append("g").attr("class", "rootToBranch");
let rootToBranchLinksList = [];

let inner = svg.append("g").attr("class", "inner");
let outer = svg.append("g").attr("class", "outer");
let branch = svg.append("g").attr("class", "branch");

let nodesData;
let innerCircleData;
let outerCircleData;
let outerCircleDataAtoZ = [];

let innerPosition = [];
let outerPosition = [];

let circles;
let innerCircles;
let outerCircles;

let path;
let totalLength;

d3.json("./data/data.json").then((data) => {
  dataProcessor(data);

  // console.log("This is nodes data");
  // console.log(nodesData);

  innerCircleData = nodesData.filter((d) => d.type === "inner");
  outerCircleData = nodesData.filter((d) => d.type === "outer");
  console.log(innerCircleData);
  for (let i = 0; i < alphabets.length; i++) {
    outerCircleDataAtoZ[i] = outerCircleData.filter(
      (d) => d.group === `${alphabets[i]}`
    );
  }

  console.log("This is circle data grouped by alphabets");
  console.log(outerCircleDataAtoZ);

  // H
  arcPathGenerator(svg, 120, 120);
  circlesGenerator(inner, "inner", innerCircleData, 8, "visible");
  innerCircles = document.querySelectorAll(".innerCircle");
  nodesPositionGenerator(innerCircleData, "inner", innerPosition);

  let innerContainer = document.querySelector(".innerCircles");
  let selected = document.querySelector(".selected");
  innerContainer.addEventListener("click", (event) => {
    let target = event.target;
    arcPathGenerator(svg, 360, 360);
    branchCirclesGenerator(event.target.attributes["data-index"].value);
    for (let i = 0; i < innerCircles.length; i++) {
      innerCircles[i].attributes["opacity"].value = 1;
      if (
        target.attributes["data-group"].value !==
        innerCircles[i].attributes["data-group"].value
      ) {
        innerCircles[i].attributes["opacity"].value = 0.3;
      }
    }
  });

  function branchCirclesGenerator(index) {
    rootToBranchLinks.selectAll(".rootToBranchLink").remove();
    outer.selectAll(".outerCircle").remove();
    branch.selectAll(".branchCircle").remove();
    outerPosition = [];

    circlesGenerator(outer, "outer", outerCircleDataAtoZ[index], 3, "hidden");
    outerCircles = document.querySelectorAll(".outerCircle");
    nodesPositionGenerator(outerCircleDataAtoZ[index], "outer", outerPosition);
    centerToRootsLinks(index);

    branch
      .append("g")
      .attr("class", "branchCircles")
      .selectAll("branchCircles")
      .data(outerCircleDataAtoZ[index])
      .enter()
      .append("circle")
      .attr("class", "branchCircle")
      .attr("data-content", (d, i) => outerCircleDataAtoZ[index][i]["node"])
      .attr("cx", (d, i) => innerPosition[index][0])
      .attr("cy", (d, i) => innerPosition[index][1])
      .attr("r", "4.5px")
      .attr("fill", nodesColor[index])
      .on("mouseover", (e, d) => {
        content = `${d.node}`;
        tooltip.html(content).style("visibility", "visible");
        // term.html(content);
      })
      .on("mousemove", (e, d) => {
        tooltip
          .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
          .style("left", e.pageX - tooltip.node().clientWidth / 2.0 + "px");
      })
      .on("mouseout", (e, d) => {
        tooltip.style("visibility", "hidden");
        // term.html("Gender Term").style("text-transform", "capitalize");
      })
      .transition()
      .duration(600)
      .attr("transform", (d, i) => {
        if (
          innerPosition[index][0] > outerPosition[i][0] &&
          innerPosition[index][1] > outerPosition[i][1]
        ) {
          return `translate( ${
            outerPosition[i][0] - innerPosition[index][0]
          } , ${outerPosition[i][1] - innerPosition[index][1]})`;
        }
        if (
          innerPosition[index][0] > outerPosition[i][0] &&
          innerPosition[index][1] < outerPosition[i][1]
        ) {
          return `translate( ${
            outerPosition[i][0] - innerPosition[index][0]
          } , ${Math.abs(outerPosition[i][1] - innerPosition[index][1])})`;
        }
        if (
          innerPosition[index][0] < outerPosition[i][0] &&
          innerPosition[index][1] < outerPosition[i][1]
        ) {
          return `translate( ${Math.abs(
            outerPosition[i][0] - innerPosition[index][0]
          )} , ${Math.abs(outerPosition[i][1] - innerPosition[index][1])})`;
        }
        if (
          innerPosition[index][0] < outerPosition[i][0] &&
          innerPosition[index][1] > outerPosition[i][1]
        ) {
          return `translate( ${Math.abs(
            outerPosition[i][0] - innerPosition[index][0]
          )} , ${outerPosition[i][1] - innerPosition[index][1]})`;
        }
      });
    // .attr("visibility", 'hidden');
  }

  // console.log("This is inner position");
  // console.log(innerPosition);
  // console.log("This is outer position");
  // console.log(outerPosition);
});

function dataProcessor(data) {
  for (let i = 0; i < data["nodes"].length; i++) {
    i < 24
      ? (data["nodes"][i]["type"] = "inner")
      : (data["nodes"][i]["type"] = "outer");

    for (let j = 0; j < alphabets.length; j++) {
      if (data["nodes"][i].group === alphabets[j]) {
        data["nodes"][i].color = nodesColor[j];
      }
    }
  }
  nodesData = data.nodes;
}


// H
function arcGenerator(i, o) {
  return d3
    .arc()
    .innerRadius(i)
    .outerRadius(o)
    .startAngle(Math.PI)
    .endAngle(-Math.PI);
}
// H
function arcPathGenerator(svg, i, o) {
  path = svg.append("path").attr("d", arcGenerator(i, o));
  totalLength = path.node().getTotalLength();
}
// H
function circlesGenerator(elements, name, data, r, visibility) {
  elements
    .append("g")
    .attr("class", `${name}Circles`)
    .selectAll(`${name}Circles`)
    .data(data)
    .enter()
    .append("circle")
    .attr("class", `${name}Circle`)
    .attr("data-index", (d, i) => `${i}`)
    .attr("data-group", (d) => d.group)
    .attr("data-content", (d) => d.node)
    .attr(
      "cx",
      (d, i) =>
        path.node().getPointAtLength((totalLength / data.length / 2) * i).x +
        width / 2
    )
    .attr(
      "cy",
      (d, i) =>
        path.node().getPointAtLength((totalLength / data.length / 2) * i).y +
        height / 1.8
    )
    .attr("r", r)
    .attr("fill", (d) => d.color)
    .attr("visibility", visibility)
    .attr("opacity", 1)
    .on("mouseover", (e, d) => {
      content = `${d.node}`;
      tooltip.html(content).style("visibility", "visible");
    })
    .on("mousemove", (e, d) => {
      tooltip
        .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
        .style("left", e.pageX - tooltip.node().clientWidth / 2.0 + "px");
    })
    .on("mouseout", (e, d) => {
      tooltip.style("visibility", "hidden");
      // term.html("Gender Term");
    });
}
// H
function nodesPositionGenerator(nodes, name, list) {
  for (let i = 0; i < nodes.length; i++) {
    list[i] = [
      +document.querySelectorAll(`.${name}Circle`)[i].attributes.cx.value,
      +document.querySelectorAll(`.${name}Circle`)[i].attributes.cy.value,
    ];
  }
}
// H
function centerToRootsLinks(index) {
  for (let i = 0; i < outerPosition.length; i++) {
    rootToBranchLinks
      .append("path")
      .attr("class", "rootToBranchLink")
      .attr("d", (d) => {
        let dx = outerPosition[i][0] - innerPosition[index][0],
          dy = outerPosition[i][1] - innerPosition[index][1];
        dr = Math.sqrt(dx * dx + dy * dy);
        return (
          "M" +
          innerPosition[index][0] +
          "," +
          innerPosition[index][1] +
          "A" +
          dr +
          "," +
          dr +
          " 0 0,1 " +
          outerPosition[i][0] +
          "," +
          outerPosition[i][1]
        );
      })
      .attr("stroke", nodesColor[index])
      .attr("fill", "none")
      .style("opacity", 0.6)
      .transition()
      .duration(800)
      .attrTween("stroke-dasharray", function () {
        var len = this.getTotalLength();
        return function (t) {
          return d3.interpolateString("0," + len, len + ",0")(t);
        };
      });
    // .append("line")
    // .attr("class", "rootToBranchLink")
    // .attr("x1", innerPosition[0][0])
    // .attr("y1", innerPosition[0][1])
    // .attr("x2", outerPosition[i][0])
    // .attr("y2", outerPosition[i][1])
    // .attr("stroke", "#2d2d2d")
    // .attr("fill", "none")
    // .style("opacity", 0.5);
  }
}
