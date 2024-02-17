import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Predmet = new Schema({
    predmet: {
        type: String
    },
    status: {
        type: String
    },
    zatrazio: {
        type: String
    }
});

export default mongoose.model("Predmet", Predmet, "predmeti");