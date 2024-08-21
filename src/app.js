import cors from 'cors';
import express from 'express';
import { connectToDB,db } from "./db.js";
import bodyParser from 'body-parser';
// import { sendVerificationEmail } from './mailer.js'; // Make sure to use the correct path and .js extension
import crypto from 'crypto';
import { sendVerificationEmail } from './mailer.js';

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
const verificationCodes = {};
app.post('/send-verification', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    // Generate a random verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
     verificationCodes[email] = { code: verificationCode, expiresAt: Date.now() + 10 * 60 * 1000 };

    try {
        await sendVerificationEmail(email, verificationCode);
        // Store the verification code somewhere safe or associate it with the user (e.g., in a database)
        res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});

   
    

app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
console.log(req.body);

    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code are required' });
    }
    console.log('Verification codes store:', verificationCodes);
    const record = verificationCodes[email];

    if (!record) {
        return res.status(400).json({ error: 'No verification code sent to this email' });
    }

    if (record.code !== code) {
        return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Code is valid
    delete verificationCodes[email]; // Clean up the code
    res.status(200).json({ message: 'Verification successful' });
});

app.post('/signin', async(req, res) => {
   const userdata= await db.collection("ast").findOne({email:req.body.email})
   if(!userdata){
    return res.json({
        status:"fail",
        message:"user unsucessfully sign"
    })}
   if(req.body.password!==userdata.password){
    return res.json({
        status:"fail",
        message:"password missmatch"
        })
   }
   else(
   res.json({
    status:"success",
    message:"successfully login"
   }))

   
   
})
app.post('/signup',async(req,res)=>{
    await db.collection("ast").insertOne({email:req.body.email,mobile:req.body.mobile,password:req.body.password,name:req.body.name})
    .then((result)=>{
        
        res.json(result)
    })
    .catch((e)=>console.log(e))
})

connectToDB(() => {
    app.listen(9000, () => {
        console.log("server running at 9000");
    })
})
