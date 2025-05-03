/*
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({path:"./.env"});
const bcrypt = require("bcryptjs");
const session = require("express-session"); // for getting username from the session data in adding tasks to server
const MySQLStore = require("express-mysql-session")(session);


//MySQL session store configuration
const sessionStore = new MySQLStore({
    expiration:86400000,
    createDatabaseTable:true,
    host:"localhost",
    user:"root",
    password:"9820256@MajorK",
    database:"ToDo",
    port: 3306
});



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname,"..","public"),{index:false}));

//Session middleware
app.use(
    session({
        secret: "43562cce5a832737acbb147d9ea6932400e2708da032d69b1b1acee73915368b",
        store:sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure:false,
            maxAge:86400000,
            httpOnly:true
        }
    })
);


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "9820256@MajorK",
    database: "ToDo",
    port: 3306
})

db.connect((err)=>{
    if(err){
        return console.error("Coonection is not establisted");
    }

    console.log("Successfully connected to MySQL!");
})




app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"..","public","login.html"));
})



// LOGIN PAGE BACKEND

app.post("/auth",async (req,res)=>{
    
    const {username, password} = req.body;
    console.log(username, password)
    if(!username || !password){
        return res.status(400).json({error:"Missing fields"});
    }

    const sql = `SELECT * FROM LOGIN WHERE username='${username}'`;
    console.log(sql);
    db.query(sql, async (err,result)=>{
        if(err){
            console.error("Database query error: ",err);
            return res.status(500).json({err:err.message});
        }

        if(result.length === 0){
            return res.status(404).json({error:"Username does not exists! Please create an acount",redirect: "/signup"});
        }
        
        const user = result[0];

        try{
            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                return res.status(401).json({error:"Incorrect password!"});
            }

            req.session.username = username;  // storing username in session 

            return res.json({message:"Login successful!",redirect: `/todo?username=${username}`});

        }catch(error){
            console.error("Password comparision error: ",error);
            return res.status(500).json({error:"Server error, please try again!"});
        }
        

    });
});



// SIGN UP PAGE BACKEND
app.post("/signup",(req,res)=>{
    const {username, password, confirm_password} = req.body;
    console.log(username);
    if(!username || !password || !confirm_password){
        return res.status(400).json({error:"All fields are required!"});
    }
    console.log("passed the fileds section");

    if(password !== confirm_password){
        return res.status(400).json({error:"Passwords do not match!"});
    }
    console.log("passed the password check");

    try{

        console.log("Entered the 'try'!");

        const checksql = "SELECT * FROM LOGIN WHERE username = ?";
        console.log("checked sql if any username");
        db.query(checksql,[username],async (err,result)=>{
            if(err){
                return res.status(500).json({error: err.message});
            }

            if(result.length>0){
                return res.status(400).json({error: "Username already exists!"});
            }

            const hashedPassword = await bcrypt.hash(password,10);
            const updateSql = "INSERT INTO LOGIN (username,password) VALUES (?,?)";
            db.query(updateSql,[username,hashedPassword],(err,result)=>{
                if(err){
                    return res.status(500).json({error:err.message});

                }

                // Automatically log in user after signup
                req.session.username = username;
                res.json({message:"Signup successful",redirect:`/todo?username=${username}`});
            })
        })

    }catch(error){
        res.status(500).json({error:"Server error, please try again!"});
    }


})





// SEINDING MAIN PAGE ToDo data to SERVER


app.get("/todo")



app.get("/todo",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"..","public","index.html"));
});



app.get("/signup",(req,res) => {
    res.sendFile(path.resolve(__dirname, "..","public","signup.html"));
})




// Backend functionality for Tasks
app.post("/add-task",(req,res)=>{
    const {task} = req.body;
    const username = req.session.username;

    console.log(username);

    if(!username){
        return res.status(401).json({error:"Unauthorized"});
    }

    if(!task){
        return res.status(400).json({error:"Task is required"});
    }

    const sql = "SELECT id FROM LOGIN WHERE username = ?";

    db.query(sql,[username],(err,result)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }

        const userId = result[0].id;
        const add_sql = "INSERT INTO TASKS (user_id,task) VALUES (?,?)";
        db.query(add_sql,[userId,task],(err,result)=>{
            if(err){
                res.status(500).json({error:err.message});
            }
            res.json({message:"Task added successfully"});
        })

    })
})


//FETCH TASKS

app.get("/get-tasks", (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const sqlGetUser = "SELECT id FROM LOGIN WHERE username = ?";
    db.query(sqlGetUser, [username], (err, userResult) => {
        if (err || userResult.length === 0) {
            return res.status(500).json({ error: "Failed to get user ID" });
        }

        const userId = userResult[0].id;
        const sqlQuery = "SELECT id, task, status FROM TASKS WHERE user_id = ?";

        db.query(sqlQuery, [userId], (err, taskResults) => {
            if (err) {
                return res.status(500).json({ error: "Failed to get tasks" });
            }
            res.json(taskResults);
        });
    });
});






//DELETE TASKS
app.delete("/delete-task/:id",(req,res)=>{
    const taskId = req.params.id;
    const username = req.session.username;
    console.log(taskId);

    if(!username){
        res.status(401).json({error:"Unauthorized"});
    }

    const delete_sql = "DELETE FROM TASKS WHERE id = ? ";

    db.query(delete_sql, [taskId], (err,result)=>{
        if(err){
            return res.status(500).json({error: err.message});
        }

        res.json({message: "Task deleted successfully!"});
    })
})




app.listen(3000,()=>{
    console.log("Successfully running on port 3000!");
})


*/






