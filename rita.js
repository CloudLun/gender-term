function processRita(input) {
  // change our input to a Rita string
  let rs = new RiString(input);

  // break our phrase into words:
  let words = rs.words();

  // get part-of-speech tags
  // part-of-speech tags wordsList: https://rednoise.org/rita/reference/RiTa/pos/index.html
  let pos = rs.pos();
  //   console.log(pos);

  let paragraph = d3.select(`#paragraph`);

  // let's go through all words
  words.forEach((word, i) => {
    // let's make one span per word
    let span = paragraph.append("span").text(word);

    for (let i = 0; i < outerCircleDataAtoZ.length; i++) {
      for (let j = 0; j < outerCircleDataAtoZ[i].length; j++) {
        if (
          word
            .toLowerCase()
            .includes(outerCircleDataAtoZ[i][j].node.toLowerCase())
        ) {
          span.attr("class", `${nodesColor[i]}`);
          span.style('background', `${nodesColor[i]}`)

          paragraphData.push(`${nodesColor[i]}`)
        }
      }
    }

    if (!RiTa.isPunctuation(pos[i + 1])) {
      //if the word is a noun, let's attach the class "noun"
      // if (
      //   pos[i] == "nn" ||
      //   pos[i] == "nns" ||
      //   pos[i] == "nnp" ||
      //   pos[i] == "nnps"
      // ) {
      //   span.attr("class", "noun");
      //   //if the word is a verb, attach the class "verb"
      // } else if (pos[i] == "vb") {
      //   span.attr("class", "verb");
      //   //if the word is an adjective, attach the class "adjdctive"
      // } else if (pos[i] == "jj" || pos[i] == "jjr" || pos[i] == "jjs") {
      //   span.attr("class", "adjective");
      // }

      // by placing each word into an array separately we have lost the white spaces, let's add them back
      paragraph.append("span").text(" ");
    }

    // word += " ";
  });
}
