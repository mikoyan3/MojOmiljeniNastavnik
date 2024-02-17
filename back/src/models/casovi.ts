import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Cas = new Schema({
    id: {
        type: Number
    },
    predmet: {
        type: String
    },
    nastavnik: {
        type: String
    },
    datum:{
        type: Date
    },
    ucenik:{
        type: String
    },
    status: {
        type: String
    }, 
    dupli: {
        type: Boolean
    }, 
    tema: {
        type: String
    }
});

export default mongoose.model("Cas", Cas, "casovi");