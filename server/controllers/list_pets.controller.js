const jwt = require('jsonwebtoken')
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const getPets = async (req, res) => {
    try{
        const access_token = req.cookies.access_token
        if (!access_token){
            return res.status(401).json({
                message:"Нет токена"
            });
        }

        const decoded = jwt.verify(access_token, process.env.JWT_SECRET)
        const userId = decoded.userId;

        const pets = await prisma.user_pets.findMany({
            where:{
                user_id: userId,
            },
            include:{
                breed:{
                    include:{
                        pet: true
                    }
                }
            }
        });

        res.status(200).json(pets)

    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Ошибка при получении питомцев' })
    }
}

module.exports = {
    getPets
}