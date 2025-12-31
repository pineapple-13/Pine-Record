// PINE TASK
let tasksVal = "";


const tasksInput = document.getElementById("taskInput");
const tasksBtn = document.getElementById("taskBtn");
const tasksList = document.getElementById("taskList");
    
    // ADDING A TASK
function getInput(){
    tasksVal= tasksInput.value;
    if(tasksVal.trim() === "") return;

        tasksList.classList.remove("empty")

        const li = document.createElement("li");
        li.classList.add("taskLi");

        const p = document.createElement("p");
        p.classList.add("liP");
        p.textContent = tasksVal;

        const btns = document.createElement("div");
        btns.classList.add("liBtns");

        const doneDiv = document.createElement("div");
        doneDiv.classList.add("doneDiv");

        const doneBtn = document.createElement("button");
        doneBtn.classList.add("doneBtn");
        doneBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check"><path d="M20 6 9 17l-5-5"/></svg>`;
        
        doneBtn.addEventListener("click", function(){
            p.classList.toggle("completed");
            this.classList.toggle("checked");
        });
        
        const doneText = document.createElement("p");
        doneText.textContent = "Done";

        doneDiv.appendChild(doneBtn);
        doneDiv.appendChild(doneText);

        const trashDiv = document.createElement("div");
        trashDiv.classList.add("trashDiv");

        const trashBtn = document.createElement("button");
        trashBtn.classList.add("trashBtn"); 
        trashBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;       

        trashBtn.addEventListener("click", function(){
            const li = this.closest(".taskLi");
            li.remove();

            if (tasksList.children.length === 0){
                tasksList.classList.add("empty");
                console.log("hi")
            }
        })

        const trashText = document.createElement("p");
        trashText.textContent = "Trash"

        trashDiv.appendChild(trashBtn);
        trashDiv.appendChild(trashText);

        btns.appendChild(doneDiv);
        btns.appendChild(trashDiv);

        li.appendChild(p);
        li.appendChild(btns);

        tasksList.appendChild(li);

        tasksInput.value = "";
        tasksVal = "";
}

tasksInput.addEventListener("keydown", function(e){
    if (e.key === "Enter"){
        getInput();
    }
})

// Pine Table
const table = document.querySelector(".table");
const tbody = table.querySelector("tbody");
const tableBtns = document.querySelector(".tableBtns");
const ultDiv = document.querySelector(".ultDiv");

let currentSizeClass = ""; // "", "large", "big", "huge", "enormous"
let savedWeekSizeClass = ""


// ---------- HELPERS ----------
function getRowIndex(tr) {
    return [...tbody.children].indexOf(tr);
}

function createEmptyRow(isBuffer = false) {
    const tr = document.createElement("tr");
    tr.classList.add("trBody")

    if (currentSizeClass) {
        tr.classList.add(currentSizeClass);
    }

    if (isBuffer) tr.classList.add("buffer");
    for (let i = 0; i < 8; i++) {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.spellcheck = false
        tr.appendChild(td);
    }

    return tr;
}

// Show buttons on row hover or button hover
function attachHoverEffect(tr, btnRow) {
    let rowHover = false;
    let btnHover = false;

    const update = () => {
        if (rowHover || btnHover) {
            btnRow.classList.add("show");
        } else {
            btnRow.classList.remove("show");
        }
    };

    tr.addEventListener("mouseenter", () => {
        rowHover = true;
        update();
    });
    tr.addEventListener("mouseleave", () => {
        rowHover = false;
        update();
    });
    btnRow.addEventListener("mouseenter", () => {
        btnHover = true;
        update();
    });
    btnRow.addEventListener("mouseleave", () => {
        btnHover = false;
        update();
    });
}

