import * as fs from "fs";

const data = fs.readFileSync("input.txt", "utf8");

const start = Date.now();

const logs: string[] = [];

execute(data.split("\r\n"));
// execute(["l", "i", "g", "h", "t", "ligh", "light", "li", "gh"]);
// execute(["foo", "bar", "foobar", "barfoo", "other", "o", "fo"]);

const end = Date.now();

console.log(logs);

console.log("done in", end - start, "ms", "with", logs.length, "results");

function execute(words: string[]) {
  // Sort by length because a bigger word can't be a substring of a smaller word
  const sortedData = [...new Set(words)].sort((a, b) => b.length - a.length);

  const maxLength = sortedData[0].length;

  // Group by length
  const groupedData = sortedData.reduce((acc, word) => {
    if (!acc[word.length]) {
      acc[word.length] = [];
    }
    acc[word.length].push(word);
    return acc;
  }, {} as Record<number, string[]>);

  // recursiveFind("light", []);

  // loop over each group of words with the same length
  for (let i = maxLength; i > 1; i--) {
    const words = groupedData[i];

    if (!words) {
      continue;
    }

    // Loop over each word
    for (let j = 0; j < words.length; j++) {
      const word = words[j];

      recursiveFind(word, []);
    }
  }

  function recursiveFind(word: string, result: string[] = []) {
    const guessedLength = result.join("").length;
    const remainingLength = word.length - guessedLength;
    const remainingWord = word.slice(guessedLength);

    if (remainingLength === 0) {
      logs.push(`${word}=${result.join("+")}`);
      return;
    }

    // Don't allow the word to match itself
    const maxLength = result.length ? remainingLength : remainingLength - 1;

    // Loop over each group of words
    for (let k = maxLength; k > 0; k--) {
      const smallerWords = groupedData[k];

      if (!smallerWords?.length) {
        continue;
      }

      // Loop over each smaller word
      for (let l = 0; l < smallerWords.length; l++) {
        const smallerWord = smallerWords[l];

        if (remainingWord.indexOf(smallerWord) === 0) {
          // Add word to result and find on the rest of the word
          recursiveFind(word, [...result, smallerWord]);
        }
      }
    }
  }
}
