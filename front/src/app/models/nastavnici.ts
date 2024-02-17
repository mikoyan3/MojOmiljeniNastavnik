import { zeljeZaPoducavanje } from "./zeljeZaPoducavanje";
import { zeljeZaUzrast } from "./zeljeZaUzrast";

export class nastavnici{
    username: string = "";
    password: string = "";
    odgovorNaPitanje: string = "";
    ime: string = "";
    prezime: string = "";
    pol: string = "";
    adresa: string = "";
    telefon: string = ""; 
    email: string = "";
    CVUrl: string = "";
    profilePictureUrl: string = "";
    zeljeZaPoducavanje: zeljeZaPoducavanje[] = [];
    zeljeZaUzrast: zeljeZaUzrast[] = [];
    preporuka: string = "";
    aktivan: boolean;
}