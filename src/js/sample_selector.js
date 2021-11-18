
let sample_selector = {
  selector: document.getElementById("sample_selector"),
  sample: new Map()
};

sample_selector.dispatch_loadedEvent = (name, code) => {
  document.dispatchEvent(new CustomEvent("sample_loaded", { bubbles: false, detail: { name: name, code: code } }));
}

document.addEventListener("sample_loaded", (e) => {
  sample_selector.sample.set(e.detail.name, e.detail.code);
  let o = document.createElement("option");
  o.value = e.detail.name;
  o.textContent = e.detail.name;
  let s = document.getElementById("sample_selector");
  s.appendChild(o);
});

document.getElementById("sample_selector").addEventListener("change", () => {
  const s = document.getElementById("sample_selector");
  if (s.value == "__default__") return;
  editor.setValue(sample_selector.sample.get(s.value));
  s.selectedIndex = 0;
});
