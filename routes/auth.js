import { Router } from "express";
import User from "../models/User.js";
import Contact from "../models/Contact.js"
import Subscribe from "../models/Subscribe.js"
import Products from "../models/Product.js"
import Order from "../models/Order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import authMiddleware from "../middleware/auth.js"
import generateJWTToken from "../services/token.js"

const router = Router()

router.get('/login', authMiddleware, (req, res) => {
    res.render('login', {
        title: "Login | TB",
        isLogin: true,
        loginError: req.flash('loginError')
    })
})

router.get('/admin-dashboard', async (req, res) => {
    const products = await Products.find().lean()
    const subscribers = await Subscribe.find().lean()
    const users = await User.find().lean()
    const messages = await Contact.find().lean()
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
    res.render('admin', {
        title: 'Admin Dashboard',
        products: products,
        subscribers:  subscribers,
        users: users,
        messages: messages,
        orders: orders
    })
})

router.get('/register', authMiddleware, (req, res) => {
    res.render('register', {
        title: "Register | TB",
        isRegister: true,
        registerError: req.flash('registerError')
    })
})

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})
// Logout

// Login
router.post('/login',  async (req , res) => {
    const {email, password,} = req.body

    if(!email || !password) {
        req.flash('loginError', 'All Fields is Required!')
        res.redirect('/login') 
        return 
    }

    const existUser = await User.findOne({email})
        if(!existUser) {
        req.flash('loginError', 'User Not Found!')
        res.redirect('/login')
         return
        }

        const token = generateJWTToken(existUser._id)   
        res.cookie('token', token, {httpOnly: true, secure: true})

        if(existUser.role == "admin"){
            res.redirect('/admin-dashboard')
        } else {
            res.redirect('/')
        }

    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if(!isPassEqual) {
        req.flash('loginError', 'Password Wrong!')
        res.redirect('/login')
        return
    }

})
// Login

// Register
router.post('/register', async (req, res) => {
    const {userName, email, password,} = req.body

    if(!userName || !email || !password) {
        req.flash('registerError', 'All Fields Required')
        res.redirect('/register')
        return
    }

    const existUser = await User.findOne({userName})
    if(existUser) {
        req.flash('registerError', 'Username already exist!')
        res.redirect('/register')
        return
    }

    const existEmail = await User.findOne({email})
    if(existEmail) {
        req.flash('registerError', 'This Email already exist')
        res.redirect('/register')
        return
    } 

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userData = {
    userName: req.body.userName,
    email: req.body.email,
    role: "user",
    password: hashedPassword,
    }
    console.log(userData);
    const user = await User.create(userData)
    const token = generateJWTToken(user._id)
    res.cookie('token', token, {httpOnly: true, secure: true})
    res.redirect('/')
})
// Register

export default router

