import { Component, OnInit } from '@angular/core';
import { ucenici } from '../models/ucenici';
import { nastavnici } from '../models/nastavnici';
import { casovi } from '../models/casovi';
import { CasoviService } from '../services/casovi.service';

@Component({
  selector: 'app-oceni-cas',
  templateUrl: './oceni-cas.component.html',
  styleUrls: ['./oceni-cas.component.css']
})
export class OceniCasComponent implements OnInit{
  ucenik: ucenici = new ucenici();
  nastavnik: nastavnici = new nastavnici();
  cas: casovi = new casovi();
  ocena: number = 0;
  komentar: string = "";
  message: string = "";
  flagOcenjen = false;

  constructor(private casoviService: CasoviService){}

  ngOnInit(): void{
    let nas = localStorage.getItem('ulogovan');
    let uc = localStorage.getItem('ucenik');
    let cs = localStorage.getItem('cas');
    if(nas != null) this.nastavnik = JSON.parse(nas);
    if(uc != null) this.ucenik = JSON.parse(uc);
    if(cs != null) this.cas = JSON.parse(cs);
  }

  oceni(){
    if(this.ocena == 0) this.message="Niste uneli ocenu";
    else{
      this.message = "";
      this.casoviService.oceni(this.cas.id, this.ocena, this.komentar).subscribe(resp=>{
        if(resp == "Uspeh") {
          this.message = "Uspesno ste ocenili ucenika!";
          this.flagOcenjen = true;
        }
        else this.message = "Neuspesno ocenjen ucenik!";
      })
    }
  }
}
