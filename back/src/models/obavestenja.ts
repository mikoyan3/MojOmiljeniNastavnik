import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Obavestenje = new Schema({
    idCasa: {
        type: Number
    },
    ucenik:{
        type: String
    }, 
    obrazlozenje: {
        type: String
    }
});

export default mongoose.model("Obavestenje", Obavestenje, "obavestenja");