"use strict";

const USER_KEY = "loggedInUser";
const ITEM_KEY = "items";
const storageService = {
  getItems() {
    const items = JSON.parse(localStorage.getItem(ITEM_KEY));
    return items || [];
  },
  setItems(items) {
    localStorage.setItem(ITEM_KEY, JSON.stringify(items));
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearAll() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ITEM_KEY);
  },
  getUser() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    return user || null;
  },
  addOneItem(newItem) {
    const items = this.getItems();
    items.push(newItem);
    this.setItems(items);
  },
  removeOneItem(itemObjId) {
    const items = this.getItems();
    const updatedItems = items.filter((item) => item._id !== itemObjId);
    this.setItems(updatedItems);
  },
  updateitem(itemObjId, newQuantity) {
    const items = this.getItems();
    const updatedItems = items.map((item) => {
      if (item._id === itemObjId) {
        return { ...item, quantity: newQuantity };
      } else {
        return item;
      }
    });
    this.setItems(updatedItems);
  },
};
