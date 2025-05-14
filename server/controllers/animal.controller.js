const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const addAnimal = async (req, res) => {
    try{
        const {name} = req.body

        if (!name){
            return res.status(400).json({message:"Нет названия животного"})
        }

        await prisma.pet.create({
            data: {
                name
            }
        })

        res.status(200).json({message:"Добавлен вид домашнего животного"})
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Ошибка добавлния домашнего животного'}) 
    }
}

const deleteAnimal = async (req, res) => {
    try{
        await prisma.pet.delete({
            where: {id: parseInt(req.params.id)}
        })

        res.status(200).json({message:"Домашнее животное удалено"})
    }catch(error){
        console.error('Ошибка удаления домашнего животного: ', error)
        res.status(500).json({ 
            error: 'Ошибка удаления домашнего животного',
            details: error.message })
    }
}

const getAllAnimalsWithBreed = async (req, res) => {
    try{
        const animals = await prisma.pet.findMany({
            include:{
                breed:{
                    select:{
                        id: true,
                        name: true,
                    }
                }
            }
        })

        res.status(200).json(animals)
    }catch(error){
        console.error('Ошибка получения животных: ', error)
        res.status(500).json({ 
            error: 'Ошибка получения животных',
            details: error.message })
    }
}

module.exports = {
    addAnimal,
    deleteAnimal,
    getAllAnimalsWithBreed
}