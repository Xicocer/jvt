const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('../generated/prisma/client')

const prisma = new PrismaClient()

router.post('/register', async (req, res) =>{
    try{
        const {first_name, last_name, patronymic, email, password, img} = req.body

        const existUser = await prisma.user.findUnique({ where: { email } })
        if (existUser){
            return res.status(403).json({message: 'Пользователь с таким e-mail существует'})
        }

        const passwordHashed = await bcrypt.hash(password, 7)

        const user = await prisma.user.create({
            data:{
                first_name,
                last_name,
                patronymic,
                email,
                password:passwordHashed,
                img,
            },
        })

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
            expiresIn: '3h',
        })
        res.status(201).json({token})
    }catch (error){
        console.error(error)
        res.status(500).json({message:'Ошибка сервера'})
    }
})

module.exports = router