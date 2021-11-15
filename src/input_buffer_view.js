

(() => {
  const v = document.getElementById("input_buffer_view");

  //input bufferのスクロール
  v.addEventListener("mouseenter", () => {
    document.onmousewheel = (e) => {
      const d = e.wheelDelta;
      v.scrollBy(-d, 0);
    };
  });  
  v.addEventListener("mouseleave", () => {
    document.onmousewheel = null;
  });

  //選択不可
  v.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
  v.addEventListener("select", () => {
    v.setSelectionRange(0, 0);
  });
  
  document.addEventListener("inputBuffer_pushed", (e) => {
    v.value += " " + String(e.detail);
    v.scrollLeft = 0;
  });

  document.addEventListener("inputBuffer_poped", () => {
    let pos = v.value.indexOf(" ", 1);
    if (pos == -1) v.value = "";
    else v.value = v.value.slice(pos);
    v.scrollLeft = 0;
  });

  document.addEventListener("inputBuffer_clearedInput", () => {
    v.value = "";
  });

})();