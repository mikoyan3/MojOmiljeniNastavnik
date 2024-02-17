import * as express from "express";
import Cas from "../models/casovi"
import casovi from "../models/casovi";
import dosije from "../models/dosije";
const moment = require('moment-timezone');
import Dosije from "../models/dosije"
import obavestenja from "../models/obavestenja";
import Predmet from "../models/predmeti"
import predmeti from "../models/predmeti";
import Nastavnik from "../models/nastavnici"
import nastavnici from "../models/nastavnici";
import { helper } from "../models/brojCasovaHelper";
const { startOfDay, endOfDay } = require('date-fns');

export class casoviController{

    getUniqueDatesForSubject = (req: express.Request, res: express.Response)=>{
        let nastavnik = req.body.nastavnik;
        let ucenik = req.body.ucenik;
        let predmet = req.body.predmet;
        Cas.find({nastavnik: nastavnik, ucenik: ucenik, predmet: predmet, status: {$ne: 'odbijen'}}).then(lista=>{
            let uniqueSet = new Set();
            lista.forEach(l=>{
                const day = l.datum.getDate();
                const month = l.datum.getMonth();
                const year = l.datum.getFullYear();

                const str = `${day}-${month}-${year}`;

                uniqueSet.add(str);
            })
            const uniqueArray = Array.from(uniqueSet);
            const uniqueDates = uniqueArray.map(str=>{
                const [day, month, year] = (str as string).split('-');
                return new Date(Number(year), Number(month), Number(day));
            });

            res.json(uniqueDates);
        })
    }

    getClassesFromGivenDateForGivenSubject = (req: express.Request, res: express.Response)=>{
        let nastavnik = req.body.nastavnik;
        let ucenik = req.body.ucenik;
        let predmet = req.body.predmet;
        let datum = new Date(req.body.datum);
        let start = startOfDay(datum);
        let end = endOfDay(datum);

        Cas.find({nastavnik: nastavnik, ucenik: ucenik, predmet: predmet, datum: {$gte: start, $lte: end}, status: {$ne: 'odbijen'}}).then(lista=>{
            res.json(lista);
        })
        
    }

    

    dodajCas = async (req: express.Request, res: express.Response) => {
        try {
            let username = req.body.username;
            let datumCasa = moment(req.body.datumCasa).tz('Europe/Belgrade');
            let predmetCasa = req.body.predmetCasa;
            let temaCasa = req.body.temaCasa;
            let dupliCas = req.body.dupliCas;
            let ucenik = req.body.ucenik;
            let krajCasa = moment(datumCasa);
            let pocetakCasa = moment(datumCasa);
            
            if (dupliCas == true) {
                krajCasa.add(2, 'hours');
            } else {
                krajCasa.add(1, 'hour');
            }
            let dayStart = moment(datumCasa).set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
            let dayEnd = moment(dayStart).set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
            Cas.find().sort({id: -1}).then(lista=>{
                let max = lista[0].id + 1;
                Cas.find({status: 'potvrdjen', nastavnik: username, datum: { $gte: dayStart.toDate(), $lt: dayEnd.toDate()}}).sort({datum: 1}).then(lista=>{ //svi casovi tog dana sortirani od najranijeg ka najkasnijem
                    let flagImaMesta = false;
                    if(lista.length == 0){
                        flagImaMesta = true;
                    } else {
                        for (let i = 0; i < lista.length; i++) {
                            let startClass = moment(lista[i].datum);
                            let endClass = moment(startClass);
                            if(lista[i].dupli == true) {
                                endClass.add(2, 'hours');
                            }
                            else {
                                endClass.add(1, 'hour');
                            }
                            if (i < lista.length - 1) {
                                let startOfTheNext = moment(lista[i+1].datum);
                                if(pocetakCasa <= startClass && krajCasa <= startClass){
                                    flagImaMesta = true;
                                } else if(pocetakCasa >= endClass){
                                    if(krajCasa <= startOfTheNext){
                                        flagImaMesta = true;
                                    }
                                }
                            } else {
                                if(pocetakCasa >= endClass && krajCasa <= dayEnd){
                                    flagImaMesta = true;
                                } else if (pocetakCasa <= startClass && krajCasa <= startClass){
                                    flagImaMesta = true;
                                }
                            }
                        }
                    }
                    if (flagImaMesta == true){
                        let cas = new casovi({
                            predmet: predmetCasa,
                            nastavnik: username,
                            datum: datumCasa,
                            ucenik: ucenik,
                            status: 'zatrazen',
                            dupli: dupliCas,
                            tema: temaCasa,
                            id: max
                        })
                        cas.save().then(savedCas=>{
                            res.json("Uspesno poslat zahtev za zakazivanje casa")
                        });
                    } else {
                        res.json("Nastavnik ima zakazan cas u izabrano vreme")
                    }
                })
            })
        } catch (err) {
            console.log(err)
        }
    }

