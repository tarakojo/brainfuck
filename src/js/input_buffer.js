
//コンソール入力を保持し、インタプリタへの受け渡しを行う

let inputBuffer = {
  empty: true
};

inputBuffer.createPushedEvent = (value) => {
  return new CustomEvent("inputBuffer_pushed", { bubbles: false, detail: value });
};
inputBuffer.popedEvent = new CustomEvent("inputBuffer_poped", { bubbles: false });
inputBuffer.clearedEvent = new CustomEvent("inputBuffer_clearedInput", { bubbles: false });

inputBuffer.data = [];

//input bufferに追加。inputBuffer_pushedイベントを発行
inputBuffer.push = (value) => {
  inputBuffer.data.push(value);
  document.dispatchEvent(inputBuffer.createPushedEvent(value));
  inputBuffer.empty = false;
}

//input bufferの先頭要素をpop
//最後にinputBuffer_popedEventを発行
inputBuffer.pop = () => {

  if (inputBuffer.data.length === 0) { alert("internal error : input buffer"); }

  let ans = inputBuffer.data[0];
  inputBuffer.data.shift();
  inputBuffer.empty = inputBuffer.data.length === 0;

  document.dispatchEvent(inputBuffer.popedEvent);

  return ans;
};

//input bufferを削除
//inputBuffer_cleredEventを発行
inputBuffer.clear = () => {
  inputBuffer.data = [];
  inputBuffer.empty = true;
  document.dispatchEvent(inputBuffer.clearedEvent);
}

inputBuffer.check_empty = () => {
  return inputBuffer.empty;
}