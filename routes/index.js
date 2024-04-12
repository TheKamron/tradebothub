import { Router } from "express";
import Contact from "../models/Contact.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import Subscribe from "../models/Subscribe.js"
import Order from "../models/Order.js"
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: "TradeBotHub - Your Gateway to Automated Trading",
        userId: req.userId ? req.userId.toString() : null
    })
})

router.get('/orders', async (req,res) => {
    const orders = await Order.find().lean()
    // Checking User
    const token = req.cookies.token
    if(!token) {
        res.redirect('/')
        return
    } 
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decode.userId)
    const userRole = user.role
    if(userRole != 'admin') {
    res.redirect('/')
    return
   }
    // End Cheking User 
    res.render('orders', {
        title: "Orders",
        orders: orders,
    })
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: "About Us"
    })
})

router.get("/contact", (req, res) => {
    res.render('contact', {
        title: "Contact Us"
    })
})

router.get('/messages', async (req,res) => {
    const contacts = await Contact.find().lean()
     // Checking User
     const token = req.cookies.token
     if(!token) {
         res.redirect('/')
         return
     } 
     const decode = jwt.verify(token, process.env.JWT_SECRET)
     const user = await User.findById(decode.userId)
     const userRole = user.role
     if(userRole != 'admin') {
     res.redirect('/')
     return
    }
     // End Cheking User 
    res.render('messages', {
        title: 'Messages',
        contacts: contacts,
    })
})

router.get('/delete-order/:id', async (req, res) => {
    const id = req.params.id
    await Order.findByIdAndDelete(id)
    res.redirect('/orders')
})

router.post('/contact-us', async (req, res) => {
    const contactForm = await Contact.create(req.body)
    res.redirect('/contact')
})

router.post("/delete-message/:id", async (req,res) => {
    const id = req.params.id
    await Contact.findByIdAndDelete(id)
    res.redirect("/messages")
})

router.post('/subscribe', async (req, res) => {
    const subs = await Subscribe.create(req.body)   
    res.redirect('/')
})

export default router