    dohvatiArhiviraneCasove = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        let danasnjiDatum = moment();
        Cas.find({status: 'potvrdjen', ucenik: username, datum: {$lte: danasnjiDatum.toDate()}}).then(lista=>{
            res.json(lista);
        }).catch(err=>{
            console.log(err);
        })
    }

    getAverageCasoviPerDay = (req: express.Request, res: express.Response)=>{
        const end = moment();
        const start = moment(end).subtract(1, 'year').add(1, 'day');
        let ukupanBrojPoDanima: number[] = Array(7).fill(0);
        let counterPoDanima: number[] = Array(7).fill(0);
        Cas.find({datum: {$gte: start.toDate(), $lte: end.toDate()}}).then(lista=>{
            lista.forEach(l=>{
                let datum = moment(l.datum);
                let dan = datum.day();

                ukupanBrojPoDanima[dan]++;

                if(counterPoDanima[dan] == 0){
                    counterPoDanima[dan] = 1;
                }

                if (dan !== moment(lista[lista.indexOf(l) - 1]?.datum).day()) {
                    counterPoDanima[dan]++; 
                }
            })
            res.json({ukupanBrojPoDanima, counterPoDanima})
        })
    }

    getBrojOdrzanih = (req: express.Request, res:express.Response)=>{
        let listaNastavnika: helper[] = [];
        const end = moment();
        const start = moment(end).subtract(1, 'year').add(1, 'day');
        Nastavnik.find({aktivan: true}).then(lista=>{
            lista.forEach(l=>{
                let newHelper = new helper();
                newHelper.nastavnik = l.username;
                listaNastavnika.push(newHelper);
            })
            Cas.find({datum: {$gte: start.toDate(), $lte: end.toDate()}, status: {$ne: 'odbijen'}}).then(lista=>{
                lista.forEach(l=>{
                    listaNastavnika.forEach(n=>{
                        if(l.nastavnik == n.nastavnik){
                            let datum = moment(l.datum);
                            let mesec = datum.month();
                            n.brojCasovaPoMesecu[mesec]++;
                        }
                    })
                })
                res.json(listaNastavnika);
            })
        })
    }

    dohvatiPetCasova = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let danasnjiDatum = moment();
        let narednihTriDana = moment();
        narednihTriDana.add(3, 'days');
        Cas.find({status: 'potvrdjen', nastavnik: username, datum: {$gte: danasnjiDatum.toDate(), $lte: narednihTriDana.toDate()}}).sort({datum: 1}).then(lista=>{
            let pet = 0;
            let casovi: any[] = [];
            for(let i = 0; i < lista.length; i++){
                if(pet < 5){
                    casovi.push(lista[i]);
                    pet++;
                }
            }
            res.json(casovi);
        })
    }
    
    dohvatiNadolazeceCasove = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        let danasnjiDatum = moment();
        Cas.find({status: 'potvrdjen', ucenik: username, datum: {$gt: danasnjiDatum.toDate()}}).then(lista=>{
            res.json(lista);
        }).catch(err=>{
            console.log(err);
        })
    }

    dohvatiZatrazeneCasove = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        let danasnjiDatum = moment();
        Cas.find({status: 'zatrazen', nastavnik: username, datum: {$gte: danasnjiDatum.toDate()}}).then(lista=>{
            res.json(lista);
        }).catch(err=>{
            console.log(err);
        })
    }

    potvrdiCas = (req: express.Request, res: express.Response) =>{
        let idCasa = req.body.id;
        let obrazlozenje = req.body.obrazlozenje;
        let ucenik = req.body.ucenik;

        let obavestenje = new obavestenja({
            idCasa: idCasa,
            ucenik: ucenik,
            obrazlozenje: obrazlozenje
        });
        obavestenje.save().then(savedObavestenje=>{
            
        })

        Cas.updateOne({id: idCasa}, {$set: {status: "potvrdjen"}}).then(resp=>{
            res.json("odradjeno");
        })
    }

    odbijCas = (req: express.Request, res: express.Response) =>{
        let idCasa = req.body.id;
        let obrazlozenje = req.body.obrazlozenje;
        let ucenik = req.body.ucenik;

        let obavestenje = new obavestenja({
            idCasa: idCasa,
            ucenik: ucenik,
            obrazlozenje: obrazlozenje
        });
        obavestenje.save().then(savedObavestenje=>{
            
        })

        Cas.updateOne({id: idCasa}, {$set: {status: "odbijen"}}).then(resp=>{
            res.json("odradjeno");
        })
    }

    getAllClasses = (req: express.Request, res: express.Response)=>{
        let nastavnik = req.body.nastavnik;
        let ucenik = req.body.ucenik;
        let nizCasova: string[] = [];
        Cas.find({nastavnik: nastavnik, ucenik: ucenik, status: {$ne: 'odbijen'}}).then(rs=>{
            rs.forEach(r=>{
                if(!nizCasova.includes(r.predmet)){
                    nizCasova.push(r.predmet);
                }
            })
            res.json(nizCasova);
        })
    }

    getDosije = (req: express.Request, res: express.Response)=>{
        let idCasa = req.body.idCasa;
        Dosije.findOne({idCasa: idCasa}).then(resp=>{
            res.json(resp);
        })
    }

    oceni = (req: express.Request, res: express.Response)=>{
        let idCasa = req.body.idCasa;
        let ocena = req.body.ocena;
        let komentar = req.body.komentar;

        Cas.findOneAndUpdate({id: idCasa}, {$set: {status: 'ocenjen'}}).then(resp=>{
            if(resp != null){
                let dos = new dosije({
                    idCasa: idCasa,
                    ocena: ocena,
                    komentar: komentar,
                    ucenik: resp.ucenik,
                    nastavnik: resp.nastavnik
                });
                dos.save().then(resp=>{
                    res.json("Uspeh");
                })
            } else {
                res.json("Neuspeh");
            }
        })
    }

    odobriPredmet = (req: express.Request, res: express.Response)=>{
        let predmetZaDodati = req.body.predmet;
        Predmet.findOneAndUpdate({predmet: predmetZaDodati, status:'neodobren'}, {$set: {status: 'odobren'}}).then(predmet=>{
            res.json("Uspesno odobren predmet");
        })
    }

    dodajPredmet = (req: express.Request, res: express.Response)=>{
        let predmet = req.body.predmet;
        const pred = new predmeti({
            predmet: predmet,
            status: 'odobren',
            zatrazio: 'admin'
        }) 
        pred.save();
        res.json("Uspesno dodat predmet");
    }

    getAllSubjects = (req: express.Request, res: express.Response)=>{
        Predmet.find({status:'odobren'}).then(lista=>{
            let listaPredmeta: string[] = [];
            lista.forEach(l=>{
                listaPredmeta.push(l.predmet);
            })
            res.json(listaPredmeta);
        })
    }

    getNumberOfTeachers = (req: express.Request, res: express.Response)=>{
        let predmet = req.body.predmet;
        Nastavnik.find({aktivan: true}).then(lista=>{
            let broj = 0;
            lista.forEach(l=>{
                l.zeljeZaPoducavanje.forEach(z=>{
                    if(z.predmet == predmet){
                        broj = broj + 1;
                    }
                })
            })
            res.json(broj)
        })
    }

    getNumberOfTeachersPerUzrast = (req: express.Request, res: express.Response)=>{
        let uzrast = req.body.uzrast;
        Nastavnik.find({aktivan: true}).then(lista=>{
            let broj = 0;
            lista.forEach(l=>{
                l.zeljeZaUzrast.forEach(z=>{
                    if(z.uzrast == uzrast){
                        broj = broj + 1;
                    }
                })
            })
            res.json(broj)
        })
    }


}