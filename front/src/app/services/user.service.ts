import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ucenici } from '../models/ucenici';
import { nastavnici } from '../models/nastavnici';
import { predmeti } from '../models/predmeti';
import { casovi } from '../models/casovi';
import { zeljeZaPoducavanje } from '../models/zeljeZaPoducavanje';
import { zeljeZaUzrast } from '../models/zeljeZaUzrast';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<any>{
    let data = {
      username: username,
      password: password
    }
    return this.http.post("http://localhost:4000/users/login", data);
  }

  loginAdmin(username: string, password: string){
    let data = {
      username: username,
      password: password
    }
    return this.http.post("http://localhost:4000/users/loginAdmin", data);
  }

  registerUcenik(ucenik: ucenici, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', ucenik.username);
    formData.append('password', ucenik.password);
    formData.append('odgovorNaPitanje', ucenik.odgovorNaPitanje);
    formData.append('ime', ucenik.ime);
    formData.append('prezime', ucenik.prezime);
    formData.append('pol', ucenik.pol);
    formData.append('adresa', ucenik.adresa);
    formData.append('telefon', ucenik.telefon);
    formData.append('email', ucenik.email);
    formData.append('profilePictureUrl', ucenik.profilePictureUrl);
    formData.append('tipSkole', ucenik.tipSkole);
    formData.append('razred', ucenik.razred.toString());
    return this.http.post("http://localhost:4000/users/registerUcenik", formData);
  }

  registerNastavnik(n: nastavnici, drugo: string){
    let data = {
      username: n.username,
      password: n.password,
      ime: n.ime,
      prezime: n.prezime,
      odgovorNaPitanje: n.odgovorNaPitanje,
      pol: n.pol,
      adresa: n.adresa,
      telefon: n.telefon,
      email: n.email,
      profilePictureUrl: n.profilePictureUrl,
      CVUrl: n.CVUrl,
      zeljeZaPoducavanje: n.zeljeZaPoducavanje,
      zeljeZaUzrast: n.zeljeZaUzrast,
      preporuka: n.preporuka,
      drugo: drugo
    }
    return this.http.post<string>("http://localhost:4000/users/registerNastavnik", data);
  }

  odobriNastavnika(username: string){
    let data = {
      username: username
    }

    return this.http.post<string>("http://localhost:4000/users/odobriNastavnika", data)
  }

  uploadFile(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post("http://localhost:4000/users/uploadFile", formData);
  }

  getFile(username: string): Observable<ArrayBuffer>{
    let data = {
      username: username
    }
    return this.http.post("http://localhost:4000/users/getFile", data, { responseType: 'arraybuffer'})
  }

  getProfilePictureNastavnik(username: string): Observable<ArrayBuffer>{
    let data = {
      username: username
    }
    return this.http.post("http://localhost:4000/users/getProfilePictureNastavnik", data, { responseType: 'arraybuffer'})
  }

  getCV(username: string): Observable<ArrayBuffer>{
    let data = {
      username: username
    }
    return this.http.post("http://localhost:4000/users/getCV", data, { responseType: 'arraybuffer'})
  }

  getPendingRequests() {
    return this.http.get<nastavnici[]>("http://localhost:4000/users/getPendingRequests");
  }

  getSveUcenike() {
    return this.http.get<ucenici[]>("http://localhost:4000/users/getSveUcenike");
  }

  getAktivneNastavnike(){
    return this.http.get<nastavnici[]>("http://localhost:4000/users/getAktivneNastavnike")
  }

  getSvePredmete(){
    return this.http.get<predmeti[]>("http://localhost:4000/users/getSvePredmete");
  }

  getBrojOdrzanihCasova(broj: number){
    let data = {
      brojUnazad: broj
    }
    return this.http.post<casovi[]>("http://localhost:4000/users/getBrojOdrzanihCasova", data)
  }

  pretragaNastavnika(ime: string, prezime: string){
    let data = {
      ime: ime,
      prezime: prezime
    }
    return this.http.post<nastavnici[]>("http://localhost:4000/users/pretragaNastavnika", data)
  }

  getPredmet(naziv: string){
    let data = {
      predmet: naziv
    }
    return this.http.post<predmeti>("http://localhost:4000/users/getPredmet", data)
  }

  getNastavnik(username: string){
    let data = {
      username: username
    }
    return this.http.post<nastavnici>("http://localhost:4000/users/getNastavnik", data)
  }

  getSveNastavnike(){
    return this.http.get<nastavnici[]>("http://localhost:4000/users/getSveNastavnike");
  }

  uploadFileWithChange(username: string, file: File){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username)
    return this.http.post("http://localhost:4000/users/uploadFileWithChange", formData);
  }

  uploadFileWithChangeNastavnik(username: string, file: File){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username)
    return this.http.post("http://localhost:4000/users/uploadFileWithChangeNastavnik", formData);
  }

  updateIme(username: string, ime: string){
    const data = {
      username: username,
      ime: ime
    }
    return this.http.post("http://localhost:4000/users/updateIme", data);
  }

  updateImeNastavnik(username: string, ime: string){
    const data = {
      username: username,
      ime: ime
    }
    return this.http.post("http://localhost:4000/users/updateImeNastavnik", data);
  }

  updatePrezime(username: string, prezime: string){
    const data = {
      username: username,
      prezime: prezime
    }
    return this.http.post("http://localhost:4000/users/updatePrezime", data);
  }

  updatePrezimeNastavnik(username: string, prezime: string){
    const data = {
      username: username,
      prezime: prezime
    }
    return this.http.post("http://localhost:4000/users/updatePrezimeNastavnik", data);
  }

  updateAdresa(username: string, adresa: string){
    const data = {
      username: username,
      adresa: adresa
    }
    return this.http.post("http://localhost:4000/users/updateAdresa", data);
  }

  updateAdresaNastavnik(username: string, adresa: string){
    const data = {
      username: username,
      adresa: adresa
    }
    return this.http.post("http://localhost:4000/users/updateAdresaNastavnik", data);
  }

  updateTelefon(username: string, telefon: string){
    const data = {
      username: username,
      telefon: telefon
    }
    return this.http.post("http://localhost:4000/users/updateTelefon", data);
  }

  updateTelefonNastavnik(username: string, telefon: string){
    const data = {
      username: username,
      telefon: telefon
    }
    return this.http.post("http://localhost:4000/users/updateTelefonNastavnik", data);
  }

  updateEmail(username: string, email: string){
    const data = {
      username: username,
      email: email
    }
    return this.http.post("http://localhost:4000/users/updateEmail", data);
  }

  updateEmailNastavnik(username: string, email: string){
    const data = {
      username: username,
      email: email
    }
    return this.http.post("http://localhost:4000/users/updateEmailNastavnik", data);
  }

  updateRazred(username: string, srednja: string){
    const data = {
      username: username,
      srednja: srednja
    }
    return this.http.post("http://localhost:4000/users/updateRazred", data);
  }

  getUcenik(username: string){
    const data = {
      username: username
    }
    return this.http.post<ucenici>("http://localhost:4000/users/getUcenik", data);
  }

  azurirajZeljeZaPoducavanje(username: string, zeljeZaPoducavanje: zeljeZaPoducavanje[]){
    const data = {
      username: username,
      zeljeZaPoducavanje: zeljeZaPoducavanje
    }
    return this.http.post<string>("http://localhost:4000/users/azurirajZeljeZaPoducavanje", data);
  }
  
  azurirajZeljeZaUzrast(username: string, zeljeZaUzrast: zeljeZaUzrast[]){
    const data = {
      username: username,
      zeljeZaUzrast: zeljeZaUzrast
    }
    return this.http.post<string>("http://localhost:4000/users/azurirajZeljeZaUzrast", data);
  }

  getAllPendingPredmete(){
    return this.http.get<predmeti[]>("http://localhost:4000/users/getAllPendingPredmete")
  }

  dohvatiRaspodeluNastavnika(){
    return this.http.get<{musko: number, zensko: number}>("http://localhost:4000/users/dohvatiRaspodeluNastavnika");
  }

  dohvatiRaspodeluUcenika(){
    return this.http.get<{musko: number, zensko: number}>("http://localhost:4000/users/dohvatiRaspodeluUcenika");
  }

  
}
