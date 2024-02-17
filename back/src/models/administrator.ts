import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Administrator = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

export default mongoose.model("Administrator", Administrator, "administrator");