const express = require("express")

const app = express()
const PORT = 7777


app.use("/home", (req, res) => {
    res.send("Ayodhya!!!")
})

app.use("/lanka", (req, res) => {
    res.send("Lanka dahan!!!!!!!")
})

app.use("/sample", (req, res) => {
    res.send("Sample Testing 🥳")
})

app.use("/", (req, res) => {
    res.send("Ram Ram!")
})

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);

})


