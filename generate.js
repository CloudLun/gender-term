
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

let structuredData = [];
let networkData = {
  nodes: [],
  links: [],
};

d3.csv("./data/data.csv").then((data) => {
  dataStructuerdGenerator(data, structuredData);
  console.log("This is struturedData");
  console.log(structuredData);

  nodesGenerator();
  console.log("This are nodes");
  console.log(networkData["nodes"]);

  linksGenerator()
  console.log('This are links')
  console.log(networkData['links'])



});

function dataStructuerdGenerator(data, array) {
  for (let i = 0; i < alphabets.length; i++) {
    array[i] = [];
    for (let j = 0; j < data.length; j++) {
      if (`${data[j]["terms"][0]}` === alphabets[i]) {
        array[i].push(data[j]["terms"]);
      }
    }
  }
}

function nodesGenerator() {
  for (let i = 0; i < alphabets.length; i++) {
    networkData["nodes"][i] = {
      node: alphabets[i],
      group: alphabets[i],
    };
  }
  for (let i = 0; i < structuredData.length; i++) {
    for (let j = 0; j < structuredData[i].length; j++) {
      networkData["nodes"].push({
        node: structuredData[i][j],
        group: alphabets[i],
      });
    }
  }
}

function linksGenerator() {
  for (let i = 0; i < structuredData.length; i++) {
    for (let j = 0; j < structuredData[i].length; j++) {
      networkData["links"].push({
        source: alphabets[i],
        target: structuredData[i][j],
      });
    }
  }
}
