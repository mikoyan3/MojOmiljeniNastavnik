import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Nastavnik = new Schema({
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
    telefon:{
        type: String
    },
    email: {
        type: String
    },
    profilePictureUrl: {
        type: String
    },
    CVUrl: {
        type: String
    },
    zeljeZaPoducavanje: {
        type: Array
    },
    zeljeZaUzrast: {
        type: Array
    },
    preporuka: {
        type: String
    },
    aktivan: {
        type: Boolean
    }
});

export default mongoose.model("Nastavnik", Nastavnik, "nastavnici");