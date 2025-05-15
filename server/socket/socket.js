const { PrismaClient } = require('../generated/prisma/client');
const client = require('../redis/redisClient')

const prisma = new PrismaClient();

function setupSocket(io) {
    io.on('connection', (socket) =>{
        console.log('Пользователь подключен:', socket.id)

        socket.on('join_chat', async ({ chatId }) => {
            socket.join(`chat_${chatId}`)
            console.log(`Пользователь присоединился к чату ${chatId}`)

            socketToUserMap.set(socket.id, { userId, chatId })

            await client.sadd(`chat:${chatId}:user`, userId)

            const users = await client.smembers(`chat:${chatId}:users`)
            io.to(`chat_${chatId}`).emit('chat_users', users)

            const lastMessage = await client.get(`chat:${chatId}:lastMessage`)
            if (lastMessage) {
                socket.emit('last_message', JSON.parse(lastMessage))
            }
        })

        socket.on('send_message', async ({chatId, content, userId}) =>{
            try{
                const message = await prisma.messages.create({
                    data:{
                        content,
                        chat: {connect: {id: chatId}},
                        user: {connect: {id: userId}}
                    },
                    include: {
                        user: true
                    }
                })

                await client.set(`chat:${chatId}:lastMessage`, JSON.stringify(message))

                io.to(`chat_${chatId}`).emit('new_message', message)
            }catch(error){
                console.error('Ошибка при сохранении сообщения:', error)
                socket.emit('error_message', {error: 'Ошибка при сохранении сообщения'})
            }
        })

        socket.on('leave_chat', async ({ chatId }) => {
            socket.leave(`chat_${chatId}`)
            console.log(`Пользователь покинул чат ${chatId}`)

            await client.srem(`chat:${chatId}:users`, userId)

            const users = await client.smembers(`chat:${chatId}:users`)
            io.to(`chat_${chatId}`).emit('chat_users', users)

            socketToUserMap.delete(socket.id)
        })

        socket.on('disconnect', async () => {
            const userInfo = socketToUserMap.get(socket.id)
            if (userInfo) {
                const {chatId, userId} = userInfo
                console.log(`Пользователь ${userId} отключился от чата ${chatId}`);

                await client.srem(`chat:${chatId}:users`, userId)

                const users = await client.smembers(`chat:${chatId}:users`)
                io.to(`chat_${chatId}`).emit('chat_users', users)

                socketToUserMap.delete(socket.id)
            } else{
                console.log(`Пользователь отключился без join_chat: ${socket.id}`);
            }
        })
    })
}

module.exports = {
    setupSocket
}