
let memoryView = {};
memoryView.col = 16;
memoryView.row = interpreter.memorySize / memoryView.col;

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
  v.style.display = "none";

  for (i = 0; i < memoryView.row; ++i) {
    let row = document.createElement('div');
    row.classList.add('flex_row');
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
    const c = document.getElementById("memory_view");

    for (i = 0; i < interpreter.memorySize; ++i) {
      if (newmem[i] == memoryView.mem[i]) continue;
      document.getElementById("memory_view_cell_" + String(i) + "_value").textContent = String(newmem[i]);
    }

    memoryView.mp = newmp;
    memoryView.mem = newmp;

    let delay;
    if (player.state == player.state_index.interval && player.interval > 0) delay = 50;
    else delay = 200;
    setTimeout(resolve, (delay));
    
  }).then(memoryView.update);
}
memoryView.update();