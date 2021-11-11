/*


//input bufferのスクロール
const init_inputBufferView_scrollEvent = () => {
  const input_buffer_view_container_elem = document.getElementById("input_buffer_view_container");

  input_buffer_view_container_elem.addEventListener("mouseenter", () => {
    document.onmousewheel = (e) => {
      const d = e.wheelDelta;
      input_buffer_view_container_elem.scrollBy(-d, 0);
    };
  });
  input_buffer_view_container_elem.addEventListener("mouseleave", () => {
    document.onmousewheel = null;
  });
};
init_inputBufferView_scrollEvent();


//input bufferのクリア
const clear_inputBufferView = () => {
  document.getElementById("input_buffer_view").innerHTML = "";
};


//input bufferに追加。inputBufferView_pushedイベントを発行
const push_inputBufferView = (value) => {
  document.getElementById("input_buffer_view_container").scrollLeft = 0;

  let cell = document.createElement("div");
  cell.classList.add("input_buffer_view_cell");
  cell.innerHTML = String(value);

  const input_buffer_view_elem = document.getElementById("input_buffer_view");
  input_buffer_view_elem.appendChild(cell);
};


//input bufferの先頭要素をpop
//存在しなければpushされるまで待機
const pop_inputBufferView = async () => {
  const input_buffer_view_elem = document.getElementById("input_buffer_view");

  if (inputBufferView_data.length === 0) {
    await function () {
      return new Promise(resolve => {
        input_buffer_view_elem.addEventListener("inputBufferView_pushed", resolve, { once: true });
      });
    }();
  }

  input_buffer_view_elem.removeChild(input_buffer_view_elem.firstChild);

  let ans = inputBufferView_data[0];
  inputBufferView_data.shift();

  document.getElementById("input_buffer_view_container").scrollLeft = 0;

  return ans;
};*/