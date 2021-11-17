
let memoryView = {};
memoryView.col = 16;
memoryView.row = Math.ceil(interpreter.memorySize / memoryView.col);

memoryView.mp = 0;
memoryView.mem = new Uint8Array(interpreter.memorySize);
memoryView.mem.fill(0);

//メモリビューを作成
//セルのidはmemory_view_cell_(index)
//セルのindexはmemory_view_cell_(index)_index
//セルの値はmemory_view_cell_(index)_value
(() => {
  const v = document.createElement("div");
  v.id = "memory_view";

  for (i = 0; i < memoryView.row; ++i) {
    let row = document.createElement('div');
    row.style.display = "flex";
    row.style.flexDirection = "row";
    for (j = 0; j < memoryView.col; ++j) {
      const index = String(i * memoryView.col + j);
      let cell = document.createElement('div');
      cell.classList.add("memory_view_cell");
      cell.id = "memory_view_cell_" + index;
      cell.innerHTML = "<div id=\"memory_vew_cell_" + index + "_index\" class=\"memory_view_cell_index\">" + index + "</div>";
      cell.innerHTML += "<div id=\"memory_view_cell_" + index + "_value\" class=\"memory_view_cell_value\">0</div>";
      row.appendChild(cell);
    }
    v.appendChild(row);
  }

  document.getElementById("memory_view_container").appendChild(v);
})();


memoryView.update = () => {
  new Promise((resolve) => {
    const newmp = interpreter.memoryPointer;
    const newmem = interpreter.memory.slice();

    //値と色の更新
    for (i = 0; i < interpreter.memorySize; ++i) {
      if (i == memoryView.mp) {
        document.getElementById("memory_view_cell_" + String(i)).style.backgroundColor = "var(--memory_view_background_color)";
      }
      if (i == newmp) {
        document.getElementById("memory_view_cell_" + String(i)).style.backgroundColor = "var(--memory_viwe_pointer_background_color)";
      }
      if (newmem[i] != memoryView.mem[i]) {
        document.getElementById("memory_view_cell_" + String(i) + "_value").textContent = String(newmem[i]);
      }
    }

    //スクロール処理
    if (memoryView.mp != newmp) {
      const v = document.getElementById("memory_view");
      const vc = document.getElementById("memory_view_container");
      //mpのセルの表内のy座標
      const mp_y = v.scrollHeight / memoryView.row * Math.floor(newmp / memoryView.col);
      //画面上のy座標
      const mp_view_y = mp_y - vc.scrollTop;

      if (mp_view_y < vc.clientHeight * 0.3) {
        const new_y = mp_y - vc.clientHeight * 0.3;
        vc.scrollTo(0, new_y);
      }
      else if (mp_view_y > vc.clientHeight * 0.7) {
        const new_y = mp_y - vc.clientHeight * 0.7;
        vc.scrollTo(0, new_y);
      }
    }

    memoryView.mp = newmp;
    memoryView.mem = newmp;

    let delay = 50;
    setTimeout(resolve, (delay));

  }).then(memoryView.update);
}
memoryView.update();