const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const app = express();

connectDb();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


const authMiddleware = (req, res, next) => {
    console.log("Headers received:", req.headers);
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message : 'No token provided'});

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        req.userId = decoded.userId;
        next();
    }catch(err){
        res.status(401).json({ message: 'Invalid token' });
    }
}


//Signup 
app.post('/signup', async (req,res) =>{
    try{
         const {email, password,fullName, userName} = req.body;

    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error : 'Email already registered'});

    const user = new User({email, password, fullName, userName});
    // res.send(user);
    // console.log(user);
    await user.save();

    res.json({
        message: "Signup successful. Please login to continue.",
        user: { id: user._id, email: user.email, fullName: user.fullName, userName: user.userName }
    });
    }catch(err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
});

//Login
app.post('/login', async (req, res) => {
    try{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message: 'invalide Credentials'});

    const passMatch = await bcrypt.compare(password, user.password);
    if(!passMatch) return res.status(400).json({message: "Invalide Credentials"});

    const token = jwt.sign(
        {userId: user._id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn : '1h'}
    );

    res.status(200).json({message : "Login Successful", token : token});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})

//Forgot Password
app.post('/forgot-pass', async (req, res) => {
    try{
    const {email, newPassword} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message: 'User not found'});

    user.password = newPassword;
    await user.save();

    res.json({message: 'Password reset successfully'});
    }catch(err){
        console.error('Error while reseting the password', err);
    }
});


// Protected Route
app.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId, '-password'); // Exclude password directly
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// const user = new User({
//     email : 'pcl@gmail.com',
//     password : 'abcd',
//     fullName : 'Pranav Panchal',
//     userName : 'pranav_photography'
// });

// user.save().then((res) => {
//     console.log('User saved', res);
// }).catch ((err) => {
//     console.log(err);
// });

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});