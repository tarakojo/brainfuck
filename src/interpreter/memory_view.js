
const memoryView_col = 16;
const memoryView_row = interpreter.memorySize / memoryView_col;

//メモリビューを作成
//セルのidはmemory_view_cell_(index)
//セルのindexはmemory_view_cell_(index)_index
//セルの値はmemory_view_cell_(index)_value
(() => {
  const memory_view = document.createElement("div");
  memory_view.id = "memory_view";

  for (i = 0; i < memoryView_row; ++i) {
    let row = document.createElement('div');
    row.classList.add('flex_row');
    for (j = 0; j < memoryView_col; ++j) {
      const index = String(i * memoryView_col + j);
      let cell = document.createElement('div');
      cell.classList.add("memory_view_cell");
      cell.id = "memory_view_cell_" + index;
      cell.innerHTML = "<div id=\"memory_vew_cell_" + index + "_index\" class=\"memory_view_cell_index\">" + index + "</div>";
      cell.innerHTML += "<div id=\"memory_view_cell_" + index + "_value\" class=\"memory_view_cell_value\">0</div>";
      row.appendChild(cell);
    }
    memory_view.appendChild(row);
  }

  document.getElementById("memory_view_container").appendChild(memory_view);
})();

