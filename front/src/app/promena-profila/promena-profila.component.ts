import { Component, OnInit } from '@angular/core';
import { ucenici } from '../models/ucenici';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-promena-profila',
  templateUrl: './promena-profila.component.html',
  styleUrls: ['./promena-profila.component.css']
})
export class PromenaProfilaComponent implements OnInit{
  constructor(private userService: UserService){}
  ngOnInit(): void {
    let usr = localStorage.getItem('ulogovan')
    if(usr!=null) this.korisnik = JSON.parse(usr);
    if(this.korisnik.tipSkole == "osnovna" && this.korisnik.razred == 8){
      this.srednja=true;
    } else {
      this.srednja=false;
    }
  }
  ime: string = ""
  prezime: string = ""
  adresa: string = ""
  email: string = ""
  telefon: string = ""
  razred: boolean = false;
  fileForUpload: File | null = null;
  srednja: boolean = false
  srednjagimnazija: boolean = false;
  srednjastrucna: boolean = false;
  srednjaumetnicka: boolean = false;
  korisnik: ucenici;
  message = "";
  
  onFileSelected(event: any): void{
    this.fileForUpload = event.target.files[0];
  }

  updateProfile(){
    const updateFunkcije = [
      { atribut : this.ime, method: 'updateIme', fieldName: 'ime'},
      { atribut : this.prezime, method: 'updatePrezime', fieldName: 'prezime'},
      { atribut : this.adresa, method: 'updateAdresa', fieldName: 'adresa'},
      { atribut : this.email, method: 'updateEmail', fieldName: 'email'},
      { atribut : this.telefon, method: 'updateTelefon', fieldName: 'telefon'},
      { atribut: this.fileForUpload, method: 'uploadFileWithChange', fieldName: 'file'}
    ]
    if(this.ime=="" && this.prezime == "" && this.adresa == "" && this.email == "" && this.telefon == "" && this.razred==false && this.fileForUpload==null){
      this.message = "Niste uneli ni jedan podatak";
    } else if (this.razred == true && this.srednja != false && this.srednjagimnazija==false && this.srednjastrucna==false && this.srednjaumetnicka==false){
      this.message = "Niste odabrali ni jednu srednju skolu";
    } else {
      this.message = ""
      if(this.razred == true){
        if(this.srednjagimnazija && this.srednja == true){
          console.log("Uso je u srednju gimnaziju");
          updateFunkcije.push({atribut: 'srednja-gimnazija', method: 'updateRazred', fieldName: 'srednja'})
        }else if (this.srednjastrucna && this.srednja == true){
          updateFunkcije.push({atribut: 'srednja-strucna', method: 'updateRazred', fieldName: 'srednja'})
        } else if (this.srednjaumetnicka && this.srednja == true){
          updateFunkcije.push({atribut: 'srednja-umetnicka', method: 'updateRazred', fieldName: 'srednja'})
        } else {
          updateFunkcije.push({atribut: 'blabla', method: 'updateRazred', fieldName: 'srednja'})
        }
      }
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
        this.userService.getUcenik(this.korisnik.username).subscribe((u: ucenici)=>{
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
