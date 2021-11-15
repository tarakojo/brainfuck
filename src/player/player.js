

let player = {};

player.query_index = {
  start: 0,
  stop: 1,
  pause: 2,
  resume: 3,
  step: 4,
  restart: 5,
  interval: 6
};

player.query = class {
  constructor(index, interval_value) {
    this.index = index;
    this.interval_value = interval_value;
  }
};

player.state_index = {
  stop: 0,
  pause: 1,
  step: 2,
  interval: 3
}

player.state = player.state_index.stop;
player.interval = 100;

player.interval_manual = -1;
player.tick = 50;
player.delay_default = 50;

player.queue = [];
player.push = (q) => { player.queue.push(q); };

player.updated_event = new CustomEvent("player_updated", { bubbles: false });

player.end = false;

document.addEventListener("beforeunload", () => { player.end = true; });

player.start = () => {
  if (!player.init()) {
    player.state = player.state_index.stop;
    return false;
  }
  consoleLog.write("", { break_interpreter: true, break_input: true, write_inputPrefix: true });
  if (player.interval == player.interval_manual) {
    player.state = player.state_index.pause;
  }
  else {
    player.state = player.state_index.interval;
  }
  return true;
}

player.stop = () => {
  player.proc_query(new player.query(player.query_index.stop, 0));
  consoleLog.write("", { break_interpreter: true, break_input: true, write_inputPrefix: true });
}

player.proc_query = (q) => {
  switch (q.index) {
    case player.query_index.start:
      if (player.state != player.state_index.stop) return;
      player.start();
      break;
    case player.query_index.stop:
      if (player.state == player.state_index.stop) return;
      player.state = player.state_index.stop;
      break;
    case player.query_index.pause:
      if (player.state != player.state_index.interval && player.state != player.state_index.step) return;
      player.state = player.state_index.pause;
      break;
    case player.query_index.resume:
      if (player.state != player.state_index.pause) return;
      if (player.interval == player.interval_manual) return;
      player.state = player.state_index.interval;
      break;
    case player.query_index.step:
      if (player.state != player.state_index.pause) return;
      player.state = player.state_index.step;
      break;
    case player.query_index.restart:
      player.start();
      break;
    case player.query_index.interval:
      player.interval = q.interval_value;
      break;
    default:
      alert("internal error: invalid control query");
  };
  document.dispatchEvent(player.updated_event);
};

player.loop = () => {
  if (player.end) return;
  new Promise((resolve) => {
    while (player.queue.length > 0) {
      player.proc_query(player.queue[0]);
      player.queue.shift();
    }
    let r = 1;
    switch (player.state) {
      case player.state_index.stop:
      case player.state_index.pause:
        break;
      case player.state_index.step:
        r = player.run_step();
        player.proc_query(new player.query(player.query_index.pause, 0));
        break;
      case player.state_index.interval:
        if (player.interval == 0) r = player.run_tick();
        else r = player.run_step();
        break;
      default:
        alert("internal error: invalid player state");
    };
    if (r == 0) player.stop();
    setTimeout(resolve,
      (player.state == player.state_index.interval && player.interval > 0 ? player.interval : player.delay_default));
  }).then(player.loop);
};
player.loop();


player.init = () => {
  //コンパイル、インタプリタの準備
  let t = new Token([">", "<", "+", "-", ".", ",", "[", "]", "#"]);
  if (!t.check_valid()) {
    alert("compile error: invalid token set");
    return false;
  }
  let p = compiler.compile(editor.getValue(), t);
  if (p == null) {
    alert("compile error: unbalanced brackets");
    return false;
  }
  if (p.length == 0) {
    alert("compile error: source is empty");
    return false;
  }
  interpreter.init(p);

  //入力状態を更新
  player.waitInput = false;
  inputBuffer.clear();

  return true;
};

player.run_step = interpreter.step;
player.run_tick = () => {
  let timeout = false;
  setTimeout(() => { timeout = true }, player.tick);
  let r;
  do {
    r = interpreter.step();
    if (r != 1) return r;
  } while (!timeout);
  return 1;
};