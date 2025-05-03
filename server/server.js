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
    host://*//,
    user://*//,
    createDatabaseTable:true,
    expiration:86400000,
    database://*//,
    password://*//,
    port://*//,
})


app.use(
    session({
        secret:/**/,
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
    host:/**/,
    user:/**/,
    password:/**/,
    database:/**/,
    port:/**/
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
