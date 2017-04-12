var wordErrorList = [];
var wordList = [];
var errMap = {};

function fnSetWordList (list) {
  let temp = [];
  wordErrorList = [];
  errMap = {};
  wordList = temp.concat(list);
}

function fnSetErrorId (id) {
  if (errMap[id]) {
    return;
  }
  let pariWord = {};
  for (let i = 0; i < wordList.length; i++) {
    let item = wordList[i];
    if (item.id === id) {
      pariWord[item.lang] = item.name;
    }
  }
  errMap[id] = pariWord;
}

function fnGetErrorList () {
  for (var k in errMap) {
    let item = {};
    item.enName = errMap[k].en;
    item.zhName = errMap[k].zh;
    wordErrorList.push(item);
  }
  return wordErrorList;
}

export default {
  setWordList: fnSetWordList,
  setErrorId: fnSetErrorId,
  getErrorList: fnGetErrorList
};
