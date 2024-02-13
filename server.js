const express = require("express")
const app = express()
const path = require("path")
const userModule=require("./modules/userModule.js")

app.use(express.static("client"))
app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login.html"))
})

app.post("/api/login", async (req,res)=>{
  const {username,password}=req.body
  const data=await userModule.getUserByUserAndPassword(username,password)
  return res.send(data)
})

app.post("/api/register",async (req, res) => {
  try {
      const {username, email, password}=req.body
      await userModule.addUser(username,email,password)
      res.send({success:true})
  } catch (error) {
    console.log("the error",error)
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
