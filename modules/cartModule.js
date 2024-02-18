const { getCollection, toObjectId } = require("./dbModule.js");
const entity = "items";
async function createOneItem(item) {
  try {
    const collection = await getCollection(entity);
    const newItem = { ...item, creatorId: toObjectId(item.creatorId) };
    const result = await collection.insertOne(item);
    newItem._id = result.insertedId;
    return newItem;
  } catch (error) {
    console.log(error);
  }
}

async function removeItem(itemObjId) {
  try {
    const collection = await getCollection(entity);
    const objectId = toObjectId(itemObjId);
    await collection.deleteOne({_id:objectId});
  } catch (error) {
    throw error;
  }
}

async function getUserItems(userId = null) {
  try {
    const collection = await getCollection(entity);
    const filter = userId === null ? {} : { creatorId: userId };
    const items = await collection.find(filter).toArray();
    return items;
  } catch (error) {
    throw error;
  }
}

async function checkIfItemFoundForUser(userId, itemId) {
  try {
    let counter = 0;
    let userItems = await getUserItems(userId);
    userItems.forEach((item) => {
      if (item.itemId === itemId) {
         ++counter;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
}

async function updateItem(creatorId, itemId) {
  try {
    const specificItem = await getSpecificItemToChangeQuantity(creatorId, itemId);
   let newQuantity= specificItem.quantity+1
   specificItem.quantity=newQuantity
    const collection = await getCollection(entity);
    await collection.updateOne({ _id: specificItem._id }, { $set: specificItem });
    return specificItem;
  } catch (error) {
    throw error;
  }
}

async function getSpecificItemToChangeQuantity(userCreatorId, itemId) {
  try {
    const collection = await getCollection(entity);
    const filter = { creatorId: userCreatorId, itemId: itemId };
    const specificItem = await collection.findOne(filter);

    if (!specificItem) {
      throw new Error(
        `Item not found for creatorId ${userCreatorId} and itemId ${itemId}`
      );
    }
    return specificItem;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  createOneItem,
  removeItem,
  getUserItems,
  checkIfItemFoundForUser,
  updateItem,
};
