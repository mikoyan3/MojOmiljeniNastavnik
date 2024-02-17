import { Component, OnInit } from '@angular/core';
import { nastavnici } from '../models/nastavnici';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { casovi } from '../models/casovi';
import { CasoviService } from '../services/casovi.service';
import { ucenici } from '../models/ucenici';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-nastavnik',
  templateUrl: './nastavnik.component.html',
  styleUrls: ['./nastavnik.component.css']
})
export class NastavnikComponent implements OnInit{
  korisnik: nastavnici = new nastavnici();
  fileDownloaded: SafeUrl | null = null;
  profilFlag: boolean = true;
  casoviFlag: boolean = false;
  uceniciFlag: boolean = false;
  casoviNextThreeDays: casovi[] = [];
  ucenici: ucenici[] = [];
  dugme: boolean[] = [];
  zatrazeniCasovi: casovi[] = [];
  uceniciZatrazeniCasovi: ucenici[] = [];
  obrazlozenje: string = "";
  allUcenici: ucenici[] = [];

  constructor(private router: Router, private userService: UserService, private sanitizer: DomSanitizer, private casoviService: CasoviService){}

  async ngOnInit(): Promise<void> {
    let usr = localStorage.getItem('ulogovan');
    if(usr != null) this.korisnik = JSON.parse(usr);

    await this.userService.getProfilePictureNastavnik(this.korisnik.username).subscribe(async (data) => {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
    });

    await Promise.all([
      this.fetchCasoviAndUcenici(),
      this.fetchZatrazeniCasovi()
    ]);
  }

  async fetchZatrazeniCasovi(): Promise<void> {
    await this.casoviService.dohvatiZatrazeneCasove(this.korisnik.username).subscribe(async (c: casovi[])=>{
      this.zatrazeniCasovi = c;
      for(let cas of this.zatrazeniCasovi){
        const ucenik: ucenici = await firstValueFrom(this.userService.getUcenik(cas.ucenik));
        this.uceniciZatrazeniCasovi.push(ucenik);
      }
    })
  }

  async fetchCasoviAndUcenici(): Promise<void> {
    let danas = new Date();
    await this.casoviService.dohvatiPetCasova(this.korisnik.username).subscribe(async (c: casovi[]) => {
      this.casoviNextThreeDays = c;
      for (let cas of this.casoviNextThreeDays) {
        let dateFormatted = new Date(cas.datum);
        let diff = dateFormatted.getTime() - danas.getTime();
        let petnaestMin = 15 * 60 * 1000;
        if(diff <= petnaestMin){
          cas.dugme = true;
        }
        const ucenik: ucenici = await firstValueFrom(this.userService.getUcenik(cas.ucenik));
        this.ucenici.push(ucenik);
      }
    });
  }

  prikaziProfil(){
    this.profilFlag = true;
    this.casoviFlag = false;
    this.uceniciFlag = false;
  }

  prikaziCasove() {
    this.profilFlag = false;
    this.casoviFlag = true;
    this.uceniciFlag = false;
  }

  prikaziMojeUcenike(){
    this.profilFlag = false;
    this.casoviFlag = false;
    this.uceniciFlag = true;
    this.userService.getSveUcenike().subscribe((u: ucenici[])=>{
      this.allUcenici = u;
    })
  }

  promeniProfil(){
    this.router.navigate(['promenaProfilaNastavnik']);
  }

  async potvrdi(c: casovi): Promise<void>{
    await this.casoviService.potvrdiCas(c.id, this.obrazlozenje, c.ucenik).subscribe(async(s: string)=>{
      await this.ngOnInit(); 
    });
  }
  
  async odbij(c: casovi): Promise<void>{
    await this.casoviService.odbijCas(c.id, this.obrazlozenje, c.ucenik).subscribe(async(s: string)=>{
      await this.ngOnInit(); 
    });
  }

  prikaziDosije(u: ucenici){
    localStorage.setItem('ucenik', JSON.stringify(u));
    this.router.navigate(['dosije']);
  }
}