// Create buttons for a row
function createRowButtons(tr, refBtn = null) {
    if (tr.classList.contains("buffer")) return; // No buttons for buffer row

    const btnRow = document.createElement("div");
    btnRow.className = "rowBtns";
    btnRow._row = tr;

    btnRow.innerHTML = `
        <svg class="del" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        <svg class="add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;

    if (currentSizeClass) {
        btnRow.classList.add(currentSizeClass);
        btnRow.querySelectorAll(".del, .add").forEach(svg => svg.classList.add(currentSizeClass));
    }

    if (refBtn) {
        tableBtns.insertBefore(btnRow, refBtn.nextSibling);
    } else {
        const rowIndex = getRowIndex(tr);
        const ref = tableBtns.children[rowIndex + 1];
        if (ref) tableBtns.insertBefore(btnRow, ref);
        else tableBtns.appendChild(btnRow);
    }

    attachHoverEffect(tr, btnRow);
    attachHeadHover();

    const ro = new ResizeObserver(() => {
        btnRow.style.height = tr.offsetHeight + "px";
    });
    ro.observe(tr);

    // optional: set initial height immediately
    btnRow.style.height = tr.offsetHeight + "px";


    btnRow.querySelector(".del").addEventListener("click", () => {
        tr.remove();
        btnRow.remove();
        if (tbody.children.length === 0) {
            const newBuffer = createEmptyRow(true);
            tbody.appendChild(newBuffer);
        }
    });

    btnRow.querySelector(".add").addEventListener("click", () => {
        const newRow = createEmptyRow();
        tr.after(newRow);
        createRowButtons(newRow);
    });

    return btnRow;
}

// Header buttons
const headRow = table.querySelector("thead");
const headerBtns = document.createElement("div");
headerBtns.className = "headBtn";
headerBtns.innerHTML = `<svg class="add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;
tableBtns.appendChild(headerBtns);

// Header add button logic: add row below header and buttons
function attachHeadHover(){
    let rowHover = false;
    let btnHover = false;

    const update = () => {
        if (rowHover || btnHover) {
            headerBtns.classList.add("show");
        } else {
            headerBtns.classList.remove("show");
        }
    };

    headRow.addEventListener("mouseenter", () => {
        rowHover = true;
        update();
    });
    headRow.addEventListener("mouseleave", () => {
        rowHover = false;
        update();
    });
    headerBtns.addEventListener("mouseenter", () => {
        btnHover = true;
        update();
    });
    headerBtns.addEventListener("mouseleave", () => {
        btnHover = false;
        update();
    });
}

attachHeadHover();


headerBtns.querySelector(".add").addEventListener("click", () => {
    const newRow = createEmptyRow();
    tbody.insertBefore(newRow, tbody.firstChild); // add row immediately below header
    createRowButtons(newRow, headerBtns); // add buttons right below header buttons
});

// Start with one buffer row at the end
const bufferRow = createEmptyRow(true);
tbody.appendChild(bufferRow);


// ---------- BUFFER LOGIC ----------
table.addEventListener("input", () => {
    const rows = [...tbody.children];
    const lastRow = rows[rows.length - 1];

    if ([...lastRow.children].some(td => td.textContent.trim() !== "")) {
        if (lastRow.classList.contains("buffer")) {
            lastRow.classList.remove("buffer");
            createRowButtons(lastRow);
            const newBuffer = createEmptyRow(true);
            tbody.appendChild(newBuffer);
        }
    }

});


// Make all normal rows draggable except buffer
function makeRowsDraggable() {
    [...tbody.children].forEach(tr => {
        if (!tr.classList.contains("buffer")) {
            tr.draggable = true;
        }
    });
}

// Update draggable status whenever rows change
const observer = new MutationObserver(makeRowsDraggable);
observer.observe(tbody, { childList: true });
makeRowsDraggable();

// // ---------- DRAG & DROP ----------
let draggedRow = null;
const allBtns = [...tableBtns.children].filter(b => b.classList.contains("rowBtns"));


tbody.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "TR" && !e.target.classList.contains("buffer")) {
        draggedRow = e.target;
        e.dataTransfer.effectAllowed = "move";

        // Hide all row buttons while dragging
        [...tableBtns.children].forEach(btn => btn.style.display = "none");

        // Style the actual row while dragging
        draggedRow.style.background = "#4a3022ff";

        // Create a fully opaque ghost
        const ghost = document.createElement("div");
        ghost.style.width = "0px";
        ghost.style.height = "0px";
        ghost.style.opacity = "0";
        ghost.style.position = "absolute";
        ghost.style.top = "-1000px";
        document.body.appendChild(ghost);

        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    }
});


tbody.addEventListener("dragover", (e) => {
    e.preventDefault();
    const tr = e.target.closest("tr");
    if (!tr || tr === draggedRow || tr.classList.contains("buffer")) return;

    const rect = tr.getBoundingClientRect();
    const next = (e.clientY - rect.top) / rect.height > 0.5;
    tbody.insertBefore(draggedRow, next ? tr.nextSibling : tr);

    // Move buttons as well
    const draggedBtn = [...tableBtns.children].find(b => b._row === draggedRow);
    const targetBtn = [...tableBtns.children].find(b => b._row === tr);
    if (draggedBtn && targetBtn) {
        tableBtns.insertBefore(draggedBtn, next ? targetBtn.nextSibling : targetBtn);
    }
});

