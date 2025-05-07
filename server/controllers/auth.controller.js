const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try{
        const {first_name, last_name, patronymic, email, password} = req.body

        const existUser = await prisma.user.findUnique({ where: { email } })
        if (existUser){
            return res.status(203).json({message: 'Пользователь с таким e-mail существует'})
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

        const accessToken = jwt.sign({userId: user.id, userRole:user.role}, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        res.cookie('access_token', accessToken,{
            httpOnly:true,
            maxAge:3*60*60*1000,
            sameSite:"lax",
        })

        res.status(201).json({
            message:"Регистрация прошла усешно",
            accessToken:accessToken
        });
    }catch (error){
        console.error(error)
        res.status(500).json({message:'Ошибка сервера'})
    }
};

module.exports = {
    register
};