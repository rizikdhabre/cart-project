"use strict"

const USER_KEY = "loggedInUser"
const ITEM_KEY = "items"
const storageService = {
    getItems() {
        const items = JSON.parse(localStorage.getItem(ITEM_KEY))
        return items || []
      },
      setItems(items) {
        localStorage.setItem(ITEM_KEY, JSON.stringify(items))
      },
    setUser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user))
    },
    clearAll(){
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(ITEM_KEY)
    },
    getUser(){
        const user = JSON.parse(localStorage.getItem(USER_KEY))
        return user || null
    }, addOneItem(newItem){
        const items=this.getItems()
        items.push(newItem)
        this.setItems(items)
    },
    removeOneItem(itemId) {
        const items = this.getTodos()
        const updatedItems = items.filter((item) => item._id !== itemId)
        this.setTodos(updatedItems)
      },
  }
