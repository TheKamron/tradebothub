import { Schema, model } from "mongoose";

const SubsSchema = new Schema({
    email: {type: String, required: true, unique: true}
})

const Subscribe = model('Subscribe', SubsSchema)

export default Subscribe;
