const fs = require("fs");
const cheerio = require("cheerio");

let rawData = [];
let data = [];
let spanishData = []
let frenchData = []
let arabicData = []
let russianData = []

var content = fs.readFileSync("./data/lexicon.txt");
var $ = cheerio.load(content);

// $("div").each(function (i, elem) {
//   if ($(elem).attr("class") == "terms-left") {
//     // // console.log($(elem).html());
//     // console.log('*************')
//     data.push(
//       $(elem).html().replace("\n    <p>", "").replace("</p>\n\n    \n  ", "")
//     );
//   }
// });

// $("div").each(function (i, elem) {
//   if ($(elem).attr("class") == "tab-content current tab-1") {
//     let spanishHead = $(elem).html().search('<p>')
//     let spanishTail = $(elem).html().search('</p>')
//     let spanish = $(elem).html().substring(spanishHead+3, spanishTail);
//     // console.log(spanish);
//     // console.log('*************')


//     spanishData.push(spanish);
//   }
// });


// $("div").each(function (i, elem) {
//   if ($(elem).attr("class") == "tab-content current tab-1") {
//     let frenchHead = $(elem).html().search('<p>')
//     let frenchTail = $(elem).html().search('</p>')
//     let french = $(elem).html().substring(frenchHead+3, frenchTail);
//     // console.log(spanish);
//     // console.log('*************')


//     frenchData.push(french);
//   }
// });

// let frenchJSON = JSON.stringify(frenchData)
// fs.writeFile("./data/french.json", frenchJSON, function (err) {
//   if (err) throw err;
// });


// $("div").each(function (i, elem) {
//   if ($(elem).attr("class") == "tab-content tab-3 rtl") {
//     let arabicHead = $(elem).html().search('<p>')
//     let arabicTail = $(elem).html().search('</p>')
//     let arabic = $(elem).html().substring(arabicHead+3, arabicTail);
//     // console.log(spanish);
//     // console.log('*************')


//     arabicData.push(arabic);
//   }
// });

// console.log(arabicData)

// let arabicJSON = JSON.stringify(arabicData)
// fs.writeFile("./data/arabic.json", arabicJSON, function (err) {
//   if (err) throw err;
// });


$("div").each(function (i, elem) {
  if ($(elem).attr("class") == "tab-content tab-4") {
    let russianHead = $(elem).html().search('<p>')
    let russianTail = $(elem).html().search('</p>')
    let russian = $(elem).html().substring(russianHead+3, russianTail);
    // console.log(spanish);
    // console.log('*************')


    russianData.push(russian);
  }
});

console.log(russianData)

let russianJSON = JSON.stringify(russianData)
fs.writeFile("./data/russian.json", russianJSON, function (err) {
  if (err) throw err;
});

