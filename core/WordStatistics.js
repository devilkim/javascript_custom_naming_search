class WordStatistics {
  constructor(label) {
    this.label = label;
    this.wordStatistics = [];
  }
  addWord(word) {
    if (this.wordStatistics[word] === undefined) {
      this.wordStatistics[word] = 1;
    } else {
      this.wordStatistics[word]++;
    }
  }
  list() {
    const wordCountList = [];
    for (let key in this.wordStatistics) {
      wordCountList.push({key, count: this.wordStatistics[key]});
    }
    return wordCountList;
  }
  sortedList(isAscending = true) {
    return this.list().sort((item1, item2) => {
      if (item1.count < item2.count) {
       return isAscending ? 1 : -1;
     } else if (item1.count > item2.count) {
       return isAscending ? -1 : 1;
     } else {
       return 0;
     }
    });
  }
  print(list = this.list()) {
    let printed_text = `##### ${this.label} #####\n`;
    for (let key in list) {
      printed_text += `- ${list[key].key}: ${list[key].count}\n`;
    }
    return printed_text;
  }
  sortedPrint(list = this.sortedList()) {
    return this.print(list);
  }
  string(list = this.list()) {
    let printed_text = `##### ${this.label} #####\n`;
    for (let key in list) {
      printed_text += `${list[key].key}: ${list[key].count}, `;
    }
    return printed_text;
  }
  sortedString(list = this.sortedList()) {
    return this.string(list);
  }
  words(list = this.sortedList()) {
    let printed_text = `##### ${this.label} #####\n`;
    for (let key in list) {
      printed_text += `"${list[key].key}", `;
    }
    return printed_text;
  }
  sortedWords(list = this.sortedList()) {
    return this.words(list);
  }
}
WordStatistics.prototype.toString = "test";
console.log();

module.exports = WordStatistics;
