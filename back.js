// =====================
// PINE TASK
// =====================
let tasksVal = "";

const tasksInput = document.getElementById("taskInput");
const tasksList  = document.getElementById("taskList");

function getInput(){
    tasksVal = tasksInput.value;
    if(tasksVal.trim() === "") return;

    tasksList.classList.remove("empty");

    const li = document.createElement("li");
    li.className = "taskLi";

    const p = document.createElement("p");
    p.className = "liP";
    p.textContent = tasksVal;

    const btns = document.createElement("div");
    btns.className = "liBtns";

    const doneDiv = document.createElement("div");
    doneDiv.className = "doneDiv";

    const doneBtn = document.createElement("button");
    doneBtn.className = "doneBtn";
    doneBtn.innerHTML = "✓";

    doneBtn.onclick = () => {
        p.classList.toggle("completed");
        doneBtn.classList.toggle("checked");
    };

    doneDiv.append(doneBtn, document.createTextNode("Done"));

    const trashDiv = document.createElement("div");
    trashDiv.className = "trashDiv";

    const trashBtn = document.createElement("button");
    trashBtn.className = "trashBtn";
    trashBtn.innerHTML = "🗑";

    trashBtn.onclick = () => {
        li.remove();
        if(!tasksList.children.length){
            tasksList.classList.add("empty");
        }
    };

    trashDiv.append(trashBtn, document.createTextNode("Trash"));

    btns.append(doneDiv, trashDiv);
    li.append(p, btns);
    tasksList.append(li);

    tasksInput.value = "";
}

tasksInput.addEventListener("keydown", e => {
    if(e.key === "Enter") getInput();
});


// =====================
// TABLE CORE
// =====================
const table     = document.querySelector(".table");
const tbody     = table.querySelector("tbody");
const tableBtns = document.querySelector(".tableBtns");
const sec2      = document.querySelector(".tableSec .sec2");

// ---------- HELPERS ----------
function getRowIndex(tr){
    return [...tbody.children].indexOf(tr);
}

function createEmptyRow(isBuffer=false){
    const tr = document.createElement("tr");
    if(isBuffer) tr.classList.add("buffer");

    for(let i=0;i<8;i++){
        const td = document.createElement("td");
        td.contentEditable = true;
        td.spellcheck = false;
        tr.appendChild(td);
    }
    return tr;
}

// ---------- ROW BUTTONS ----------
function attachHover(tr, btn){
    const toggle = v => btn.classList.toggle("show", v);
    tr.onmouseenter = () => toggle(true);
    tr.onmouseleave = () => toggle(false);
    btn.onmouseenter = () => toggle(true);
    btn.onmouseleave = () => toggle(false);
}

function createRowButtons(tr, ref=null){
    if(tr.classList.contains("buffer")) return;

    const btn = document.createElement("div");
    btn.className = "rowBtns";
    btn._row = tr;

    btn.innerHTML = `
        <svg class="del" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14"/><path d="M16 6v14"/></svg>
        <svg class="add" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    `;

    if(ref) tableBtns.insertBefore(btn, ref.nextSibling);
    else {
        const idx = getRowIndex(tr);
        tableBtns.insertBefore(btn, tableBtns.children[idx+1] || null);
    }

    attachHover(tr, btn);

    new ResizeObserver(() => {
        btn.style.height = tr.offsetHeight + "px";
    }).observe(tr);

    btn.querySelector(".del").onclick = () => {
        tr.remove();
        btn.remove();
        if(!tbody.children.length){
            tbody.append(createEmptyRow(true));
        }
    };

    btn.querySelector(".add").onclick = () => {
        const nr = createEmptyRow();
        tr.after(nr);
        createRowButtons(nr);
    };
}

// ---------- HEADER ----------
const headerBtns = document.createElement("div");
headerBtns.className = "headBtn";
headerBtns.innerHTML = "+";
tableBtns.appendChild(headerBtns);

headerBtns.onclick = () => {
    const r = createEmptyRow();
    tbody.prepend(r);
    createRowButtons(r, headerBtns);
};

// ---------- BUFFER ----------
const bufferRow = createEmptyRow(true);
tbody.appendChild(bufferRow);

