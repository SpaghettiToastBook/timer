"use strict";

let settings = {
    cycle: false,
    modulus: 0,
};

// Timer code
function divmod(a, b) {
    let q = Math.floor(a / b)
    return [q, a - (b * q)];
};

let timer_state = {
    running: false,
    time: 0,
    time_before_last_start: 0,
    time_of_last_start: Date.now(),
};

function split_time(time) {
    let h, m, s, ms;
    [h, time] = divmod(time, 60 * 60 * 1000);
    [m, time] = divmod(time, 60 * 1000);
    [s, ms] = divmod(time, 1000);
    return [h, m, s, ms];
};

function update_timer() {
    timer_state.time = timer_state.time_before_last_start + (timer_state.running ? (Date.now() - timer_state.time_of_last_start) : 0);

    let time = timer_state.time;
    if (settings.cycle) {
        time %= settings.modulus;
    };

    let [h, m, s, ms] = split_time(time);
    document.getElementById("timer-h").innerText = h > 0 ? String(h) + ":" : "";
    document.getElementById("timer-m").innerText = m > 0 ? String(m).padStart(2, "0") + ":" : "";
    document.getElementById("timer-s").innerText = String(s).padStart(2, "0");
    document.getElementById("timer-ms").innerText = "." + String(ms).padStart(3, "0");
};
window.setInterval(update_timer, 10);

let timer = document.getElementById("timer");
function on_timer_toggle() {
    timer_state.running = !timer_state.running;
    if (timer_state.running) {
        timer_state.time_of_last_start = Date.now();
    } else {
        timer_state.time_before_last_start = timer_state.time;
    };
};

timer.addEventListener("click", event => on_timer_toggle())
document.body.addEventListener("keyup",
    function(event) {
        if (event.key == " ") {
            on_timer_toggle();
        };
    }
);

// Reset button
document.getElementById("reset-timer").addEventListener("click",
    function(event) {
        timer_state.running = false;
        timer_state.time_before_last_start = 0;
        timer_state.time_of_last_start = Date.now();
        update_timer();
    }
);

// Settings
let cycle_checkbox = document.getElementById("cycle-checkbox");
let modulus_input = document.getElementById("modulus-input");

function apply_settings() {
    if (cycle_checkbox.checked) {
        settings.cycle = true;
        modulus_input.disabled = false;
        settings.modulus = modulus_input.valueAsNumber;
    } else {
        settings.cycle = false;
        modulus_input.disabled = true;
    };
};

cycle_checkbox.addEventListener("change", () => apply_settings());
modulus_input.addEventListener("change", () => apply_settings());