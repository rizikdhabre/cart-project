"use strict"

const USER_KEY = "loggedInUser"
const ITEM_KEY = "items"
const storageService = {
    setUser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user))
    },
    clearAll(){
        localStorage.removeItem(USER_KEY)
    },
    getUser(){
        const user = JSON.parse(localStorage.getItem(USER_KEY))
        return user || null
    }   
  }