table.addEventListener("input", () => {
    const last = tbody.lastElementChild;
    if(!last) return;

    if([...last.children].some(td => td.textContent.trim())){
        last.classList.remove("buffer");
        createRowButtons(last);
        tbody.append(createEmptyRow(true));
    }
});

// ---------- DRAG ----------
let draggedRow = null;

tbody.addEventListener("dragstart", e => {
    const tr = e.target.closest("tr");
    if(!tr || tr.classList.contains("buffer")) return;

    draggedRow = tr;
    tr.style.background = "#4a3022";
    [...tableBtns.children].forEach(b => b.style.display="none");

    const ghost = document.createElement("div");
    ghost.style.opacity=0;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost,0,0);
    setTimeout(()=>ghost.remove(),0);
});

tbody.addEventListener("dragover", e => {
    if(!draggedRow) return;
    e.preventDefault();

    const tr = e.target.closest("tr");
    if(!tr || tr===draggedRow || tr.classList.contains("buffer")) return;

    const next = e.clientY > tr.getBoundingClientRect().top + tr.offsetHeight/2;
    tbody.insertBefore(draggedRow, next ? tr.nextSibling : tr);

    const db = [...tableBtns.children].find(b=>b._row===draggedRow);
    const tb = [...tableBtns.children].find(b=>b._row===tr);
    if(db && tb) tableBtns.insertBefore(db, next ? tb.nextSibling : tb);
});

tbody.addEventListener("dragend", ()=>{
    if(!draggedRow) return;
    draggedRow.style.background="";
    [...tableBtns.children].forEach(b=>b.style.display="");
    draggedRow=null;
});

// ---------- CTRL NAV ----------
tbody.addEventListener("keydown", e=>{
    if(!e.ctrlKey || e.target.tagName!=="TD") return;

    const td = e.target;
    const tr = td.parentElement;
    const tdI = [...tr.children].indexOf(td);
    const trI = [...tbody.children].indexOf(tr);

    let target=null;
    if(e.key==="ArrowRight") target=tr.children[tdI+1];
    if(e.key==="ArrowLeft")  target=tr.children[tdI-1];
    if(e.key==="ArrowDown")  target=tbody.children[trI+1]?.children[tdI];
    if(e.key==="ArrowUp")    target=tbody.children[trI-1]?.children[tdI];

    if(target){
        e.preventDefault();
        target.focus();
        document.getSelection().collapse(target,1);
    }
});

// =====================
// WEEK / DAY
// =====================
const weekBtn   = document.querySelector(".week");
const daysBtn   = document.querySelector(".days");
const daySelect = document.querySelector(".daySel");
const headers   = table.querySelectorAll("thead th");

const SHORT = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function setCols(show){
    table.querySelectorAll("tr").forEach(r=>{
        [...r.children].forEach((c,i)=>{
            c.style.display = show.includes(i) ? "" : "none";
        });
    });
}

function showWeek(){
    setCols([0,1,2,3,4,5,6,7]);
    SHORT.forEach((d,i)=>headers[i+1].textContent=d);
    daySelect.style.display="none";
}

function showDay(i){
    setCols([0,i]);
    headers[i].textContent = FULL[i-1];
    daySelect.style.display="";
}

weekBtn.onclick = showWeek;
daysBtn.onclick = () => showDay(daySelect.selectedIndex+1);
daySelect.onchange = () => showDay(daySelect.selectedIndex+1);

// =====================
// TABLE SIZE
// =====================
const SIZE_MAP = {
    Normal: 1,
    Large: 1.5,
    Big: 2,
    Huge: 2.5,
    Enormus: 3
};

const sizeSelect = document.querySelector(".tableSize");

const BASE = {
    width: 100,
    font: parseFloat(getComputedStyle(table).fontSize)
};

function applySize(scale){
    table.style.width = BASE.width * scale + "%";
    table.style.fontSize = BASE.font * scale + "px";
    tableBtns.style.width = 5 * scale + "vw";
}

sizeSelect.onchange = () => {
    applySize(SIZE_MAP[sizeSelect.value] || 1);
};

// =====================
// INIT
// =====================
showWeek();
