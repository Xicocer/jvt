const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const refresh = async (req, res) =>{
    try{

        const {refreshToken} = req.body;

        if (!refreshToken){
            return res.status(401).json({message:'Отсутствует refresh токен'});
        }

        const tokenInDb = await prisma.refresh.findFirst({
            where: {
                refreshtoken: refreshToken
            }
        })

        if(!tokenInDb) {
            return res.status(403).json({message: 'Недейсвительный токен'})
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const newAccessToken = jwt.sign(
            {userId:decoded.userId},
            process.env.JWT_SECRET,
            {expiresIn:'3h'}
        )

        res.cookie('access_token', newAccessToken,{
            httpOnly:true,
            maxAge: 3*60*60*1000,
            sameSite: 'lax',
        })

        res.status(201).json({
            message:"Токен обновлен",
            accessToken:newAccessToken
        });

    }catch(error){
        console.error(error);
        return res.status(403).json({ message: 'Ошибка при обновлении токена' })
    }
}

module.exports ={
    refresh
}