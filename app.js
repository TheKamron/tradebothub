import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv"
import {engine, create} from "express-handlebars";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import session from "express-session"
dotenv.config()

// Middlewares
import varMiddleware from "./middleware/var.js"

// Routes
import AuthRoutes from "./routes/auth.js"
import IndexRoutes from "./routes/index.js"
import ProductRoutes from "./routes/product.js"

const app = express()


const hbs = create({defaultLayout: 'main', extname: 'hbs'})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static("public"))
app.use(express.static("images"))
app.use(express.static("styles"))
app.use(express.static("js"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({secret: 'Kamron', resave: false, saveUninitialized: false}))
app.use(flash())

app.use(varMiddleware)

app.use(AuthRoutes)
app.use(IndexRoutes)
app.use(ProductRoutes)

const dbURI = process.env.MONGO_URI

const startApp = () => {
    try {

        mongoose.set('strictQuery', false)
        mongoose.connect(dbURI, console.log('MongoDB Connected!'))

        const PORT = process.env.PORT || 5500
        app.listen(PORT, () => {console.log(`Server Has Been Started on Port: ${PORT} `);
        })
    }
    catch (error) {
    console.log(error);
    }
}

startApp()
