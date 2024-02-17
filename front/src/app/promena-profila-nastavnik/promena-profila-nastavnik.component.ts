import { Component, OnInit } from '@angular/core';
import { nastavnici } from '../models/nastavnici';
import { UserService } from '../services/user.service';
import { zeljeZaUzrast } from '../models/zeljeZaUzrast';
import { zeljeZaPoducavanje } from '../models/zeljeZaPoducavanje';

@Component({
  selector: 'app-promena-profila-nastavnik',
  templateUrl: './promena-profila-nastavnik.component.html',
  styleUrls: ['./promena-profila-nastavnik.component.css']
})
export class PromenaProfilaNastavnikComponent implements OnInit{
  korisnik: nastavnici;
  ime: string = "";
  prezime: string = "";
  adresa: string = "";
  telefon: string = "";
  email: string = "";
  uzrast: string[] = [];
  predmeti: string[] = [];
  zeljeZaUzrast: zeljeZaUzrast[] = [];
  zeljeZaPoducavanje: zeljeZaPoducavanje[] = [];
  dr: string = "";
  fileForUpload: File | null = null;
  message: string = "";

  constructor(private userService: UserService){}
  ngOnInit(): void {
    let usr = localStorage.getItem('ulogovan')
    if(usr!=null) this.korisnik = JSON.parse(usr);
  }

  onFileSelected(event: any): void{
    this.fileForUpload = event.target.files[0];
  }

  updateProfile(){
    if(this.dr != ""){
      this.predmeti.push(this.dr);
      let index = this.predmeti.indexOf('drugo');
      this.predmeti.splice(index, 1);
    }
    if(this.uzrast.length != 0){
      this.uzrast.forEach(u=>{
        let zelja = new zeljeZaUzrast();
        zelja.uzrast = u;
        this.zeljeZaUzrast.push(zelja);
      })
    }
    if(this.predmeti.length != 0){
      this.predmeti.forEach(u=>{
        let zelja = new zeljeZaPoducavanje();
        zelja.predmet = u;
        this.zeljeZaPoducavanje.push(zelja);
      })
    }
    const updateFunkcije = [
      { atribut : this.ime, method: 'updateImeNastavnik', fieldName: 'ime'},
      { atribut : this.prezime, method: 'updatePrezimeNastavnik', fieldName: 'prezime'},
      { atribut : this.adresa, method: 'updateAdresaNastavnik', fieldName: 'adresa'},
      { atribut : this.email, method: 'updateEmailNastavnik', fieldName: 'email'},
      { atribut : this.telefon, method: 'updateTelefonNastavnik', fieldName: 'telefon'},
      { atribut: this.fileForUpload, method: 'uploadFileWithChangeNastavnik', fieldName: 'file'},
      { atribut: this.zeljeZaPoducavanje, method: 'azurirajZeljeZaPoducavanje', fieldName: 'zeljeZaPoducavanje'},
      { atribut: this.zeljeZaUzrast, method: 'azurirajZeljeZaUzrast', fieldName: 'zeljeZaUzrast'}
    ]
    if(this.ime == "" && this.prezime == "" && this.adresa == "" && this.telefon == "" && this.email == "" && this.uzrast.length == 0 && this.predmeti.length == 0 && this.fileForUpload == null){
      this.message = "Niste uneli ni jedan podatak za azuriranje";
    }
    else {
      this.message = ""
      const obecanja = [];
      for( const{ atribut, method, fieldName } of updateFunkcije){
        if(atribut != "" && atribut != null){
          obecanja.push(this.callUpdateMethod(method, fieldName, atribut));
        }
      }
      Promise.all(obecanja).then(()=>{
      }).catch(err=>{
        console.log(err);
      })
      this.userService.getNastavnik(this.korisnik.username).subscribe((u:nastavnici)=>{
        console.log(u);
        this.korisnik = u;
        localStorage.removeItem('ulogovan');
        localStorage.setItem('ulogovan', JSON.stringify(this.korisnik));
      })
    }
  }

  callUpdateMethod(method: string, fieldName: string, value: any): Promise<any>{
    const username = this.korisnik.username;
    return new Promise((resolve, reject)=>{
      this.userService[method](username, value).subscribe((res)=>resolve(null), (error)=>{
        reject(error);
      })
    })
  }

}
