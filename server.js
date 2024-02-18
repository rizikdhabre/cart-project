const express = require("express");
const app = express();
const path = require("path");
const userModule = require("./modules/userModule.js");
const cartModule= require("./modules/cartModule.js")

app.use(express.static("client"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login.html"));
});


app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const data = await userModule.getUserByUserAndPassword(username, password);
  return res.send(data);
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await userModule.addUser(username, email, password);
    res.send({ success: true });
  } catch (error) {
    console.log("the error", error);
  }
});

app.post("/api/addItems", async(req,res)=>{
  try {
    const {itemId,creatorId}=req.body
    const counterOfItemsForSpecifcCreator= await cartModule.checkIfItemFoundForUser(creatorId,itemId)
    if(counterOfItemsForSpecifcCreator>0){
       let updateditem=await cartModule.updateItem(creatorId,itemId)
       return res.send({success:true,item:updateditem ,updated:true})
    }else{
    const newItem= await cartModule.createOneItem(req.body)
    return res.send({success:true,item:newItem,updated:false})
    }

  } catch (error) {
      console.log(error)
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.get("/api/item", async (req, res) => {
  try {
    const items = await cartModule.getUserItems(req.query.userId)
    return res.send({ success: true, items })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

app.delete("/api/item/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params
    await cartModule.removeItem(itemId)
    res.send({ success: true })
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message })
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
