
(() => {
  const play = document.getElementById("control_play_button");
  const pause = document.getElementById("control_pause_button");
  const stop = document.getElementById("control_stop_button");
  const restart = document.getElementById("control_restart_button");
  const step = document.getElementById("control_step_button");
  const interval = document.getElementById("control_interval");

  document.addEventListener("player_updated", () => {
    play.disabled = !(player.state == player.state_index.stop || player.state == player.state_index.pause);
    pause.disabled = !(player.state != player.state_index.stop && player.interval != player.interval_manual && player.state != player.state_index.pause);
    stop.disabled = !(player.state != player.state_index.stop);
    restart.disabled = !(player.state != player.state_index.stop);
    step.disabled = !(player.state == player.state_index.pause);
    interval.disabled = !(player.state == player.state_index.stop || player.state == player.state_index.pause);
  });

  play.onclick = () => {
    if (player.state == player.state_index.stop) {
      player.push(new player.query(player.query_index.start, 0));
    }
    else {
      player.push(new player.query(player.query_index.resume, 0));
    }
  };

  pause.onclick = () => {
    player.push(new player.query(player.query_index.pause, 0));
  };

  stop.onclick = () => {
    player.push(new player.query(player.query_index.stop, 0));
  };

  restart.onclick = () => {
    player.push(new player.query(player.query_index.restart, 0));
  };

  step.onclick = () => {
    player.push(new player.query(player.query_index.step, 0));
  };

  interval.onchange = () => {
    player.push(new player.query(player.query_index.interval, Number(interval.value)));
  };

})();

document.getElementById("console_log_clear_button").onclick = () => {
  consoleLog.clear();
};