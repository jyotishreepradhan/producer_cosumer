const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CookieSchema = new Schema({
    CookieType: {
    type: String,
    required: [true, 'cookie must have name'],
    trim: true,
    unique: true,
  },
  UnitsSold: {
    type: String,
    required: true,
    trim: true,
  },
  Revenue_Per_Cookie: {
    type: String,
    required: true,
    trim: true,
  },
  Cost_Per_Cookie:{
    type: String,
    required: true,
    trim: true,
  },
  NetRevenue:{
    type: String,
    required: true,
    trim: true,
  }
})

const Cookies = mongoose.model('Cookie', CookieSchema)

module.exports = Cookies