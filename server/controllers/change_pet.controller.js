const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const changePet = async (req, res) => {
    try{
        const petId = parseInt(req.params.id)
        const userId = req.user.userId
        const {age} = req.body

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
            return res.status(403).json({message:"Нет доступа для изменения этого питомца"})
        }

        await prisma.user_pets.update({
            where: { id: petId },
            data:{
                age:parseInt(age),
            }
        })

        res.status(200).json({message:"Возраст питомца обновлен"})
    }catch(error){
        console.error('Ошибка обновления пиомца: ', error)
        res.status(500).json({ message: 'Ошибка сервера при обновлении питомца' })
    }
}

module.exports = {
    changePet
}