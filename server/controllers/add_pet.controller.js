const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const addPet = async (req,res) =>{
    try{
        const access_token = req.cookies.access_token

        if (!access_token){
            return res.status(401).json({
                message: "Доступ запрещен"
            })
        }

        let decoded

        try{
            decoded = jwt.verify(access_token, process.env.JWT_SECRET)
        }catch (err){
            return res.status(403).json({
                message:"Токен недействительный или просрочен"
            })
        }

        const {name, age, gender, breedId} = req.body;

        const breed = await prisma.breed.findUnique({
            where:{id: breedId},
            include:{pet:true}
        });

        if (!breed){
            return res.status(404).json({
                message:'Порода не найдена'
            })
        }

        const newPet = await prisma.user_pets.create({
            data: {
                name,
                age: parseInt(age),
                gender,
                breed: { connect: { id:breedId } },
                user: { connect: { id:decoded.userId } }
            }
        });

        res.status(201).json({
            message:'Питомец добавлен',
            pet: newPet,
        })
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Ошибка добавлния питомца'})
    }
}

module.exports = {
    addPet
};