const express = require("express")
const category_model = require('../models/category.js')
const admin_router = express.Router()
const categ_router = require("./adminCategory")

admin_router.use('/category/', categ_router)

module.exports = admin_router