const jwt = require('jsonwebtoken')

const adminMidlware = (req, res, next) => {
    try{
        const access_token = req.cookies.access_token

        if (!access_token){
            return res.status(401).json({
                message: "Досуп запрещен"
            })
        }

        const decoded = jwt.verify(access_token, process.env.JWT_SECRET)

        if (decoded.userRole === false){
            return res.status(401).json({
                message:"Досуп только для администратора"
            })
        }

        req.user = decoded;

        next()
    }catch(error){
        if (error.name === 'TokenExpiredError'){
            return res.status(401).json({ message: 'Access token expired', needRefresh: true })
        }

        console.error('Ошибка проверки токена', error)
        return res.status(403).json({
            message:"Хз что за ошибка. Неверный токен"
        })
    }
}

module.exports = {
    adminMidlware
}