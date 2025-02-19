import { words } from "./words.js";

const rdarr = new Uint32Array(1);
window.crypto.getRandomValues(rdarr);
const rdidx = rdarr[0] % words.length;

const answer = words[rdidx];

const types = ["empty", "tbd", "absent", "present", "correct"];
const winmsg = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew", answer.toUpperCase()];
const anime = ["idle", "pop", "flip-in", "flip-out", "invalid", "win"];

const inputed = [];
const matched = [];
const buffer = [];
let turn = 0;
let add = false;
let cankey = false;

const keys = {
    q: types[1],
    w: types[1],
    e: types[1],
    r: types[1],
    t: types[1],
    y: types[1],
    u: types[1],
    i: types[1],
    o: types[1],
    p: types[1],
    a: types[1],
    s: types[1],
    d: types[1],
    f: types[1],
    g: types[1],
    h: types[1],
    j: types[1],
    k: types[1],
    l: types[1],
    z: types[1],
    x: types[1],
    c: types[1],
    v: types[1],
    b: types[1],
    n: types[1],
    m: types[1],
    undefined: types[1],
};
const keypress = {
    KeyQ: false,
    KeyW: false,
    KeyE: false,
    KeyR: false,
    KeyT: false,
    KeyY: false,
    KeyU: false,
    KeyI: false,
    KeyO: false,
    KeyP: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyF: false,
    KeyG: false,
    KeyH: false,
    KeyJ: false,
    KeyK: false,
    KeyL: false,
    KeyZ: false,
    KeyX: false,
    KeyC: false,
    KeyV: false,
    KeyB: false,
    KeyN: false,
    KeyM: false,
    Enter: false,
    NumpadEnter: false,
    Backspace: false,
    undefined: false,
};

function bsfind(s, a) {
    let l = 0;
    let r = s.length - 1;

    while (l <= r) {
        const m = Math.floor((l + r) / 2);
        const w = s[m];
        if (w == a) {
            return true;
        } else if (w < a) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }

    return false;
}

function addword(word) {
    add = true;
    if (buffer.length < 5 && cankey) {
        buffer.push(word);
        render();
    }
}

function delword() {
    add = false;
    buffer.pop();
    render();
}

function enterword() {
    add = false;
    if (cankey) {
        if (buffer.length == 5) {
            if (bsfind(words, buffer.join(""))) {
                inputed.push([...buffer]);
                matched.push(match(answer, buffer));
                buffer.length = 0;
                matching(turn);
                turn++;
            } else {
                invalid(true, turn);
            }
        } else {
            invalid(false, turn);
        }
    }
    render();
}

function matching(n) {
    cankey = false;

    for (let i = 0; i < 5; i++) {
        wordelems[n * 5 + i].innerHTML = inputed[n][i];
        setTimeout(
            () => {
                wordelems[n * 5 + i].dataset.animation = anime[2];
            },
            300 * i + 0
        );
        setTimeout(
            () => {
                wordelems[n * 5 + i].dataset.state = matched[n][i];
                wordelems[n * 5 + i].dataset.animation = anime[3];
            },
            300 * i + 250
        );
        setTimeout(
            () => {
                wordelems[n * 5 + i].dataset.animation = anime[0];
            },
            300 * i + 500
        );
    }
    setTimeout(() => {
        cankey = !matched[n].every((e) => e == types[4]) && n < 5;
        renderkey();
    }, 1800);
}

function domodal(message, hide = true) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.textContent = message;
    container.prepend(modal);

    modal.classList.add("show");
    if (hide) {
        setTimeout(() => {
            modal.classList.add("hide");
            setTimeout(() => modal.remove(), 300);
        }, 1500);
    }
}

function invalid(list, n) {
    list ? domodal("Not in word list") : domodal("Not enough letters");
    for (let i = 0; i < 5; i++) {
        if (wordelems[n * 5 + i].dataset.animation == anime[0]) {
            wordelems[n * 5 + i].dataset.animation = anime[4];
            setTimeout(() => {
                wordelems[n * 5 + i].dataset.animation = anime[0];
            }, 600);
        }
    }
}

