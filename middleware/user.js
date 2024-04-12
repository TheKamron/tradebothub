import User from "../models/User.js"
import jwt from "jsonwebtoken"

export default async function (req, res, next) {
    if(!req.cookies.token) {
        res.redirect('/')
        return
    }

    const token = req.cookies.token
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decode.userId) 
    req.userId = user._id


    next()
}