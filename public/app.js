//LOGIN FORM

const loginform = document.getElementById("login_form");
console.log('loginform', loginform);

loginform && loginform.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const username = document.getElementById("usrname").value;
    const password = document.getElementById("psw").value;

    console.log(username);
    console.log(password);

    try{

        console.log("Entered the try block");

        const response = await fetch("http://localhost:3000/auth",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({username,password})
        });

        const data = await response.json();
        if(response.ok){
            alert(data.message || "Login successful");
            window.location.href = data.redirect;
        }else{
            alert(data.err || "Login failed!");
            if(data.redirect){
                window.location.href = data.redirect;
            }
        }

    }catch(error){
        console.error("Error during login: ",error);
        alert("Something went wrong");
    }

    
})









//SIGNUP FORM
const signup_form = document.getElementById("signup_form");
console.log('signupform', signup_form)

signup_form && signup_form.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const username = document.getElementById("usrname").value;
    const password = document.getElementById("psw").value;
    const confirmpassword = document.getElementById("confirm_psw").value;
    console.log(username);
    console.log(password);
    console.log(confirmpassword);

    try{
        const response = await fetch("http://localhost:3000/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({username,password,confirmpassword})
        })


        const data = await response.json();
        if(response.ok){
            alert(data.message || "Signup successful");
            if(data.redirect){
                window.location.href = data.redirect;
            }
        }else{
            alert(data.err);
        }


    }catch(error){
        console.log("Error: ",error);
        alert("Something went wrong");
    }
})








// DYNAMICALLY ADDING TASKS 
const toDoform = document.getElementById("toDoAdd_form");

toDoform.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const taskName = document.getElementById("taskInput").value;

    console.log(taskName);

    try{
        const response = await fetch("/toDoAdd",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({taskName})
        });

        const data = response.json();
        if(response.ok){
            alert(data.message || "Successfully task added");
            addTaskStylingDOM(taskName);
            document.getElementById("taskInput").value = "";
        }else{
            console.log(data.err || "Please check again. Task not added");
        }

    }catch(error){
        console.log("Error: ",error);
        alert("Something went wrong");
    }
})


// function to load existing tasks from the suer
loadTasks();

// FUNCTION FOR THE ADD TASK STYLING DOM

function addTaskStylingDOM(taskName){
    const taskContainer = document.getElementById("taskList");

    const taskItem = document.createElement("div");
    taskItem.classList.add("taskItem");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "10px";

    

    const taskText = document.createElement("span");
    taskText.textContent = taskName;

    checkbox.addEventListener("change",()=>{
        taskText.style.textDecoration = checkbox.checked ? "underline":"none";
    })



    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;

    deleteBtn.addEventListener("click",async ()=>{
        // passing the request
        if(taskName){
            await fetch(`/deleteTask/${taskName}`,{method:"DELETE"});
        }
        taskContainer.removeChild(taskItem);
    })

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    taskContainer.appendChild(taskItem);
}



// making tasks to be displayed for user when logged in

async function loadTasks(){
    try{
        const response = await fetch("/getTasks",{method:"GET"});
        const data = await response.json();
        console.log(data);

        if(response.ok){
            data.tasks.forEach(task=>{
                addTaskStylingDOM(task.task); 
            })
        }

    }catch(error){
        console.error("Error loading tasks: ",error);
    }
}