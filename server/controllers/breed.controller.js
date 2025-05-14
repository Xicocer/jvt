const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const addBreed = async (req, res) =>{
    try{
        const {name, petId} = req.body

        if (!name || !petId){
            return res.status(400).json({message: 'Имя и тип обязательны'})
        }

        const petType = await prisma.findUnique({
            where:{id: petId}
        })

        if (!petType){
            return res.status(400).json({message: 'Такое животное не найдено'})
        }

        await prisma.breed.create({
            data: {
                name,
                petTypeId
            }
        })

        return res.status(201).json(breed)
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Ошибка добавлния породы'}) 
    }
}

const deleteBreed = async (req, res) => {
    try{
        await prisma.breed.delete({
            where: {id: parseInt(req.params.id)}
        })

        res.status(200).json({message:"Порода удалена"})
    }catch(error){
        console.error('Ошибка удаления породы: ', error)
        res.status(500).json({ 
            error: 'Ошибка удаления породы',
            details: error.message })
    }
}

module.exports = {
    addBreed,
    deleteBreed
}