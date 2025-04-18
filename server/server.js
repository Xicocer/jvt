const authRoutes = require('./routes/auth.router')
const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: process.env.FRONT_PORT,
    credentials: true
}))
app.use(express.json())
app.use('/api', authRoutes)

const start = () => {
    try{
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }catch (e) {
        console.log(e);
    }
}


start()