document.addEventListener("dragover", (e) => {
    if(draggedRow){
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }
})

tbody.addEventListener("dragend", () => {
    
    [...tableBtns.children]
        .forEach(btn => btn.style.display = "");

    draggedRow.style.background = "";
    

    draggedRow = null;
});

tbody.addEventListener("keydown", (e) => {
    if (e.target.tagName !== "TD") return;

    const tr = e.target.parentElement;
    const tds = [...tr.children];
    const tdIndex = tds.indexOf(e.target);
    const trs = [...tbody.children];
    const trIndex = trs.indexOf(tr);

    if (!e.ctrlKey) return; // only act when Ctrl is pressed

    let nextCell = null;

    switch (e.key) {
        case "ArrowRight":
            if (tdIndex < tds.length - 1) nextCell = tds[tdIndex + 1];
            break;
        case "ArrowLeft":
            if (tdIndex > 0) nextCell = tds[tdIndex - 1];
            break;
        case "ArrowDown":
            if (trIndex < trs.length - 1) nextCell = trs[trIndex + 1].children[tdIndex];
            break;
        case "ArrowUp":
            if (trIndex > 0) nextCell = trs[trIndex - 1].children[tdIndex];
            break;
    }

    if (nextCell) {
        e.preventDefault();
        nextCell.focus();

        // optional: place cursor at the end of text
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
    }
});

const weekBtn = document.querySelector(".week");
const daysBtn = document.querySelector(".days");
const daySelect = document.querySelector(".daySel");
const tableSize = document.querySelector(".tableSize");
const dayNamesShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const dayNamesFull  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const headerCells = table.querySelectorAll("thead th");


let currentMode = "week";

function setColumnVisibility(visibleIndexes) {
    const allRows = table.querySelectorAll("tr");

    allRows.forEach(row => {
        [...row.children].forEach((cell, index) => {
            cell.style.display = visibleIndexes.includes(index)
                ? ""
                : "none";
        });
    });
}

function updateHeaders(mode, activeDayIndex = null) {
    for (let i = 1; i <= 7; i++) {
        if (mode === "week") {
            headerCells[i].textContent = dayNamesShort[i - 1];
        } else {
            if (i === activeDayIndex) {
                headerCells[i].textContent = dayNamesFull[i - 1];
            } else {
                headerCells[i].textContent = "";
            }
        }
    }
}

function setDayColumnWidths() {
    // Set TIME column smaller and the selected day column wider
    const ths = table.querySelectorAll("th");
    ths.forEach((th, index) => {
        if (index === 0) th.style.width = "25%"; // time
        else th.style.width = "75%"; // active day
    });

    const rows = tbody.querySelectorAll("tr");
    rows.forEach(tr => {
        tr.querySelectorAll("td").forEach((td, index) => {
            if (index === 0) td.style.width = "25%";
            else td.style.width = "75%";
        });
    });
}

function resetColumnWidths() {
    const ths = table.querySelectorAll("th");
    const width = 100 / 8 + "%"; // 8 columns including TIME
    ths.forEach(th => th.style.width = width);

    const rows = tbody.querySelectorAll("tr");
    rows.forEach(tr => {
        tr.querySelectorAll("td").forEach(td => td.style.width = width);
    });
}


function showWeek() {
    currentMode = "week";

    // show all columns
    setColumnVisibility([0,1,2,3,4,5,6,7]);
    updateHeaders("week");

    resetColumnWidths();
    daySelect.style.display = "none";
    tableSize.style.display = "initial";

    weekBtn.classList.add("active");
    daysBtn.classList.remove("active");
}

function showDay(dayIndex) {
    currentMode = "day";

    // Always show TIME (0) + selected day
    setColumnVisibility([0, dayIndex]);
    updateHeaders("day", dayIndex);

    setDayColumnWidths()

    daySelect.style.display = "initial";
    tableSize.style.display = "none";

    daysBtn.classList.add("active");
    weekBtn.classList.remove("active");
}



