const express = require("express")

const app = express()
const PORT = 7777




app.get("/user", (req, res) => {
    res.send({ firstName: "Ajay", lastName: "Panigrahi" })
})

app.post("/user", (req, res) => {
    console.log("Data is successfully pushed!");
    res.send({ firstName: "Vijay", lastName: "Panigrahi" })
})

app.put("/user", (req, res) => {
    console.log("Replaced/created");
    res.send({ firstName: "Dhananjaya", lastName: "Panigrahi" })
})


app.use("/user", (req, res) => {
    res.send("HehhhhaHahahahahah!!!!!!!!")
})


app.patch("/user", (req, res) => {
    console.log("Sample update/bug fix");
    res.send({ firstName: "Dhananjaya", lastName: "Panigrahi" })
})

app.delete("/user", (req, res) => {
    console.log("DELETED!!");
    res.send(123)
})

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

// app.use("/", (req, res) => {
//     res.send("Ram Ram!")
// })





app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);

})


