console.log(1);

const wordtest = "spill";

const tyem = "empty";
const tytb = "tbd";
const tyab = "absent";
const typr = "present";
const tyco = "correct";

const inputed = [];
const buffer = [];
const winmsg = [wordtest.toUpperCase(), "Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];
var turn = 0;

const keys = {
    q: tytb,
    w: tytb,
    e: tytb,
    r: tytb,
    t: tytb,
    y: tytb,
    u: tytb,
    i: tytb,
    o: tytb,
    p: tytb,
    a: tytb,
    s: tytb,
    d: tytb,
    f: tytb,
    g: tytb,
    h: tytb,
    j: tytb,
    k: tytb,
    l: tytb,
    z: tytb,
    x: tytb,
    c: tytb,
    v: tytb,
    b: tytb,
    n: tytb,
    m: tytb,
    undefined: tytb,
};

let modal;

function addword(word) {
    if (buffer.length < 5) {
        buffer.push(word);
    }
    render();
}

function delword() {
    buffer.pop();
    render();
}

function enterword() {
    if (buffer.length == 5) {
        inputed.push([...buffer]);
        buffer.length = 0;
        turn++;
    } else {
        notenough();
    }
    render();
}

function domodal(message, hide = true) {
    const container = document.querySelector(".modal-container");

    const newcontent = document.createElement("div");
    newcontent.classList.add("modal");
    newcontent.textContent = message;
    container.prepend(newcontent);

    newcontent.classList.add("show");
    if (hide) {
        setTimeout(() => {
            newcontent.classList.add("hide");
            setTimeout(() => newcontent.remove(), 300);
        }, 1500);
    }

    // document.querySelector(".modal-content").innerHTML = "";
}

function notenough() {
    domodal("Not enough letters");
}
function notinlist() {
    domodal("Not in word list");
}

function keyremove() {
    const keys = document.querySelectorAll(".key-grid-element");
    for (const k of keys) {
        k.onclick = () => {};
    }
    const delkey = document.querySelector(".key-del");
    delkey.onclick = () => {};

    const enterkey = document.querySelector(".key-enter");
    enterkey.onclick = () => {};
}

let cfmodal = false;
function correct() {
    keyremove();
    if (!cfmodal) {
        domodal(winmsg[turn], false);
        cfmodal = true;
    }
}
function fail() {
    keyremove();
    if (!cfmodal) {
        domodal(wordtest.toUpperCase(), false);
        cfmodal = true;
    }
}

function match(s, a) {
    const out = [tyem, tyem, tyem, tyem, tyem];
    if (a.length != 5) {
        return out;
    }

    const ss = [...s];
    const aa = [...a];
    for (let i = 0; i < 5; i++) {
        if (aa[i] == ss[i]) {
            out[i] = tyco;
            keys[aa[i]] = tyco;
            aa[i] = 0;
            ss[i] = 1;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (ss.find((e) => e == aa[i])) {
            out[i] = typr;
            if (keys[aa[i]] == tytb) {
                keys[aa[i]] = typr;
            }
            ss[ss.findIndex((e) => e == aa[i])] = 2;
            aa[i] = 3;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (typeof aa[i] != "number") {
            out[i] = tyab;
            if (keys[aa[i]] == tytb) {
                keys[aa[i]] = tyab;
            }
        }
    }

    if (out.every((e) => e == tyco)) {
        correct();
    } else if (turn > 5) {
        fail();
    }

    return out;
}

function renderword() {
    const elems = document.querySelectorAll(".word-grid-element");
    let i;
    for (i = 0; i < turn; i++) {
        const mat = match(wordtest, inputed[i]);
        for (let j = 0; j < 5; j++) {
            elems[i * 5 + j].innerHTML = inputed[i][j];
            elems[i * 5 + j].dataset.state = mat[j];
        }
    }
    if (turn < 6) {
        for (let j = 0; j < 5; j++) {
            if (buffer[j]) {
                elems[i * 5 + j].innerHTML = buffer[j];
                elems[i * 5 + j].dataset.state = tytb;
            } else {
                elems[i * 5 + j].innerHTML = "";
                elems[i * 5 + j].dataset.state = tyem;
            }
        }
    }
}

function renderkey() {
    const elems = document.querySelectorAll(".key-grid-element");
    for (const e of elems) {
        e.dataset.state = keys[e.dataset.key];
    }
}

function render() {
    renderword();
    renderkey();
}

window.onload = () => {
    const keys = document.querySelectorAll(".key-grid-element");
    for (const k of keys) {
        k.onclick = () => {
            addword(k.dataset.key);
        };
    }
    const delkey = document.querySelector(".key-del");
    delkey.onclick = delword;

    const enterkey = document.querySelector(".key-enter");
    enterkey.onclick = enterword;
};
