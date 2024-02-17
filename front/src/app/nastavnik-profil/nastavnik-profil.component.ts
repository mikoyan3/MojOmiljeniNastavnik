import { Component, OnInit, Sanitizer } from '@angular/core';
import { nastavnici } from '../models/nastavnici';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { ucenici } from '../models/ucenici';
import { CasoviService } from '../services/casovi.service';

@Component({
  selector: 'app-nastavnik-profil',
  templateUrl: './nastavnik-profil.component.html',
  styleUrls: ['./nastavnik-profil.component.css']
})
export class NastavnikProfilComponent implements OnInit{
  korisnik: nastavnici;
  fileDownloaded: SafeUrl | null = null;
  zakazivanje: boolean = false;
  visePredmeta: boolean = true; 
  predmet: string = "";
  predmetCasa: string = "";
  datumCasa: Date = null;
  temaCasa: string = "";
  dupliCas: boolean = false;
  message: string = "";
  ucenik: ucenici;

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private casoviService: CasoviService){}
  ngOnInit(): void {
    let usr = localStorage.getItem('nastavnik');
    if(usr != null) this.korisnik = JSON.parse(usr);
    let uc = localStorage.getItem('ulogovan');
    if(uc != null) this.ucenik = JSON.parse(uc);
    if(this.korisnik.zeljeZaPoducavanje.length == 1){
      this.visePredmeta = false;
      this.predmet = this.korisnik.zeljeZaPoducavanje[0].predmet;
    }
    this.userService.getProfilePictureNastavnik(this.korisnik.username).subscribe((data)=>{
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
    })
  }

  zakaziCas(){
    this.zakazivanje = true;
  }

  zakazivanjeCasa(){ 
    let currentDate = new Date();
    let selectedDate = new Date(this.datumCasa);
    let formatiranDatum = selectedDate.toISOString();
    if(this.korisnik.zeljeZaPoducavanje.length == 1){
      this.predmetCasa = this.predmet;
    }
    if(this.predmetCasa == "" || this.datumCasa == null || this.temaCasa == ""){
      this.message = "Niste uneli sve podatke"
    } else {
      if(selectedDate.getHours() < 10){
        this.message = "Nije moguce zakazivanje casova pre 10:00"
      } else if (selectedDate.getHours() > 18){
        this.message = "Nije moguce zakazivanje casova posle 18:00"
      } else if (selectedDate < currentDate) {
        this.message = "Nije moguce zakazivanje casova u proslosti"
      } else if ((this.dupliCas == true && (selectedDate.getHours() + 2) > 18) || (this.dupliCas == false && (selectedDate.getHours() + 1) > 18)){
        this.message = "Nije moguce da se cas zavrsava posle 18:00"
      } else if ((this.dupliCas == true && (selectedDate.getHours() + 2) == 18 && selectedDate.getMinutes() > 0) || (this.dupliCas == false && (selectedDate.getHours() + 1) == 18 && selectedDate.getMinutes() > 0)) { 

      }else if (selectedDate.getDay() == 0 || selectedDate.getDay() == 6){
        this.message = "Nije moguce zakazivanje casova vikendom"
      } else {
        this.message = ""
        this.casoviService.dodajCas(this.korisnik.username, formatiranDatum, this.predmetCasa, this.temaCasa, this.dupliCas, this.ucenik.username).subscribe((resp: string)=>{
          this.message = resp;
        })
      }
    }
  }
}
