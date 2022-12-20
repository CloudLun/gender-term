// npm install axios
// mkdir data

const fs = require("fs");
const axios = require("axios");

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
const pages = [
  1, 0, 2, 0, 1, 1, 5, 1, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 3, 0, 2, 0, 2, 0, 0, 0,
];
let data = [];

for (let i = 0; i < 26; i++) {
  data.push = [];
}

for (let i = 0; i < 26; i++) {
  for (let j = 0; j < pages[i] + 1; j++) {
    axios
      .get(
        pages[i] === 0
          ? `https://www.unwomen.org/en/digital-library/genderterm?title=&custom_az_filter=${alphabets[i]}`
          : `https://www.unwomen.org/en/digital-library/genderterm?title=&custom_az_filter=${alphabets[i]}&page=${j}`
      )
      .then((res) => {
        // console.log(`statusCode: ${res.status}`);
        // console.log(res.data);
        fs.appendFileSync("./data/lexicon.txt", res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
