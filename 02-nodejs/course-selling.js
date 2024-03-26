const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

async function dbConnect() {
    try {
        const connectionString = await mongoose.connect("mongodb+srv://vishu:vishu123@cluster0.6q8ywme.mongodb.net/Courses");
    } catch (error) {
        console.log(error);
    }
}
dbConnect();



//Admin Model 

const adminSchema = new mongoose.Schema({
    "username": String,
    "password": String,
})

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

// Create model
const courseModel = mongoose.model('Course', courseSchema);
const adminModel = mongoose.model("adminCredentials", adminSchema);
// Admin routes
app.post('/admin/signup', async (req, res) => {
    const username = req.body.username;
    const adminusername = await adminModel.findOne({ username });
    callback(adminusername)
    function callback(username) {
        if (username) {
            return res.status(201).send("Admin Alredy Exists");
        }
        else {
            const data = req.body;
            const newAdmin = new adminModel(data);
            newAdmin.save();
            return res.status(200).send("Admin Created Successfully");
        }

    }
});

app.post('/admin/login', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const isUserExist = await adminModel.findOne({ username, password });
    if (isUserExist) {
        return res.status(200).send("Admin Logged In");
    }
    else {
        return res.status(200).send("Username and password must be wrong or signup")
    }

});

app.post('/admin/courses', async (req, res) => {
    const courseContent = req.body;
    const username = req.headers.username;
    const isAccess = await adminModel.findOne({ username });
    console.log(isAccess);
    if (!isAccess) {
        return res.status(201).send("Access Denied for Course");
    }
    else {
        courseContent.instructor = username;
        console.log(courseContent);
        const coursedata = new courseModel(courseContent);
        coursedata.save();
        return res.status(200).send("Course Create Successfully")
    }
});

app.get('/admin/courses/:courseId', async (req, res) => {
    const courses = await courseModel.find({ "instructor": req.params.courseId });
    res.status(200).json({ courses });

});

app.get('/admin/courses', async (req, res) => {

    const courses = await courseModel.find({});
    res.status(200).json({ courses });

});

// User routes
app.post('/users/signup', (req, res) => {
    const usersDetail = req.body;
    if (USERS.length > 0) {
        USERS.map((data) => {
            if (data.username == usersDetail.username) {
                return res.status('409').send("Username Already Exist")
            }
        })
    }

    USERS.push(adminDetail);
    res.status(200).send("Admin Craeted Successfully ")
});

app.post('/users/login', (req, res) => {
    const adminUsername = req.headers.username;
    const password = req.headers.password;
    console.log(adminUsername);
    USERS.map((data) => {
        if (data.username == adminUsername && data.password == password) {
            res.status(200).send("hey Welcome Users ! " + data.username);
            return;
        }
        else {
            res.status(404).send("User Not Exists");
        }
    })
});

app.get('/users/courses', (req, res) => {
    return res.status(200).send(COURSES);
});

app.post('/users/courses/:courseId', (req, res) => {
    const courseId = req.query.id;
    COURSES.forEach((data) => {
        if (data.id == courseId) {
            const access = req.headers.username;
            data.access = access;
        }
    })

});

app.get('/users/purchasedCourses', (req, res) => {
    // logic to view purchased courses
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});