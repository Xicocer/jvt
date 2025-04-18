// const express = require('express')
// const router = express.Router()
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const { PrismaClient } = require('../generated/prisma/client')

// const prisma = new PrismaClient()

// const JWT_SECRET = process.env.JWT_SECRET

// router.post('/login', async(req, res)=>{
//     const {email, password} = req.body

//     try{
//         const user = await prisma.user.findUnique({email})

//         if (!user){
//             return res.status(404).json({message:"Пользователь не зарегестрирован"})
//         }

//         const IsPasswordValid = await bcrypt.compare(password, user.password)

//         if (!IsPasswordValid){
//             return res.status(401).json({message:"Пароль неверен"})
//         }
//     }
// })