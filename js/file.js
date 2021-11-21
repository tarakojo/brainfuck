

document.getElementById("file_open_button").addEventListener("click", () => {
  document.getElementById("file_open").click();
});

document.getElementById("file_open").addEventListener("change", (e) => {
  const f = e.target.files[0];
  f.text().then((str) => { editor.setValue(str) });
});

document.getElementById("file_save_button").addEventListener("click", () => {
  var elem = document.createElement('a');
  elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editor.getValue()));
  elem.setAttribute('download', "source.b");

  elem.style.display = 'none';
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
});
