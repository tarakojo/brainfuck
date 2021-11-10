const inputBuffer_pushedEvent = new CustomEvent("inputBuffer_pushed", { bubbles: false });

let inputBuffer_data = [];


//input bufferのスクロール
const init_inputBuffer_scrollEvent = () => {
  const input_buffer_container_elem = document.getElementById("input_buffer_container");

  input_buffer_container_elem.addEventListener("mouseenter", () => {
    document.onmousewheel = (e) => {
      const d = e.wheelDelta;
      input_buffer_container_elem.scrollBy(-d, 0);
    };
  });
  input_buffer_container_elem.addEventListener("mouseleave", () => {
    document.onmousewheel = null;
  });
};
init_inputBuffer_scrollEvent();


//input bufferのクリア
const clear_inputBuffer = () => {
  document.getElementById("input_buffer").innerHTML = "";
};


//input bufferに追加。inputbuffer_pushedイベントを発行
const push_inputBuffer = (value) => {
  document.getElementById("input_buffer_container").scrollLeft = 0;

  let cell = document.createElement("div");
  cell.classList.add("input_buffer_cell");
  cell.innerHTML = String(value);

  const input_buffer_elem = document.getElementById("input_buffer");
  input_buffer_elem.appendChild(cell);
  inputBuffer_data.push(value);

  input_buffer_elem.dispatchEvent(inputBuffer_pushedEvent);
};


//input bufferの先頭要素をpop
//存在しなければpushされるまで待機
const pop_inputBuffer = async () => {
  const input_buffer_elem = document.getElementById("input_buffer");

  if (inputBuffer_data.length === 0) {
    await function () {
      return new Promise(resolve => {
        input_buffer_elem.addEventListener("inputBuffer_pushed", resolve, { once: true });
      });
    }();
  }

  input_buffer_elem.removeChild(input_buffer_elem.firstChild);

  let ans = inputBuffer_data[0];
  inputBuffer_data.shift();

  document.getElementById("input_buffer_container").scrollLeft = 0;

  return ans;
};