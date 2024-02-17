import express from "express";
import multer from "multer";
import * as fs from "fs";
import { casoviController } from "../controllers/casoviController";
const casoviRouter = express.Router();

casoviRouter.route("/dodajCas").post((req, res)=>new casoviController().dodajCas(req, res));
casoviRouter.route("/dohvatiArhiviraneCasove").post((req, res)=>new casoviController().dohvatiArhiviraneCasove(req, res));
casoviRouter.route("/dohvatiNadolazeceCasove").post((req, res)=>new casoviController().dohvatiNadolazeceCasove(req, res));
casoviRouter.route("/dohvatiPetCasova").post((req, res)=>new casoviController().dohvatiPetCasova(req, res));
casoviRouter.route("/dohvatiZatrazeneCasove").post((req, res)=>new casoviController().dohvatiZatrazeneCasove(req, res));
casoviRouter.route("/potvrdiCas").post((req, res)=>new casoviController().potvrdiCas(req, res));
casoviRouter.route("/odbijCas").post((req, res)=>new casoviController().odbijCas(req, res));
casoviRouter.route("/getAllClasses").post((req, res)=>new casoviController().getAllClasses(req, res));
casoviRouter.route("/getUniqueDatesForSubject").post((req, res)=>new casoviController().getUniqueDatesForSubject(req, res));
casoviRouter.route("/getClassesFromGivenDateForGivenSubject").post((req, res)=>new casoviController().getClassesFromGivenDateForGivenSubject(req, res));
casoviRouter.route("/getDosije").post((req, res)=>new casoviController().getDosije(req, res));
casoviRouter.route("/oceni").post((req, res)=>new casoviController().oceni(req, res));
casoviRouter.route("/odobriPredmet").post((req, res)=>new casoviController().odobriPredmet(req, res));
casoviRouter.route("/dodajPredmet").post((req, res)=>new casoviController().dodajPredmet(req, res));
casoviRouter.route("/getAllSubjects").get((req, res)=>new casoviController().getAllSubjects(req, res));
casoviRouter.route("/getNumberOfTeachers").post((req, res)=>new casoviController().getNumberOfTeachers(req, res));
casoviRouter.route("/getNumberOfTeachersPerUzrast").post((req, res)=>new casoviController().getNumberOfTeachersPerUzrast(req, res));
casoviRouter.route("/getAverageCasoviPerDay").get((req, res)=>new casoviController().getAverageCasoviPerDay(req, res));
casoviRouter.route("/getBrojOdrzanih").get((req, res)=>new casoviController().getBrojOdrzanih(req, res));

export default casoviRouter;