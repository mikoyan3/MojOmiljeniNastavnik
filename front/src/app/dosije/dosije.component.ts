import { Component, OnInit } from '@angular/core';
import { nastavnici } from '../models/nastavnici';
import { ucenici } from '../models/ucenici';
import { CasoviService } from '../services/casovi.service';
import { dosije } from '../models/dosije';
import { firstValueFrom } from 'rxjs';
import { casovi } from '../models/casovi';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dosije',
  templateUrl: './dosije.component.html',
  styleUrls: ['./dosije.component.css']
})
export class DosijeComponent implements OnInit{
  nastavnik: nastavnici = new nastavnici();
  ucenik: ucenici = new ucenici();
  classesBySubjectAndDate: any[] = [];

  constructor(private casoviService: CasoviService, private router: Router){}

  ngOnInit(): void {
    let nas = localStorage.getItem('ulogovan');
    let uc = localStorage.getItem('ucenik');
    if(nas != null) this.nastavnik = JSON.parse(nas);
    if(uc != null) this.ucenik = JSON.parse(uc);
    this.getClassesBySubjectAndDate();
  }

  async getClassesBySubjectAndDate(): Promise<void> {
    const casovi = await firstValueFrom(this.casoviService.getAllClasses(this.nastavnik.username, this.ucenik.username));
    for (const cas of casovi) {
      const casoviPoDatumu: any[] = [];
      const datumi = await firstValueFrom(this.casoviService.getUniqueDatesForSubject(this.nastavnik.username, this.ucenik.username, cas));
      for (const datum of datumi) {
        const casoviForDate = await firstValueFrom(this.casoviService.getClassesFromGivenDateForGivenSubject(this.nastavnik.username, this.ucenik.username, cas, datum));
        casoviPoDatumu.push({ date: datum, classes: casoviForDate });
      }
      this.classesBySubjectAndDate.push({ predmet: cas, classesByDate: casoviPoDatumu });
    }
  }

  oceniCas(c: casovi){
    localStorage.setItem('cas', JSON.stringify(c));
    this.router.navigate(['oceni']);
  }
}
