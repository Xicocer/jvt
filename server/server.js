const authRoutes = require('./routes/auth.router')
const viewsRoutes = require('./routes/views.routes')
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {query} = require('express-validator')

const PORT = process.env.PORT || 5000;

const app = express();

app.use('/avatars', express.static('uploads/avatars'));
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