const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname,"..","public")));

// session
const sessionStore = new MySQLStore({
    host:"localhost",
    user:"root",
    createDatabaseTable:true,
    expiration:86400000,
    database:"ToDo",
    password:"9820256@MajorK",
    port:3306,
})


app.use(
    session({
        secret:"43562cce5a832737acbb147d9ea6932400e2708da032d69b1b1acee73915368b",
        store:sessionStore,
        saveUninitialized:false,
        resave:false,
        cookie:{
            secure:false,
            httpOnly:true,
            maxAge:86400000,
        }
    })
)



const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"9820256@MajorK",
    database:"ToDo",
    port:3306
})

db.connect((err)=>{
    if(err){
        return console.error("Database connection not established");
    }

    console.log("Successfully connected to MySQL");
})


// sending login page when local host is running
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"..","public","login.html"));
})



// Login page api 
app.post("/auth",async (req,res)=>{
    const {username,password} = req.body;
    console.log(username,password);
    if(!username || !password){
        return res.status(400).json({error:"Missing fields!"});
    }

    const sql = "SELECT * FROM LOGIN WHERE username = ?";
    console.log(sql);
    db.query(sql,[username],async (err,result)=>{
        console.log("entered query block");
        if(err){
            return res.status(500).json({err:err.message});
        }

        if(result.length == 0){
            return res.status(404).json({err:"Username does not exist. Please sign up!",redirect:"/signup.html"});
        }

        user = result[0]; // since we ar selecting all the rows it might be an array or rows

        try{
            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                return res.status(404).json({err:"Incorrect Password"});
            }

            req.session.userid = user.id;
            console.log(req.session.userid);


            return res.status(200).json({message:"Login successful!",redirect: `/todo?userId=${req.session.userid}`});

        }catch(error){
            return res.status(500).json({err:"Server error. Please try again"});
        }
    })
})



//Sign up page backend
app.post("/signup",(req,res)=>{
    const {username, password, confirmpassword} = req.body;
    console.log(username);
    console.log(password);
    console.log(confirmpassword);
    if(!username || !password || !confirmpassword){
        return res.status(400).json({error:"Missing fileds"});
    }
    console.log("Passeed missing fileds condition check");

    if(password != confirmpassword){
        return res.status(400).json({error:"Password mismatch. Please try again!"});
    }

    console.log("Passed password match condition");

    try{

        console.log("Entered the try block");
        const checksql = "SELECT * FROM LOGIN WHERE username = ?";
        console.log(checksql);
        db.query(checksql,[username],async (err,result)=>{
            if(err){
                res.status(400).json({err:err.message});
            }

            if(result.length>0){
                res.status(400).json({err:"Username already exists"});
            }

            const hashedPassword = await bcrypt.hash(password,10);
            console.log(hashedPassword);
            const updatesql = "INSERT INTO LOGIN(username,password) VALUES (?,?)";
            console.log(updatesql);

            db.query(updatesql,[username,hashedPassword],(err,result)=>{
                console.log("entered updatesql query block");
                if(err){
                    console.log("entered if block");
                    return res.status(500).json({err:err.message});
                }
                console.log("if block condition checked successfully");
                console.log(result.insertId);

                req.session.userid = result.insertId;   // not an array or rows. so only result.id will do the work
                console.log(req.session.userid);
                return res.status(200).json({message:"Signup Successful",redirect:`/todo?userid=${req.session.userid}`});
            })

        })

    }catch(error){
        return res.status(500).json({error:"Server error"});
    }
})




// ToDo add task backend server mysql

app.post("/toDoAdd",(req,res)=>{
    const {taskName} = req.body;
    console.log(taskName);
    if(!taskName){
        return res.status(400).json({err:"Missing fields"});
    }

    if(!req.session.userid){
        return res.status(401).json({err:"User not logged in!"});
    }

    console.log("passed if not taskname condition");
    
    const insertsql = "INSERT INTO TASKS(user_id,task) VALUES (?,?)";

    console.log(insertsql);
    console.log(req.session.userid);

    db.query(insertsql,[req.session.userid,taskName],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({err:err.message});
        }

        return res.status(200).json({message:"Successfully added task!"});
    })
})










// ToDo retireving tasks to display them when a user logs in
app.get("/getTasks",(req,res)=>{
    console.log("entered getTasks");
    const userId = req.session.userid;
    console.log(userId);
    if(!userId){
        return res.status(401).json({err:"User not logged in!"});
    }

    const sql = "SELECT * FROM TASKS WHERE user_id = ?";

    db.query(sql,[userId],(err,result)=>{
        console.log(result);
        if(err){
            return res.status(500).json({err:err.message});
        }

        return res.status(200).json({tasks:result});
    })
})








// ToDo deleting tasks when delete button pressed
app.delete("/deleteTask/:taskName",(req,res)=>{
    const userId = req.session.userid;
    const taskName = req.params.taskName;
    console.log(userId);
    console.log(taskName);

    const sql = "DELETE FROM TASKS WHERE user_id = ? AND task = ?";
    db.query(sql,[userId,taskName],(err,result)=>{
        if(err){
            return res.status(500).json({err:err.message});
        }

        return res.status(200).json({message : result.message});
    })
})


app.get("/todo",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"..","public","dashboard.html"));
})


app.listen(3000,()=>{
    console.log("port is running of 3000!");
})