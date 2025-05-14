const authRoutes = require('./routes/auth.router')
const viewsRoutes = require('./routes/views.routes')
const express = require('express');
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./doc/swagger');
const morgan = require('morgan')
const {query} = require('express-validator');
const { Socket } = require('dgram');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONT_PORT, 
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('Пользователь подключен', socket.id)

    socket.on('message', (data) => {
        console.log('Сообщение:', data)

        io.emit('message', data)
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отключен:', socket.id)
    })
})

app.use(morgan('dev'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/avatars', express.static('uploads/avatars'));
app.use('/mapimg', express.static('uploads/mapimg'));
app.use('/avatars', express.static('public/avatars'));
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONT_PORT,
    credentials: true
}))
app.use(express.json())


app.use('/api', authRoutes)
app.use("", viewsRoutes)

const start = () => {
    try{
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }catch (e) {
        console.log(e);
    }
}


start()