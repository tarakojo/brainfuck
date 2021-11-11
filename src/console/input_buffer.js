
//コンソール入力を保持し、インタプリタへの受け渡しを行う

let inputBuffer = {};

inputBuffer.pushedEvent = new CustomEvent("inputBuffer_pushed", { bubbles: false });
inputBuffer.waitInputEvent = new CustomEvent("inputBuffer_waitInput", { bubbles: false });

inputBuffer.data = [];


//input bufferに追加。inputBuffer_pushedイベントを発行
inputBuffer.push = (value) => {
  inputBuffer.data.push(value);
  document.dispatchEvent(inputBuffer.pushedEvent);
}

//input bufferの先頭要素をpop
//存在しなければinputBuffer_waitInputイベントを発行し、pushされるまで待機
inputBuffer.pop = async () => {

  if (inputBuffer.data.length === 0) {
    document.dispatchEvent(inputBuffer.waitInputEvent);
    await function () {
      return new Promise(resolve => {
        document.addEventListener("inputBuffer_pushed", resolve, { once: true });
      });
    }();
  }

  let ans = inputBuffer.data[0];
  inputBuffer.data.shift();

  return ans;
};