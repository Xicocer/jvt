const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const deletePet = async (req, res) => {
    try{
        const petId = parseInt(req.params.id)
        const userId = req.user.userId

        console.log('req.user.id:', userId)

        if (isNaN(petId)) {
            return res.status(400).json({message:"Неверный id питомца"})
        }

        const pet = await prisma.user_pets.findUnique({
            where: { id: petId }
        })

        if (!pet){
            return res.status(404).json({message:"Питомец не найден"})
        }

        console.log('pet.user_id:', pet.user_id)

        if (pet.user_id !== userId){
            return res.status(403).json({message:"Нет доступа для удаления этого питомца"})
        }

        await prisma.user_pets.delete({
            where: { id: petId }
        })

        res.status(200).json({message:"Питомец удален"})
    }catch(error){
        console.error('Ошибка удаления пиомца: ', error)
        res.status(500).json({ message: 'Ошибка сервера при удалении питомца' })
    }
}

module.exports = {
    deletePet
}