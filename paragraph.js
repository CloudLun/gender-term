const graph = document.querySelector(".graph");
const graphWidth = graph.clientWidth;
const graphHeight = graph.clientHeight;

const paragraphContainer = document.querySelector(".paragraph");
const textarea = document.querySelector("textarea");
const paragraph = document.querySelector("#paragraph");
const closeIcon = document.querySelector(".close");

let paragraphData = [];
let paragraphPosition = [];

let graphSvg = d3
  .select(".graph")
  .append("svg")
  .attr("class", "graph")
  .attr("width", graphWidth)
  .attr("height", graphHeight);

centerCircleGenerator();

textarea.addEventListener("keyup", (event) => {
  graphSvg.selectAll(`*`).remove();
  paragraph.innerHTML = "";
  centerCircleGenerator()

  if (event.key === "Enter") {
    processRita(textarea.value);
    textarea.classList.add("none");
    paragraph.classList.remove("none");
    closeIcon.classList.remove("none");


    arcPathGenerator(svg, 240, 240);
    paragraphCirclesGenerator(graphSvg, "graph", paragraphData, 4, "visible");
    nodesPositionGenerator(paragraphData, "graph", paragraphPosition);
    paragraphCircleLinksgenerator();
    paragraphData = [];
  }
});

paragraphContainer.addEventListener("click", (event) => {
  target = event.target;
  if (target.classList.contains("close")) {
    paragraph.classList.add("none");
    closeIcon.classList.add("none");
    textarea.classList.remove("none");
  }
});

function centerCircleGenerator() {
  graphSvg
    .append("circle")
    .attr("class", "centerCircle")
    .attr("cx", graphWidth / 2)
    .attr("cy", graphHeight / 2)
    .attr("r", 240)
    .attr("fill", "#f4f4f4")
    .attr("opacity", 0.5);
}

function paragraphCirclesGenerator(elements, name, data, r, visibility) {
  elements
    .append("g")
    .attr("class", `${name}Circles`)
    .selectAll(`${name}Circles`)
    .exit()
    .remove()
    .data(data)
    .enter()
    .append("circle")
    .attr("class", `${name}Circle`)
    .attr("data-index", (d, i) => `${i}`)
    .attr(
      "cx",
      (d, i) =>
        path.node().getPointAtLength((totalLength / data.length / 2) * i).x +
        width / 4
    )
    .attr(
      "cy",
      (d, i) =>
        path.node().getPointAtLength((totalLength / data.length / 2) * i).y +
        height / 2
    )
    .attr("r", r)
    .attr("fill", (d, i) => d)
    .attr("visibility", visibility)
    .attr("opacity", 1);
}

function paragraphCircleLinksgenerator() {
  graphSvg
    .selectAll("paragraphCircleLinks")
    .exit()
    .remove()
    .data(paragraphData)
    .enter()
    .append("path")
    .attr("class", "paragraphCircleLinks")
    .attr("data-index", (d, i) => `${i}`)
    .attr("fill", "none")
    .attr("stroke", (d) => d)
    .attr("d", (d, i) => {
      let dx = paragraphPosition[i][0] - graphWidth / 2,
        dy = paragraphPosition[i][1] - graphHeight / 2;
      dr = Math.sqrt(dx * dx + dy * dy);
      return (
        "M" +
        graphWidth / 2 +
        "," +
        graphHeight / 2 +
        "A" +
        dr +
        "," +
        dr +
        " 0 0,1 " +
        paragraphPosition[i][0] +
        "," +
        paragraphPosition[i][1]
      );
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
