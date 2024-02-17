import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Dosije = new Schema({
    idCasa: {
        type: Number
    },
    ocena:{
        type: Number
    },
    komentar:{
        type: String
    },
    ucenik: {
        type: String
    },
    nastavnik: {
        type: String
    }
});

export default mongoose.model("Dosije", Dosije, "dosije");