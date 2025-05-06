const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const getAllSupportTickets = async (res) =>{
    try{
        const tickets = await prisma.support.findMany({
            include: {
                user: {
                    select:{
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        patronymic: true,
                    }
                }
            },
            orderBy: {
               created_at: 'desc' 
            }
        })

        res.status(200).json(tickets)
    }catch(error){
        console.error('Ошибка получения тикетов: ', error)
        res.status(500).json({message:"Ошибка сервера"})
    }
}

const getTicketById = async (req, res) =>{
    try{
        const ticket = await prisma.support.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { user: true }
        })

        if (!ticket){
            return res.status(404).json({message:"Тикет не найден"})
        }

        res.status(200).json(ticket)
    }catch(error){
        console.error('Ошибка получения тикета: ', error)
        res.status(500).json({ 
            error: 'Ошибка при получении обращения',
            details: error.message })
    }
    
}

const resolveTicket = async (req, res) =>{
    try{
        const updatetedTicket = await prisma.support.update({
            where: {id: parseInt(req.params.id)},
            data:{
                type: 'Решено'
            }
        })

        res.status(200).json({
            message:"Статус обращения изменен"
        })
    }catch(error){
        console.error('Ошибка обновления сатуса тикета: ', error)
        res.status(500).json({ 
            error: 'Ошибка обновления сатуса тикета',
            details: error.message })
    }
}

const deleteTicket = async (req, res) =>{
    try{
        await prisma.support.delete({
            where: {id: parseInt(req.params.id)}
        })

        res.status(200).json({message:'Тикет удален'})
    }catch(error){
        console.error('Ошибка удаления тикета: ', error)
        res.status(500).json({ 
            error: 'Ошибка удаления тикета',
            details: error.message })
    }
}

module.exports = {
    getAllSupportTickets,
    getTicketById,
    resolveTicket,
    deleteTicket
}