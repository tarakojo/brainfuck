let control = {
  play_disabled: false,
  pause_disabled: false,
  stop_disabled: false,
  restart_disabled: false,
  step_disabled: false
};


(() => {
  const play = document.getElementById("control_play_button");
  const pause = document.getElementById("control_pause_button");
  const stop = document.getElementById("control_stop_button");
  const restart = document.getElementById("control_restart_button");
  const step = document.getElementById("control_step_button");
  const interval = document.getElementById("control_interval");

  const update = () => {
    control.play_disabled = !(player.state == player.state_index.stop || player.state == player.state_index.pause);
    control.pause_disabled = !(player.state == player.state_index.interval);
    control.stop_disabled = !(player.state != player.state_index.stop);
    control.restart_disabled = !(player.state != player.state_index.stop);
    control.step_disabled = !(player.state == player.state_index.pause);
    interval.disabled = !(player.state == player.state_index.stop || player.state == player.state_index.pause);

    if (control.play_disabled) {
      play.classList.add("control_filled_button_disabled");
    }
    else {
      play.classList.remove("control_filled_button_disabled");
    }
    if (control.pause_disabled) {
      pause.classList.add("control_filled_button_disabled");
    }
    else {
      pause.classList.remove("control_filled_button_disabled");
    }
    if (control.stop_disabled) {
      stop.classList.add("control_filled_button_disabled");
    }
    else {
      stop.classList.remove("control_filled_button_disabled");
    }
    if (control.restart_disabled) {
      restart.classList.add("control_button_disabled");
    }
    else {
      restart.classList.remove("control_button_disabled");
    }
    if (control.step_disabled) {
      step.classList.add("control_button_disabled");
    }
    else {
      step.classList.remove("control_button_disabled");
    }
  };
  update();

  document.addEventListener("player_updated", update);

  play.onclick = () => {
    if (control.play_disabled) return;
    if (player.state == player.state_index.stop) {
      player.push(new player.query(player.query_index.start, 0));
    }
    else {
      player.push(new player.query(player.query_index.resume, 0));
    }
  };

  pause.onclick = () => {
    if (control.pause_disabled) return;
    player.push(new player.query(player.query_index.pause, 0));
  };

  stop.onclick = () => {
    if (control.stop_disabled) return;
    player.push(new player.query(player.query_index.stop, 0));
  };

  restart.onclick = () => {
    if (control.restart_disabled) return;
    player.push(new player.query(player.query_index.restart, 0));
  };

  step.onclick = () => {
    if (control.step_disabled) return;
    player.push(new player.query(player.query_index.step, 0));
  };

  interval.onchange = () => {
    player.push(new player.query(player.query_index.interval, Number(interval.value)));
  };

})();

document.getElementById("console_log_clear_button").onclick = () => {
  consoleLog.clear();
};

setInterval(() => {
  document.getElementById("step_counter").innerHTML = interpreter.stepCount + "&nbsp;steps";

  const c = Math.floor(player.capacity * 100);
  let s = "";
  if (c < 0) s = "over";
  else s = String(c) + "%";
  document.getElementById("capacity_value").innerHTML = s;
}, 333.333);