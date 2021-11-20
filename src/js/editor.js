
let editor = {
  locked: false,
  mode_cnt: 0,
  location: [],
  delay: 50
};

editor.set_location = (l) => { editor_highlight.location = l; }

editor.editor = CodeMirror.fromTextArea(document.getElementById("editor_body"), {
  lineNumbers: true,
  theme: "mymonokai",
  mode: "mymode"
});

editor.getValue = () => { return editor.editor.getValue(); }
editor.setValue = (str) => { editor.editor.setValue(str); }

editor.lock = () => { editor.locked = true; }
editor.unlock = () => {  editor.locked = false;}

editor.editor.on("beforeChange", (e, c) => {
  if (editor.locked) c.cancel();
});

editor.update_mode = () => {
  const v = token.token.value;
  CodeMirror.defineMode("mode" + String(++editor.mode_cnt), () => {
    return {
      token: (stream, state) => {
        if (stream.match(v[token.token_index.comment])) {
          stream.skipToEnd();
          return "comment";
        }
        if (stream.match(v[token.token_index.if0_jump])) return "lb";
        if (stream.match(v[token.token_index.ifnot0_jump])) return "rb";
        if (stream.match(v[token.token_index.pointer_inclement])) return "pi";
        if (stream.match(v[token.token_index.pointer_declement])) return "pd";
        if (stream.match(v[token.token_index.memory_inclement])) return "mi";
        if (stream.match(v[token.token_index.memory_declement])) return "md";
        if (stream.match(v[token.token_index.put])) return "put";
        if (stream.match(v[token.token_index.get])) return "get";
        if (stream.next() != null) return "comment";
        return null;
      }
    };
  });
  editor.editor.setOption("mode", "mode" + String(editor.mode_cnt));
}

document.addEventListener("token_changed", () => {
  editor.update_mode();
});