function changeSize(tableIndex){

    if(currentMode !== "week") return;

    savedWeekSizeIndex = tableIndex;

    const rows = [...tbody.children];
    const rowBtns = [...document.querySelectorAll(".rowBtns")];
    const trHead = document.querySelector(".trHead");
    const del = [...document.querySelectorAll(".del")];
    const add = [...document.querySelectorAll(".add")];

    const classes = ["large","big","huge","enormous"]

    currentSizeClass = "";


    table.classList.remove(...classes);
    tableBtns.classList.remove(...classes);
    // ultDiv.classList.remove(...classes);
    trHead.classList.remove(...classes);
    rows.forEach(tr => tr.classList.remove(...classes));
    headerBtns.classList.remove(...classes);
    rowBtns.forEach(tr => tr.classList.remove(...classes));
    del.forEach(tr => tr.classList.remove(...classes));
    add.forEach(tr => tr.classList.remove(...classes));

    

    if(tableIndex === 1){
        currentSizeClass = "large";
        savedWeekSizeClass = "large"

        rows.forEach(tr => tr.classList.add("large"));
        rowBtns.forEach(tr => tr.classList.add("large"));
        del.forEach(tr => tr.classList.add("large"));
        add.forEach(tr => tr.classList.add("large"));

        // ultDiv.classList.add("large");

        table.classList.add("large");

        tableBtns.classList.add("large");

        trHead.classList.add("large");
        headerBtns.classList.add("large");

        console.log("booo")
    }
    else if(tableIndex === 2){
        currentSizeClass = "big";
        savedWeekSizeClass = "big"

        table.classList.add("big");
        trHead.classList.add("big");
        rows.forEach(tr => tr.classList.add("big"));
        tableBtns.classList.add("big");
        headerBtns.classList.add("big");
        rowBtns.forEach(tr => tr.classList.add("big"));
        del.forEach(tr => tr.classList.add("big"));
        add.forEach(tr => tr.classList.add("big"));
    }
    else if(tableIndex === 3){
        currentSizeClass = "huge";
        savedWeekSizeClass = "huge"

        table.classList.add("huge");
        trHead.classList.add("huge");
        rows.forEach(tr => tr.classList.add("huge"));
        tableBtns.classList.add("huge");
        headerBtns.classList.add("huge");
        rowBtns.forEach(tr => tr.classList.add("huge"));
        del.forEach(tr => tr.classList.add("huge"));
        add.forEach(tr => tr.classList.add("huge"));
    }
    else if(tableIndex === 4){
        currentSizeClass = "enormous";
        savedWeekSizeClass = "enormous"

        table.classList.add("enormous");
        trHead.classList.add("enormous");
        rows.forEach(tr => tr.classList.add("enormous"));
        tableBtns.classList.add("enormous");
        headerBtns.classList.add("enormous");
        rowBtns.forEach(tr => tr.classList.add("enormous"));
        del.forEach(tr => tr.classList.add("enormous"));
        add.forEach(tr => tr.classList.add("enormous"));
    }
}

function resetTableSize() {
    const classes = ["large", "big", "huge", "enormous"];

    currentSizeClass = "";

    table.classList.remove(...classes);
    tableBtns.classList.remove(...classes);
    headerBtns.classList.remove(...classes);
    document.querySelector(".trHead")?.classList.remove(...classes);

    tbody.querySelectorAll("tr").forEach(tr => tr.classList.remove(...classes));
    document.querySelectorAll(".rowBtns").forEach(btn => btn.classList.remove(...classes));
    document.querySelectorAll(".del, .add").forEach(icon => icon.classList.remove(...classes));

    tableSize.selectedIndex = 0;
}


weekBtn.addEventListener("click", () => {
    showWeek();
    
    if (savedWeekSizeIndex > 0) {
        tableSize.selectedIndex = savedWeekSizeIndex;
        changeSize(savedWeekSizeIndex);
    }

});

daysBtn.addEventListener("click", () => {
    const selectedIndex = daySelect.selectedIndex + 1;

    resetTableSize();
    tableSize.selectedIndex = 0;

    showDay(selectedIndex);
});

showWeek();

daySelect.addEventListener("change", () => {
    if (currentMode !== "day") return;

    const selectedIndex = daySelect.selectedIndex + 1;
    showDay(selectedIndex);
});

tableSize.addEventListener("change", () =>{
    if(currentMode !== "week") return;
    const selectedIndex = tableSize.selectedIndex;

    changeSize(selectedIndex);
})


