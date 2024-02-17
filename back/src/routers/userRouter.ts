import express from "express";
import { UserController } from "../controllers/userController";
import multer from "multer";
import * as fs from "fs";
const userRouter = express.Router();
const userController = new UserController();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{ // req je Request objekat, file je trenutni file koji se obradjuje, cb je callback funkcija koja ce da se pozove kad se odredi destinacija fajlu
        const uploadPath = 'uploads/';

        if(!fs.existsSync(uploadPath)){ //proverava da li postoji path uploadPath
            fs.mkdirSync(uploadPath, {recursive: true}); // ako ne postoji pravi ga
        }
        cb(null, uploadPath); // null znaci da nije bilo gresaka, a uploadPath je rezultat
    },
    filename: (req, file, cb)=>{ // req i file isto kao gore, a cb je funkcija koja ce da se pozove kad se odredi filename.
        cb(null, file.originalname); // null znaci da nije bilo gresaka, a uploadPath je rezultat
    }
});

const upload = multer({ storage: storage });

userRouter.route("/login").post((req,res)=>userController.login(req,res));
userRouter.route("/registerUcenik").post(upload.single('file'), userController.registerUcenik);
userRouter.route("/getFile").post((req,res)=>userController.getFile(req, res));
userRouter.route("/getProfilePictureNastavnik").post((req,res)=>userController.getProfilePictureNastavnik(req, res));
userRouter.route("/uploadFile").post(upload.single('file'), userController.uploadFile);
userRouter.route("/registerNastavnik").post((req,res)=>userController.registerNastavnik(req, res));
userRouter.route("/loginAdmin").post((req,res)=>userController.loginAdmin(req,res));
userRouter.route("/getPendingRequests").get((req,res)=>userController.getPendingRequests(req,res));
userRouter.route("/getCV").post((req,res)=>userController.getCV(req, res));
userRouter.route("/getSveUcenike").get((req,res)=>userController.getSveUcenike(req, res));
userRouter.route("/getAktivneNastavnike").get((req,res)=>userController.getAktivneNastavnike(req, res));
userRouter.route("/getBrojOdrzanihCasova").post((req,res)=>userController.getBrojOdrzanihCasova(req, res));
userRouter.route("/getSvePredmete").get((req,res)=>userController.getSvePredmete(req, res));
userRouter.route("/pretragaNastavnika").post((req,res)=>userController.pretragaNastavnika(req, res));
userRouter.route("/getPredmet").post((req,res)=>userController.getPredmet(req, res));
userRouter.route("/getNastavnik").post((req,res)=>userController.getNastavnik(req, res));
userRouter.route("/getSveNastavnike").get((req,res)=>userController.getSveNastavnike(req, res));
userRouter.route("/uploadFileWithChange").post(upload.single('file'), userController.uploadFileWithChange);
userRouter.route("/uploadFileWithChangeNastavnik").post(upload.single('file'), userController.uploadFileWithChangeNastavnik);
userRouter.route("/updateIme").post((req,res)=>userController.updateIme(req,res));
userRouter.route("/updatePrezime").post((req,res)=>userController.updatePrezime(req,res));
userRouter.route("/updateAdresa").post((req,res)=>userController.updateAdresa(req,res));
userRouter.route("/updateTelefon").post((req,res)=>userController.updateTelefon(req,res));
userRouter.route("/updateEmail").post((req,res)=>userController.updateEmail(req,res));
userRouter.route("/updateImeNastavnik").post((req,res)=>userController.updateImeNastavnik(req,res));
userRouter.route("/updatePrezimeNastavnik").post((req,res)=>userController.updatePrezimeNastavnik(req,res));
userRouter.route("/updateAdresaNastavnik").post((req,res)=>userController.updateAdresaNastavnik(req,res));
userRouter.route("/updateTelefonNastavnik").post((req,res)=>userController.updateTelefonNastavnik(req,res));
userRouter.route("/updateEmailNastavnik").post((req,res)=>userController.updateEmailNastavnik(req,res));
userRouter.route("/updateRazred").post((req,res)=>userController.updateRazred(req,res));
userRouter.route("/getUcenik").post((req,res)=>userController.getUcenik(req, res));
userRouter.route("/azurirajZeljeZaPoducavanje").post((req,res)=>userController.azurirajZeljeZaPoducavanje(req, res));
userRouter.route("/azurirajZeljeZaUzrast").post((req,res)=>userController.azurirajZeljeZaUzrast(req, res));
userRouter.route("/odobriNastavnika").post((req,res)=>userController.odobriNastavnika(req, res));
userRouter.route("/getAllPendingPredmete").get((req,res)=>userController.getAllPendingPredmete(req, res));
userRouter.route("/dohvatiRaspodeluNastavnika").get((req,res)=>userController.dohvatiRaspodeluNastavnika(req, res));
userRouter.route("/dohvatiRaspodeluUcenika").get((req,res)=>userController.dohvatiRaspodeluUcenika(req, res));
export default userRouter;