let cfmodal = true;
function lena(diein, n) {
    cankey = false;

    if (cfmodal) {
        setTimeout(() => {
            cankey = false;
            domodal(diein ? winmsg[n] : answer.toUpperCase(), false);
            cfmodal = false;
            if (diein) {
                for (let i = 0; i < 5; i++) {
                    if (wordelems[n * 5 + i].dataset.animation == anime[0]) {
                        setTimeout(() => {
                            wordelems[n * 5 + i].dataset.animation = anime[5];
                        }, 100 * i);
                        setTimeout(() => {
                            wordelems[n * 5 + i].dataset.animation = anime[0];
                        }, 1500);
                    }
                }
            }
        }, 1800);
    }
}

function match(s, a) {
    const out = [types[0], types[0], types[0], types[0], types[0]];
    if (a.length != 5) {
        return out;
    }

    const ss = [...s];
    const aa = [...a];
    for (let i = 0; i < 5; i++) {
        if (aa[i] == ss[i]) {
            out[i] = types[4];
            keys[aa[i]] = types[4];
            aa[i] = 0;
            ss[i] = 1;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (ss.find((e) => e == aa[i])) {
            out[i] = types[3];
            if (keys[aa[i]] == types[1]) {
                keys[aa[i]] = types[3];
            }
            ss[ss.findIndex((e) => e == aa[i])] = 2;
            aa[i] = 3;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (typeof aa[i] != "number") {
            out[i] = types[2];
            if (keys[aa[i]] == types[1]) {
                keys[aa[i]] = types[2];
            }
        }
    }
    console.log(turn);
    if (out.every((e) => e == types[4])) {
        lena(true, turn);
    } else if (turn >= 5) {
        lena(false, turn);
    }

    return out;
}

function renderword() {
    let i;
    for (i = 0; i < turn; i++) {
        if (i < turn - 2) {
            for (let j = 0; j < 5; j++) {
                wordelems[i * 5 + j].innerHTML = inputed[i][j];
                wordelems[i * 5 + j].dataset.state = matched[i][j];
            }
        }
    }
    if (turn < 6) {
        for (let j = 0; j < 5; j++) {
            if (buffer[j]) {
                wordelems[i * 5 + j].innerHTML = buffer[j];
                wordelems[i * 5 + j].dataset.state = types[1];
            } else {
                wordelems[i * 5 + j].innerHTML = "";
                wordelems[i * 5 + j].dataset.state = types[0];
            }
            if (j == buffer.length - 1) {
                if (wordelems[i * 5 + j].dataset.animation == anime[0] && add) {
                    wordelems[i * 5 + j].dataset.animation = anime[1];
                    setTimeout(() => {
                        wordelems[i * 5 + j].dataset.animation = anime[0];
                    }, 100);
                }
            }
        }
    }
}
function renderkey() {
    for (const e of keyelems) {
        e.dataset.state = keys[e.dataset.key];
    }
}
function render() {
    renderword();
}

const container = document.querySelector(".modal-container");
const wordelems = document.querySelectorAll(".word-grid-element");
const keyelems = document.querySelectorAll(".key-grid-element");
const delkey = document.querySelector(".key-del");
const enterkey = document.querySelector(".key-enter");

const nextFocusableElement = document.querySelector(".text");

for (const k of keyelems) {
    k.onclick = () => {
        if (cankey) {
            addword(k.dataset.key);
            nextFocusableElement.focus();
        }
    };
}
delkey.onclick = () => {
    if (cankey) {
        delword();
    }
};
enterkey.onclick = () => {
    if (cankey) {
        enterword();
    }
};

document.addEventListener("keydown", (e) => {
    if (cankey && !keypress[e.code]) {
        if (keys[e.key]) {
            addword(e.key);
        } else if (e.key == "Enter") {
            enterword();
        } else if (e.key == "Backspace") {
            delword();
        }
    }
    if (!keypress[e.code]) {
        keypress[e.code] = true;
    }
    if (e.key == " " || e.key == "Backspace" || e.key == "Enter") {
        e.preventDefault();
    }
});
document.addEventListener("keyup", (e) => {
    if (keypress[e.code]) {
        keypress[e.code] = false;
    }
});

cankey = true;
