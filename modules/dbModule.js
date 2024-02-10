const { MongoClient, ObjectId } = require("mongodb")

const url = "<Enter your connection string here>"
const dbName = "todos_db"

const client = new MongoClient(url)

async function connectDb() {
  try {
    await client.connect()
    console.log("Connected to DB😎")
    const db = client.db(dbName)
    return db
  } catch (error) {
    console.error("Connection to DB failed:", error)
    throw error
  }
}

async function getCollection(collectionName) {
  try {
    const db = await connectDb()
    const collection = db.collection(collectionName)
    return collection
  } catch (error) {
    console.error("Error getting collection:", error)
    throw error
  }
}

function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId: ", id)
  }
  return new ObjectId(id)
}

module.exports = { getCollection, toObjectId }
