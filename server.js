const express = require("express")
const path = require('path')
const app = express()
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log("listening from port", PORT)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'))
})
