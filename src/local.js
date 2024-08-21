import cors from 'cors';
import express, { Router } from 'express';
import { connectToDB ,db} from "./db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json("server is running successfully!");
})

//signin

app.post('/signin', async(req, res) => {
    await db.collection("login").findOne({Email:req.body.email})
    .then((result)=>{
        if(result?.Password===req.body.password){
            res.json({message:"login success", values:result})
        } else {
            res.json({error:"user not found"})
        }
    })
    .catch((e)=>console.log(e))
})

//signup

app.post('/signup', async(req, res) => {
    await db.collection("login").insertOne({Email:req.body.email,Name:req.body.name,Mobile:req.body.mobile,Password:req.body.password})
    .then((result)=>{
        if(result){
            res.json({message:"signup success", values:result})
        } else {
            res.json({error:"sign up failed"})
        }
    })
})

//forgotpass

app.post('/resetpassword', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        const result = await db.collection("login").updateOne(
            { Email: email },
            { $set: { Password: newPassword } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: "Password reset successful" });
        } else {
            res.status(404).json({ error: "No user found with this email address" });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});

//addmeal

app.post('/meals', async (req, res) => {
    await db.collection("meals").insertOne({
      breakfast: req.body.breakfast,
      lunch: req.body.lunch,
      dinner: req.body.dinner,
    })
    .then((result) => {
      if (result) {
        res.json({ message: "Meal data saved successfully", values: result });
      } else {
        res.json({ error: "Failed to save meal data" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to save meal data", details: error });
    });
  });
  
//profile




app.use(cors());
app.use(bodyParser.json());

const users = [
  {
    Gmail: 'user@example.com',
    Password: bcrypt.hashSync('password123', 8),
    Phone: '1234567890',
    Registerno: 'REG1234',
  },
];

const JWT_SECRET = 'your_jwt_secret_key';

// Login route
app.post('/login', (req, res) => {
  const { Gmail, Password } = req.body;

  const user = users.find((u) => u.Gmail === Gmail);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isPasswordValid = bcrypt.compareSync(Password, user.Password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid Password' });
  }

  const token = jwt.sign({ id: user.Gmail }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({
    auth: {
      Gmail: user.Gmail,
      Phone: user.Phone,
      Registerno: user.Registerno,
      token,
    },
  });
 });




connectToDB(() => {
    app.listen(9000, () => {
        console.log("server running at 9000");
    })
})
