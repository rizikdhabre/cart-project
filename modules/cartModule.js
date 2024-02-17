const { getCollection, toObjectId } = require("./dbModule.js")
const entity = "items"
async function createOneItem(item){
   try {
    const collection = await getCollection(entity)
    const newItem={...item,creatorId: toObjectId(item.creatorId)}
    const result = await collection.insertOne(item)
    newItem._id = result.insertedId
    return newItem
    
   } catch (error) {
        console.log(error)
   }
}

async function removeItem(itemId) {
   try {
     const collection = await getCollection(entity)
     await collection.deleteOne({ _id: toObjectId(itemId) })
   } catch (error) {
     throw error
   }
 }

 async function getUserItems(userId = null) {
   try {
     const collection = await getCollection(entity)
     const filter = userId === null ? {} : { creatorId: userId }
     const items = await collection.find(filter).toArray()
     return items
   } catch (error) {
     throw error
   }
 }

module.exports={createOneItem,removeItem,getUserItems}