const express = require("express");
const path = require("path");
const app = express()
const PORT = 3050


app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "game.html"))
})

app.listen(PORT,()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
})