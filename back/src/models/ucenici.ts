import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Ucenik = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    odgovorNaPitanje: {
        type: String
    },
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    pol: {
        type: String
    },
    adresa: {
        type: String
    },
    telefon: {
        type: String
    },
    email: {
        type: String
    },
    profilePictureUrl: {
        type: String
    },
    tipSkole: {
        type: String
    },
    razred: {
        type: Number
    },
    ukupnaOcena: {
        type: Number
    },
    brojOcena: {
        type: Number
    }
});

export default mongoose.model("Ucenik", Ucenik, "ucenici");