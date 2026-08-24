const express = require("express")

const app = express()
const PORT = 7777

// app.get("/abc/:userId/:password/:name", (req, res) => {
//     console.log(req.params);
//     res.end()
// })

// app.get("/abc", (req, res) => {
//     console.log(req.query.lastName);
//     res.end()
// })

app.get(/.*fly$/, (req, res) => {
    res.send("Working Dude!")
})

// app.get(/a(b)+c/, (req, res) => {
//     res.send("Working Dude!")
// })



app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);

})


