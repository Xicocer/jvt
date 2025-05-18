const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const changeProfile = async (req, res) => {
    try{
        const {first_name, last_name, patronymic} = req.body

        const updateData = {}
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (patronymic) updateData.patronymic = patronymic;

        const updatedUser = await prisma.user.update({
            where: {id: req.user.userId},
            data: updateData,
        })

        res.status(200).json({message:"Данные пользоваеля обновлены", user: updatedUser})
        
    }catch(error){
        console.error('Ошибка обновления профиля:', error)
        res.status(500).json({
            error:'Ошибка обновления статуса',
            details: error.message
        })
    }
}

module.exports = {
    changeProfile,
}