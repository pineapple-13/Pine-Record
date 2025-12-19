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

const table = document.querySelector(".table");

table.addEventListener("input", function(){
    const tbody = document.querySelector("tbody");
    const lastTr = tbody.lastElementChild;
    const lastTd = lastTr.querySelectorAll("td");

    let rowEmpty = true

    for (const td of lastTd){
        if(td.textContent.trim() !== ""){
            rowEmpty = false;
            break;
        }
    }
    
    if(rowEmpty === false){
        const newTr = document.createElement("tr");
        newTr.innerHTML = `<td contenteditable=""></td>
                           <td contenteditable=""></td>
                           <td contenteditable=""></td>
                           <td contenteditable=""></td>
                           <td contenteditable=""></td>
                           <td contenteditable=""></td>
                           <td contenteditable=""></td>
                           <td contenteditable=""></td>`

        tbody.appendChild(newTr);
        console.log(newTr);
    }

});

