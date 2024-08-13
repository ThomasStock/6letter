import * as fs from "fs";

const data = fs.readFileSync("input.txt", "utf8");

const start = Date.now();

const logs: string[] = [];

execute(data.split("\r\n"));

const end = Date.now();

// console.log(logs);

console.log("done in", end - start, "ms", "with", logs.length, "results");

function execute(words: string[], length = 6) {
  // Remove duplicates and sort by length because a bigger word can't be a substring of a smaller word
  const sortedData = [...new Set(words)];

  // Group by length to be able to exclude words that are too long while searching
  const groupedData = sortedData.reduce((acc, word) => {
    if (!acc[word.length]) {
      acc[word.length] = [];
    }
    acc[word.length].push(word);
    return acc;
  }, {} as Record<number, string[]>);

  // Loop over each word in the desired length
  for (let word of groupedData[length]) {
    recursiveFind(word, []);
  }

  // Example to follow along: recursiveFind("foobar", ["fo","ob"])
  function recursiveFind(word: string, result: string[] = []) {
    const guessedLength = result.join("").length; // fo+ob = 4
    const remainingLength = word.length - guessedLength; // "foobar".length - 4 = 2
    const remainingWord = word.slice(guessedLength); // "ar"

    if (remainingLength === 0) {
      logs.push(`${word}=${result.join("+")}`);
      return;
    }

    // We can search for words with max length 2
    const maxLength = result.length ? remainingLength : remainingLength - 1;

    // Loop over words with 2,1 letters
    for (let n = maxLength; n > 0; n--) {
      // Example: words with 1 letter like ["a", "b", "c"]
      const wordsWithNLetters = groupedData[n] ?? [];

      for (let smallerWord of wordsWithNLetters) {
        // Example: "a"
        if (remainingWord.startsWith(smallerWord)) {
          // recursiveFind("foobar", ["fo","ob", "a"])
          recursiveFind(word, [...result, smallerWord]);
        }
      }
    }
  }
}
