
(() => {
  const play_stop = document.getElementById("play_stop_button");
  const pause = document.getElementById("pause_button");
  const step = document.getElementById("step_button");
  const restart = document.getElementById("restart_button");
  const interval = document.getElementById("interval");

  document.addEventListener("player_updated", () => {
    play_stop.disabled = false;
    pause.disabled = !(player.state != player.state_index.stop && player.interval != player.interval_manual);
    step.disabled = !(player.state == player.state_index.pause);
    restart.disabled = !(player.state != player.state_index.stop);
    interval.disabled = !(player.state == player.state_index.stop || player.state == player.state_index.pause);

    if (player.state == player.state_index.stop) {
      play_stop.textContent = "play";
    }
    else {
      play_stop.textContent = "stop";
    }

    if (player.state == player.state_index.pause) {
      pause.textContent = "resume";
    }
    else {
      pause.textContent = "pause";
    }
  });

  play_stop.onclick = () => {
    if (player.state == player.state_index.stop) {
      player.push(new player.query(player.query_index.start, 0));
    }
    else {
      player.push(new player.query(player.query_index.stop, 0));
    }
  };

  pause.onclick = () => {
    if (player.state == player.state_index.pause) {
      player.push(new player.query(player.query_index.resume, 0));
    }
    else {
      player.push(new player.query(player.query_index.pause, 0));
    }
  };

  step.onclick = () => {
    player.push(new player.query(player.query_index.step, 0));
  };

  restart.onclick = () => {
    player.push(new player.query(player.query_index.restart, 0));
  };

  interval.onchange = () => {
    player.push(new player.query(player.query_index.interval, Number(interval.value)));
  };

})();

document.getElementById("console_log_clear_button").onclick = () => {
  consoleLog.clear();
};