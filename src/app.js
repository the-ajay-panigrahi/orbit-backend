const express = require("express")

const app = express()
const PORT = 7777




app.use("/sample", (req, res) => {
    res.send("Sample Testing 🥳")
})


app.use("/home/user2/234/51", (req, res) => {
    res.send("Home sub route 51")
})


app.use("/home/user2/234/52", (req, res) => {
    res.send("Home sub route 52")
})

app.use("/home", (req, res) => {
    res.send("Ayodhya!!!")
})


app.use("/lanka", (req, res) => {
    res.send("Lanka dahan!!!!!!!")
})

app.use("/", (req, res) => {
    res.send("Ram Ram!")
})





app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);

})


