import * as express from "express";
import Nastavnik from "../models/nastavnici"
import Ucenik from "../models/ucenici"
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import ucenici from "../models/ucenici";
import nastavnici from "../models/nastavnici";
import Administrator from "../models/administrator"
import Cas from "../models/casovi"
import Predmet from "../models/predmeti"
import predmeti from "../models/predmeti"

const bcrypt = require('bcrypt');

export class UserController{
    login = (req: express.Request, res: express.Response)=>{
       let username = req.body.username;
       let password = req.body.password;
       Nastavnik.findOne({username: username}).then(async (nastavnik)=>{
        if(nastavnik != null){
            const passwordMatch = await bcrypt.compare(password, nastavnik.password);
            if (passwordMatch) {
                if(nastavnik.aktivan == true) res.json({ userType: 'nastavnik', user: nastavnik });
                else res.json({ userType: 'neaktivan', user: null })
            } else {
                res.json({ userType: 'nePostoji', user: null });
            }
        } else {
            Ucenik.findOne({username: username}).then(async (ucenik)=>{
                if(ucenik!=null){
                    const passwordMatch = await bcrypt.compare(password, ucenik.password);
                    if (passwordMatch) {
                        res.json({ userType: 'ucenik', user: ucenik });
                    } else {
                        res.json({ userType: 'nePostoji', user: null });
                    }
                } else {
                    res.json({userType: "nePostoji", user: null});
                }
            }).catch(err=>{
                console.log(err);
            })
        }
       }).catch(err=>{
        console.log(err);
       })
    }

