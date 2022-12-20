const numRows = 6;
const numCols = 4;
const paddings = { top: 20, right: 20, bottom: 20, left: 20 };
const charts = document.querySelector(".charts");
const chartWidth = charts.clientWidth;
const chartHeight = charts.clientHeight;

let gridSvg = d3
  .select(".charts")
  .append("svg")
  .attr("class", "gridSvg")
  .attr("width", chartWidth - paddings.right - paddings.left)
  .attr("height", chartHeight - paddings.bottom - paddings.bottom);

const gridSvgNode = document.querySelector(".gridSvg");
const gridSvgWidth = gridSvgNode.clientWidth;
const gridSvgHeight = gridSvgNode.clientHeight;

let gridData = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
let gridCircles = gridSvg.append("g").attr("class", "gridCircles");
let gridOuterCircles = gridSvg.append("g").attr("class", "gridOuterCircles");
let gridTexts = gridSvg.append("g").attr("class", "gridTexts");
let gridRootToBranchLinks = gridSvg
  .append("g")
  .attr("class", "gridRootToBranchLinks");
let gridCirclesPosition = [];
let gridOuterCirclesPosition = [];
let organizedOuterCirclesPosition = [];

for (let i = 0; i < numCols; i++) {
  for (let j = 0; j < numRows; j++) {
    gridCircles
      .append("circle")
      .attr("class", "gridCircle")
      .attr("data-index", `${i * numCols + j}`)
      .attr("cx", (gridSvgWidth / 4) * (i + 1) - gridSvgWidth / 8.25)
      .attr("cy", (gridSvgHeight / 6) * (j + 1) - gridSvgHeight / 12.5)
      .attr("r", 65)
      .attr("fill", nodesColor[i * numRows + j])
      .attr("opacity", "0.06");

    gridTexts
      .append("text")
      .attr("class", "gridText")
      .attr("data-index", `${i * numCols + j}`)
      .attr("x", (gridSvgWidth / 4) * (i + 1) - gridSvgWidth / 30)
      .attr("y", (gridSvgHeight / 6) * (j + 1) - gridSvgHeight / 12.5)
      .attr("color", "#434343")
      .style("font-size", "12px")

      .text(`${alphabets[i * numRows + j]}`);
  }
}
nodesPositionGenerator(gridData, "grid", gridCirclesPosition);

// circlesGenerator(test, "test", gridData, 5, "visible");
d3.json("./data/data.json").then((data) => {
  for (let i = 0; i < alphabets.length; i++) {
    outerCircleDataAtoZ[i] = outerCircleData.filter(
      (d) => d.group === `${alphabets[i]}`
    );
  }

  arcPathGenerator(gridSvg, 65, 65);
  for (let n = 0; n < 24; n++) {
    gridOuterCircles
      .append("g")
      .attr("class", `gridOuterCircles`)
      .selectAll(`gridOuterCircles`)
      .data(outerCircleDataAtoZ[n])
      .enter()
      .append("circle")
      .attr("class", `gridOuterCircle`)
      .attr("data-index", (d, i) => `${i}`)
      .attr(
        "cx",
        (d, i) =>
          path
            .node()
            .getPointAtLength(
              (totalLength / outerCircleDataAtoZ[n].length / 2) * i
            ).x + gridCirclesPosition[n][0]
      )
      .attr(
        "cy",
        (d, i) =>
          path
            .node()
            .getPointAtLength(
              (totalLength / outerCircleDataAtoZ[n].length / 2) * i
            ).y + gridCirclesPosition[n][1]
      )
      .attr("r", 1)
      .attr("fill", nodesColor[n])
      .attr("visibility", "hidden");
  }
  nodesPositionGenerator(
    outerCircleData,
    "gridOuter",
    gridOuterCirclesPosition
  );

  console.log(outerCircleDataAtoZ);
  console.log(gridOuterCirclesPosition);

  let l = 0;
  for (let i = 0; i < outerCircleDataAtoZ.length; i++) {
    for (let j = 0; j < outerCircleDataAtoZ[i].length; j++) {
      gridRootToBranchLinks
        .append("path")
        .attr("class", "gridRootToBranchLink")
        .attr("data-index", `${outerCircleDataAtoZ[i][j]["node"]}`)
        .attr("d", (d) => {
          let dx =
              gridOuterCirclesPosition[j + l][0] - gridCirclesPosition[i][0],
            dy = gridOuterCirclesPosition[j + l][1] - gridCirclesPosition[i][1];
          dr = Math.sqrt(dx * dx + dy * dy);
          return (
            "M" +
            gridCirclesPosition[i][0] +
            "," +
            gridCirclesPosition[i][1] +
            "A" +
            dr +
            "," +
            dr +
            " 0 0,1 " +
            gridOuterCirclesPosition[j + l][0] +
            "," +
            gridOuterCirclesPosition[j + l][1]
          );
        })
        .attr("stroke", nodesColor[i])
        .attr("fill", "none")
        .style("opacity", 1)
        .on("mouseover", (e, d) => {
          content = `${outerCircleDataAtoZ[i][j]["node"]}`;
          tooltip.html(content).style("visibility", "visible");
        })
        .on("mousemove", (e, d) => {
          tooltip
            .style("top", e.pageY - (tooltip.node().clientHeight + 5) + "px")
            .style("left", e.pageX - tooltip.node().clientWidth / 2.0 + "px");
        })
        .on("mouseout", (e, d) => {
          tooltip.style("visibility", "hidden");
        })
        .transition()
        .duration(800)
        .attrTween("stroke-dasharray", function () {
          var len = this.getTotalLength();
          return function (t) {
            return d3.interpolateString("0," + len, len + ",0")(t);
          };
        });
    }
    l += outerCircleDataAtoZ[i].length;
  }

  const gridRootToBranchLink = document.querySelectorAll(
    ".gridRootToBranchLink"
  );

  let input = document.querySelector("input");
  let checkList = [];

  input.addEventListener("keyup", (event) => {
    const alert = document.querySelector('#alert')
    if (event.key === "Enter") {
      termLinksFilter(input.value.toLocaleLowerCase());
      if(checkList.length === 0){
        alert.classList.remove('none')
      }else {
        alert.classList.add('none')
      }
    }
    checkList =[]
  });
  function termLinksFilter(term) {
    for (let i = 0; i < gridRootToBranchLink.length; i++) {
      if (
        gridRootToBranchLink[i].attributes["data-index"].value
          .toLowerCase()
          .includes(term)
      ) {
        checkList.push(
          gridRootToBranchLink[i].attributes["data-index"].value
            .toLowerCase()
            .includes(term)
        );
        gridRootToBranchLink[i].style.opacity = 1;
      } else {
        gridRootToBranchLink[i].style.opacity = 0.1;
      }
    }
  }
});
