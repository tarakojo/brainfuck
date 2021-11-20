

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

player.state_index = {
  stop: 0,
  pause: 1,
  interval: 2
}

player.query = class {
  constructor(index, interval_value) {
    this.index = index;
    this.interval_value = interval_value;
  }
};

//状態
player.state = player.state_index.stop;

//interval
player.interval = 10;
//intervalがmanualのときの値
player.interval_manual = -1;

//ループの間隔
player.delay = 50;
//1ループ内でのインタプリタ処理時間の最大
player.tick = 5;

//ループで1ステップ実行をするか
player.step_flag = false;

//プログラムのintervalモード開始時刻
player.interval_start = 0;
//インタプリタのintervalモード開始からのステップ数
player.interval_step = 0;
//リセット関数
player.reset_intervalModeInfo = () => {
  player.interval_start = performance.now();
  player.interval_step = 0;
}

//処理キャパシティー
player.capacity = 0;

//クエリキュー
player.queue = [];
player.push = (q) => { player.queue.push(q); };

//状態更新イベント
player.updated_event = new CustomEvent("player_updated", { bubbles: false });

//ループ終了フラグ。ページが閉じられるときにtrueとなる
player.end = false;
document.addEventListener("beforeunload", () => { player.end = true; });


//状態の設定
player.set_state = (s) => {
  switch (s) {
    case player.state_index.stop:
      player.capacity = 0;
      editor.unlock();
      break;
    case player.state_index.pause:
      player.capacity = 0;
      break;
    case player.state_index.interval:
      player.reset_intervalModeInfo();
      break;
    default:
      alert("internal error: invalid state change");
      return;
  };
  player.state = s;
  document.dispatchEvent(player.updated_event);
}

player.start = () => {

  //エディタロック
  editor.lock();

  //コンパイル
  if (!token.token.check_valid()) {
    alert("compile error: invalid token set");
    player.proc_query(new player.query(player.query_index.stop, 0));
    return;
  }
  let p = compiler.compile(editor.getValue(), token.token);
  if (p == null) {
    alert("compile error: unbalanced brackets");
    player.proc_query(new player.query(player.query_index.stop, 0));
    return;
  }
  if (p.length == 0) {
    alert("compile error: source is empty");
    player.proc_query(new player.query(player.query_index.stop, 0));
    return;
  }

  //インタプリタの準備
  interpreter.init(p);

  //メモリビューの更新を強制
  memoryView.update();

  //入力状態を更新
  player.waitInput = false;
  inputBuffer.clear();

  //manualなら即pause
  if (player.interval == player.interval_manual) {
    player.set_state(player.state_index.pause);
  }
  else {
    player.set_state(player.state_index.interval);
  }
}

player.proc_query = (q) => {
  switch (q.index) {
    case player.query_index.start:
      if (player.state != player.state_index.stop) return;
      player.start();
      break;
    case player.query_index.stop:
      player.set_state(player.state_index.stop);
      break;
    case player.query_index.pause:
      player.set_state(player.state_index.pause);
      break;
    case player.query_index.resume:
      if (player.state != player.state_index.pause) return;
      if (player.interval == player.interval_manual) return;
      player.set_state(player.state_index.interval);
      break;
    case player.query_index.step:
      if (player.state != player.state_index.pause) return;
      player.step_flag = true;
      break;
    case player.query_index.restart:
      player.start();
      break;
    case player.query_index.interval:
      player.interval = q.interval_value;
      player.reset_intervalModeInfo();
      break;
    default:
      alert("internal error: invalid control query");
  };
};

player.loop = () => {
  //ループ終了フラグをチェック
  if (player.end) return;

  new Promise((resolve) => {
    //1ステップ実行フラグを初期化
    player.step_flag = false;

    //クエリ処理
    while (player.queue.length > 0) {
      player.proc_query(player.queue[0]);
      player.queue.shift();
    }

    let r = 1;
    switch (player.state) {
      case player.state_index.stop:
        break;
      case player.state_index.pause:
        //1ステップ実行するなら
        if (player.step_flag) {
          r = player.run_step();
        }
        break;
      case player.state_index.interval:
        if (player.interval < 0) {
          alert("internal error: invalid interval");
          return;
        }
        if (player.interval == 0) r = player.run_tick();
        else r = player.run_interval();
        break;
      default:
        alert("internal error: invalid player state");
    };
    //インタプリタが終了したとき
    if (r == 0) {
      player.set_state(player.state_index.stop);
      consoleLog.newline();
    }
    //入力待ちのとき
    else if (r == -1) {
      player.reset_intervalModeInfo();
      player.capacity = 0;
    }
    setTimeout(resolve, player.delay);
  }).then(player.loop);
};
player.loop();

player.run_step = interpreter.step;
player.run_tick = () => {
  let timeout = performance.now() + player.tick;
  let r;
  do {
    r = interpreter.step();
    if (r != 1) return r;
  } while (performance.now() < timeout);
  player.capacity = 1;
  return 1;
};
player.run_interval = () => {
  if (player.interval <= 0) {
    alert("internal error in function : run_interval");
    return;
  }
  //今回の処理数
  let now = performance.now();
  let cnt = Math.floor((now - player.interval_start) / player.interval) - player.interval_step;
  //タイムアウト設定
  let timeout = performance.now() + player.tick;
  //ループ
  let r;
  do {
    if (cnt <= 0) break;
    --cnt;
    ++player.interval_step;
    r = interpreter.step();
    if (r != 1) return r;
  } while (performance.now() < timeout);
  if (cnt > 0) { player.capacity = -1; }
  else { player.capacity = (performance.now() - now) / player.tick; }
  return 1;
};