    loginAdmin = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;
        Administrator.findOne({username: username, password: password}).then((korisnik)=>{
            if(korisnik != null) res.json(korisnik);
            else res.json(null)
        }).catch(err=>{
            console.log(err);
        })
    }

    uploadFile(req: express.Request, res: express.Response){
        const file: Express.Multer.File = (req as Request).file;
        let filename: string = file.originalname;
        if (!file || !filename) {
            console.log("Neuspeh");
            return;
        }
        const URL = file.filename;
        res.json(URL);
    }

    uploadFileWithChange(req: express.Request, res: express.Response){
        const file: Express.Multer.File = (req as Request).file;
        let username = req.body.username;
        let filename: string = file.originalname;
        if (!file || !filename) {
            console.log("Neuspeh");
            return;
        }
        const URL = file.filename;
        Ucenik.findOneAndUpdate({username: username}, {$set: {profilePictureUrl: URL}}).then(resp=>{
            console.log("Updated url")
        }).catch(err=>{
            console.log(err);
        })
    }

    uploadFileWithChangeNastavnik(req: express.Request, res: express.Response){
        const file: Express.Multer.File = (req as Request).file;
        let username = req.body.username;
        let filename: string = file.originalname;
        if (!file || !filename) {
            console.log("Neuspeh");
            return;
        }
        const URL = file.filename;
        Nastavnik.findOneAndUpdate({username: username}, {$set: {profilePictureUrl: URL}}).then(resp=>{
            console.log("Updated url")
        }).catch(err=>{
            console.log(err);
        })
    }

    updateIme = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let ime = req.body.ime;
        Ucenik.findOneAndUpdate({username: username}, {$set: {ime: ime}}).then(resp=>{
            console.log("Updated ime");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateImeNastavnik = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let ime = req.body.ime;
        Nastavnik.findOneAndUpdate({username: username}, {$set: {ime: ime}}).then(resp=>{
            console.log("Updated ime");
        }).catch(err=>{
            console.log(err);
        })
    }

    updatePrezime = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let prezime = req.body.prezime;
        Ucenik.findOneAndUpdate({username: username}, {$set: {prezime: prezime}}).then(resp=>{
            console.log("Updated prezime");
        }).catch(err=>{
            console.log(err);
        })
    }

    updatePrezimeNastavnik = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let prezime = req.body.prezime;
        Nastavnik.findOneAndUpdate({username: username}, {$set: {prezime: prezime}}).then(resp=>{
            console.log("Updated prezime");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateAdresa = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let adresa = req.body.adresa;
        Ucenik.findOneAndUpdate({username: username}, {$set: {adresa: adresa}}).then(resp=>{
            console.log("Updated adresa");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateAdresaNastavnik = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let adresa = req.body.adresa;
        Nastavnik.findOneAndUpdate({username: username}, {$set: {adresa: adresa}}).then(resp=>{
            console.log("Updated adresa");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateTelefon = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let telefon = req.body.telefon;
        Ucenik.findOneAndUpdate({username: username}, {$set: {telefon: telefon}}).then(resp=>{
            console.log("Updated telefon");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateTelefonNastavnik = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let telefon = req.body.telefon;
        Nastavnik.findOneAndUpdate({username: username}, {$set: {telefon: telefon}}).then(resp=>{
            console.log("Updated telefon");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateEmail = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let email = req.body.email;
        Ucenik.findOneAndUpdate({username: username}, {$set: {email: email}}).then(resp=>{
            console.log("Updated email");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateEmailNastavnik = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let email = req.body.email;
        Nastavnik.findOneAndUpdate({username: username}, {$set: {email: email}}).then(resp=>{
            console.log("Updated email");
        }).catch(err=>{
            console.log(err);
        })
    }

    updateRazred = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let srednja = req.body.srednja;
        Ucenik.findOne({username: username}).then(ucenik=>{
            if(ucenik.tipSkole == "osnovna" && ucenik.razred == 8){
                Ucenik.findOneAndUpdate({username: username}, {$set: {tipSkole: srednja, razred: 1}}).then(resp=>{
                    console.log("Updated to srednja")
                }).catch(err=>{
                    console.log(err)
                })
            } else {
                Ucenik.findOneAndUpdate({username: username}, {$inc: { razred: 1}}).then(resp=>{
                    console.log("Updated rezred")
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    }

    registerUcenik(req: express.Request, res: express.Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            try {
              const file: Express.Multer.File = (req as Request).file;
              const filename: string = file.originalname;
              if (!file || !filename) {
                console.log("Neuspeh");
                resolve();
                return;
              }
              let razred = parseInt(req.body.razred, 10);
              const hashedPassword = await bcrypt.hash(req.body.password, 10);
              const profilePictureUrl = file.filename;
              const user = new ucenici({
                username: req.body.username,
                password: hashedPassword,
                odgovorNaPitanje: req.body.odgovorNaPitanje,
                ime: req.body.ime,
                prezime: req.body.prezime,
                pol: req.body.pol,
                adresa: req.body.adresa,
                telefon: req.body.telefon,
                email: req.body.email,
                profilePictureUrl: profilePictureUrl,
                tipSkole: req.body.tipSkole,
                razred: razred,
                ukupnaOcena: 0,
                brojOcena: 0
              });
              await user.save();
              console.log("Uspeh");
              resolve();
            } catch (error) {
              console.log("Neuspeh");
              reject(error);
            }
          });
    }

    azurirajZeljeZaPoducavanje = (req: express.Request, res: express.Response) =>{
        let username = req.body.username;
        let zeljeZaPoducavanje = req.body.zeljeZaPoducavanje;
        Nastavnik.updateOne({username: username}, {$set: {zeljeZaPoducavanje: zeljeZaPoducavanje}}).then(ret=>{
            console.log("uspeh");
        })
    }

    azurirajZeljeZaUzrast = (req: express.Request, res: express.Response) =>{
        let username = req.body.username;
        let zeljeZaUzrast = req.body.zeljeZaUzrast;
        Nastavnik.updateOne({username: username}, {$set: {zeljeZaUzrast: zeljeZaUzrast}}).then(ret=>{
            console.log("uspeh");
        })
    }

    odobriNastavnika = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;

        Nastavnik.updateOne({username: username}, {$set: {aktivan: true}}).then(ret=>{
            res.json("Uspeh");
        })
    }

    registerNastavnik = (req: express.Request, res: express.Response) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
              const hashedPassword = await bcrypt.hash(req.body.password, 10);
              let drugo = req.body.drugo;
              const user = new nastavnici({
                username: req.body.username,
                password: hashedPassword,
                odgovorNaPitanje: req.body.odgovorNaPitanje,
                ime: req.body.ime,
                prezime: req.body.prezime,
                pol: req.body.pol,
                adresa: req.body.adresa,
                telefon: req.body.telefon,
                email: req.body.email,
                profilePictureUrl: req.body.profilePictureUrl,
                CVUrl: req.body.CVUrl,
                zeljeZaPoducavanje: req.body.zeljeZaPoducavanje,
                zeljeZaUzrast: req.body.zeljeZaUzrast,
                preporuka: req.body.preporuka,
                aktivan: false
              });
              if(drugo != ""){
                const predmet = new predmeti({
                    predmet: drugo,
                    status: 'neodobren',
                    zatrazio: req.body.username
                })    
                await predmet.save();
              }
              await user.save();
              res.json("uspeh")
              resolve();
            } catch (error) {
              console.log("Neuspeh");
              reject(error);
            }
          });
    }

    getProfilePictureNastavnik = (req: express.Request, res: express.Response)=>{
        const directory = path.join(__dirname, "../../uploads");
        let username = req.body.username;
        Nastavnik.findOne({username: username}).then(korisnik=>{
            if(!korisnik || !korisnik.profilePictureUrl){
                return;
            } else {
                const filePath = path.join(directory, korisnik.profilePictureUrl);
                if(fs.existsSync(filePath)){
                    res.type('application/octet-stream').sendFile(filePath);
                } else {
                    return;
                }
            }
        })
    }

    getFile = (req: express.Request, res: express.Response) =>{
        const directory = path.join(__dirname, "../../uploads");
        let username = req.body.username;
        Ucenik.findOne({username: username}).then(korisnik=>{
            if(!korisnik || !korisnik.profilePictureUrl){
                Nastavnik.findOne({username: username}).then(nastavnik=>{
                    if(!nastavnik || !nastavnik.CVUrl ){
                        return;
                    } else {
                        const filePath = path.join(directory, nastavnik.CVUrl);
                        if(fs.existsSync(filePath)){
                            res.type('application/octet-stream').sendFile(filePath);
                        } else {
                            return;
                        }
                    }
                })
            } else {
                const filePath = path.join(directory, korisnik.profilePictureUrl);
                if(fs.existsSync(filePath)){
                    res.type('application/octet-stream').sendFile(filePath);
                } else {
                    return;
                }
            }
        })
    }

    getCV = (req: express.Request, res: express.Response)=>{
        const directory = path.join(__dirname, "../../uploads");
        let username = req.body.username;
        Nastavnik.findOne({username: username}).then(nastavnik=>{
            if(!nastavnik || !nastavnik.CVUrl ){
                return;
            } else {
                const filePath = path.join(directory, nastavnik.CVUrl);
                if(fs.existsSync(filePath)){
                    res.type('application/octet-stream').sendFile(filePath);
                } else {
                    return;
                }
            }
        })
    }

    getPendingRequests = (req: express.Request, res: express.Response) => {
        Nastavnik.find({aktivan: false}).then(lista=>{
            res.json(lista);
        }).catch(err=>{
            console.log(err)
        })
    }

    getSveUcenike = (req: express.Request, res: express.Response) => {
        Ucenik.find({}).then(lista=>{
            res.json(lista)
        }).catch(err=>{
            console.log(err);
        })
    }

    getAktivneNastavnike = (req: express.Request, res: express.Response) => {
        Nastavnik.find({aktivan: true}).then(lista=>{
            res.json(lista);
        }).catch(err=>{
            console.log(err);
        })
    }

    getBrojOdrzanihCasova = (req: express.Request, res: express.Response) => {
        let brojUnazad = req.body.brojUnazad;
        const donjiDate = new Date();
        donjiDate.setDate(donjiDate.getDate() - brojUnazad);

        Cas.find({datum: {$gte: donjiDate, $lte: new Date()}}).then(lista=>{
            res.json(lista);
        }).catch(err=>{
            console.log(err);
        })
    }

    getSvePredmete = (req: express.Request, res: express.Response) =>{
        Predmet.find({status:'odobren'}).then(predmeti=>{
            res.json(predmeti)
        }).catch(err=>{
            console.log(err)
        })
    }

    getNastavnik = (req: express.Request, res: express.Response) =>{
        let username = req.body.username
        Nastavnik.findOne({username: username}).then(resp=>{
            res.json(resp);
        }).catch(err=>{
            console.log(err)
        })
    }

    getSveNastavnike = (req: express.Request, res: express.Response) =>{
        Nastavnik.find({}).then(nastavnici=>{
            res.json(nastavnici)
        }).catch(err=>{
            console.log(err)
        })
    }

    pretragaNastavnika = (req: express.Request, res: express.Response) => {
        let ime = req.body.ime;
        let prezime = req.body.prezime;
        if (ime != "" && prezime != ""){
            Nastavnik.find({ime: ime, prezime: prezime}).then(resp=>{
                res.json(resp);
            }).catch(err=>{
                console.log(err)
            })
        } else if (ime != ""){
            Nastavnik.find({ime: ime}).then(resp=>{
                res.json(resp);
            }).catch(err=>{
                console.log(err)
            })
        } else {
            Nastavnik.find({prezime: prezime}).then(resp=>{
                res.json(resp);
            }).catch(err=>{
                console.log(err)
            })
        }
    }

    getPredmet = (req: express.Request, res: express.Response) => {
        let naziv = req.body.predmet;
        Predmet.findOne({predmet: naziv}).then(resp=>{
            res.json(resp)
        }).catch(err=>{
            console.log(err);
        })
    }

    getUcenik = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        Ucenik.findOne({username: username}).then(resp=>{
            res.json(resp);
        }).catch(err=>{
            console.log(err);
        })
    }

    getAllPendingPredmete = (req: express.Request, res: express.Response)=>{
        Predmet.find({status:'neodobren'}).then(lista=>{
            res.json(lista);
        })
    }

    dohvatiRaspodeluNastavnika = (req: express.Request, res: express.Response)=>{
        let musko = 0;
        let zensko = 0;
        Nastavnik.find({aktivan: true}).then(lista=>{
            lista.forEach(l=>{
                if(l.pol == 'm') musko = musko + 1;
                else zensko = zensko + 1;
            })
            const raspodela = { musko, zensko };
            res.json(raspodela);
        })
    }
    dohvatiRaspodeluUcenika = (req: express.Request, res: express.Response)=>{
        let musko = 0;
        let zensko = 0;
        Ucenik.find({}).then(lista=>{
            lista.forEach(l=>{
                if(l.pol == 'm') musko = musko + 1;
                else zensko = zensko + 1;
            })
            const raspodela = { musko, zensko };
            res.json(raspodela);
        })
    }
}