const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const createChat = async (req, res) => {
    try{
        const {name, type} = req.body

        if (!name || !type){
            return res.status(400).json ({message: 'Укажите название для чата и тип'})
        }

        const newChat = await prisma.chat.create({
            data:{
                name,
                type
            }
        })

        res.status(200).json(newChat)
    }catch(error){
        console.error('Ошибка создания чата:', error)
        res.status(500).json({ message: 'Ошибка создания чата' })
    }
}



module.exports = {
    createChat
}