import { Router } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js"
import userMiddleware from "../middleware/user.js"
import jwt from "jsonwebtoken"
const router = Router()

router.get('/product', async (req, res) => {
    const products = await Product.find().lean()
    res.render('product', {
        title: 'Products', 
        isProduct: true,
        products: products,
    })
})

router.get('/add', async (req, res) => {
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
    res.render('add',   {
        title: "Add Product",
        isAdd: true,
        addError: req.flash('addError')
    })
})
router.get('/my-products', async (req, res) => {
    const products = await Product.find().lean()
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
    res.render('my-products', {
        title: 'My Products',
        products: products,
    })
})

router.get('/edit-product/:id', async (req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).lean()
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
    res.render('edit-product', {
        title: "Edit Product",
        product: product,
    })
})

router.get("/delete-product/:id", async (req, res) => {
    const id = req.params.id
    await Product.findByIdAndDelete(id)
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
    res.redirect('/my-products')
})

router.post('/add-products', userMiddleware, async (req, res) => {
    const {title, description, image, price} = req.body
    const products = await Product.create({...req.body, user: req.userId})
    res.redirect('/my-products')
})

router.post('/edit-product/:id', async (req, res) => {
    const id = req.params.id
    const editProduct = await Product.findByIdAndUpdate(id, req.body, {new: true})

    res.redirect('/my-products')
})

router.post('/buy-product/:id', async (req, res) => {
    const idOrder = req.params.id
    const order = req.body
    const orderProduct = await Product.findById(idOrder) 
    const orderTitle = orderProduct.title
    const orderPrice = orderProduct.price
    const orderData = {
        orderTitle: orderTitle,
        orderPrice: orderPrice,
        telegram: order.telegram,
        facebook: order.facebook,
        whatsapp: order.whatsapp,
    }
    console.log(orderData)
  await Order.create(orderData)
  res.redirect('/product')
})

export default router