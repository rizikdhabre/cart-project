"use strict"
const { getCollection, toObjectId } = require("./dbModule.js")

const entity = "users"

async function addUser(username, email, password) {
    try {
      const collection = await getCollection(entity)
      const existUser = await collection.findOne({ username })
  
      if (existUser) {
        throw new Error("User already exist")
      }
  
      await collection.insertOne({ username, password, email })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function getUserByUserAndPassword(username,password){
    const collection = await getCollection(entity)
    const existUser = await collection.findOne({ username })
    if ((!existUser)||!(existUser.password===password)) {
      return {success:false}
    }
    return {success:true}
  }

  module.exports={addUser,getUserByUserAndPassword}