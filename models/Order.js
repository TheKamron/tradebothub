import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
    orderTitle: {type: String, required: true},
    orderPrice: {type: Number, required: true},
    telegram: {type: String, },
    facebook: {type: String, },
    whatsapp: {type: String, },
})

const Order = model("Order", OrderSchema)

export default Order;