const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const insertIntoChat = async (req, res) => {
    try{
        const chatId = parseInt(req.params.chatId)
        const userId = req.user.userId

        await prisma.UserChat.create({
            data:{
                user_id: userId,
                chat_id: chatId
            }
        })

        res.status(200).json({message: "Вы вошли в чат"})
    }catch(error){
        console.error('Ошибка входа в чат:', error)
        res.status(500).json({ message: 'Ошибка входа в чат' })
    }
}

const leaveChat = async (req, res) => {
    try{
        const userId = req.user.userId

        await prisma.UserChat.delete({
            where: {user_id: userId}
        })

        res.status(200).json({message: "Вы покинули чат"})
    }catch(error){
        console.error('Ошибка выхода из чата (тебя так просто не отпустят): ', error)
        res.status(500).json({ 
        error: 'Ошибка выхода из чата (тебя так просто не отпустят)',
        details: error.message })
    }
}

module.exports = {
    insertIntoChat,
    leaveChat
}