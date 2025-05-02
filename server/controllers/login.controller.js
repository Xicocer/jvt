const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('../generated/prisma/client')

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET

const login = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if (!user){
            return res.status(404).json({message:"Пользователь не зарегестрирован"})
        }

        const IsPasswordValid = await bcrypt.compare(password, user.password)

        if (!IsPasswordValid){
            return res.status(401).json({message:"Пароль неверен"})
        }

        const accessToken = jwt.sign({userId: user.id, userRole:user.role}, process.env.JWT_SECRET, {
                    expiresIn: '3h',
                });
        
        const refreshToken = jwt.sign({userId: user.id, userRole:user.role}, process.env.JWT_REFRESH_SECRET,{
            expiresIn: '7d'
        })

        res.cookie('access_token', accessToken,{
                    httpOnly:true,
                    maxAge:3*60*60*1000,
                    sameSite:"lax",
                })
        
        res.cookie('refresh_token', refreshToken,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"lax",
        })
        
        await prisma.refresh.create({
            data:{
                refreshtoken: refreshToken,
                user_id:user.id,
            }
        })

        res.status(201).json({
            message:"Вход выполнен успешно",
            accessToken:accessToken
        });


}catch(error){
    console.error(error)
    res.status(500).json({message:'Ошибка сервера'})
}

}

module.exports = {
    login
}