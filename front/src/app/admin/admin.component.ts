import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { nastavnici } from '../models/nastavnici';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { predmeti } from '../models/predmeti';
import { CasoviService } from '../services/casovi.service';
import { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js/auto'
import { forkJoin } from 'rxjs';
import { helper } from '../models/helper';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  @ViewChild('brojNastavnikaPoPredmetu') columnChart: ElementRef;
  @ViewChild('brojNastavnikaPoUzrastu') columnChartUzrast: ElementRef;
  @ViewChild('pitaNastavnik') nastavnikPieChart: ElementRef;
  @ViewChild('pitaUcenik') ucenikPieChart: ElementRef;
  @ViewChild('histogram') histogramChart: ElementRef;
  @ViewChild('linijski') linijskiChart: ElementRef;
  chart: any;
  chartUzrast: any;
  nastavnikChart: any;
  ucenikChart: any;
  histogram: any;
  linijski: any;
  pendingRequests: nastavnici[] = [];
  constructor(private userService: UserService, private sanitizer: DomSanitizer, private casoviService: CasoviService){}
  fileDownloaded: SafeResourceUrl | null = null
  predmeti: predmeti[] = [];
  noviPredmet: string = "";
  messageOdobren: string = "";
  messageDodat: string = "";
  flagObradaZahteva: boolean = false;
  uzrasti: string[] = [];
  muskoNastavnik: number = 0;
  zenskoNastavnik: number = 0;
  ukupnoNastavnik: number = 0;
  muskoUcenik: number = 0;
  zenskoUcenik: number = 0;
  ukupnoUcenik: number = 0;
  daysOfWeek: string[] = ['NED', 'PON', 'UTO', 'SRE', 'CET', 'PET', 'SUB'];
  averageCasoviPerDayOfWeek: number[] = Array(7).fill(0);
  nastavniciPerMonths: helper[] = [];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  ngOnInit(): void {
    this.uzrasti = [
      "osnovna skola 1-4 razred",
      "osnovna skola 5-8 razred",
      "srednja skola"
    ];
    this.userService.dohvatiRaspodeluNastavnika().subscribe(raspodela=>{
      this.ukupnoNastavnik = raspodela.musko + raspodela.zensko;
      this.muskoNastavnik = raspodela.musko;
      this.zenskoNastavnik = raspodela.zensko;
      this.userService.dohvatiRaspodeluUcenika().subscribe(raspodela=>{
        this.ukupnoUcenik = raspodela.musko + raspodela.zensko;
        this.muskoUcenik = raspodela.musko;
        this.zenskoUcenik = raspodela.zensko;
        this.casoviService.getAverageCasoviPerDay().subscribe(resp =>{
          for(let i = 0; i < 7; i++){
            this.averageCasoviPerDayOfWeek[i] = resp.ukupanBrojPoDanima[i] / resp.counterPoDanima[i];
          }
          this.casoviService.getBrojOdrzanih().subscribe(lista=>{
            if(lista.length > 10){
              for(let i = 0; i < 10; i++){
                this.nastavniciPerMonths.push(lista[i]);
              }
            } else {
              this.nastavniciPerMonths = lista;
            }
            this.inicijalizuj();
          })
          
        })
      })
    })
  }

  inicijalizuj(){
    this.userService.getPendingRequests().subscribe((lista: any[]) => {
      this.pendingRequests = lista;
      this.userService.getAllPendingPredmete().subscribe((lista: any[]) => {
        this.predmeti = lista;
        this.casoviService.getAllSubjects().subscribe((imenaPredmeta: string[]) => {
          const brojNastavnikaObecanja = imenaPredmeta.map(predmet => this.casoviService.getNumberOfTeachers(predmet));
          forkJoin(brojNastavnikaObecanja).subscribe(brojNastavnika => {
            this.renderChart(imenaPredmeta, brojNastavnika, this.columnChart);
          });
          this.renderChartUzrast(this.uzrasti);
          this.renderChartNastavnik();
          this.renderChartUcenik();
          this.renderHistogram();
          this.renderLinijski();
        });
      });
    });
  }

  prikaziCV(n: nastavnici){
      this.userService.getCV(n.username).subscribe((data: ArrayBuffer)=>{
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.fileDownloaded = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    })
  }

  odobriNastavnika(n: nastavnici){
    this.userService.odobriNastavnika(n.username).subscribe(resp=>{
      this.ngOnInit();
    })
  }

  dodaj(){
    this.casoviService.dodajPredmet(this.noviPredmet).subscribe(resp=>{
      this.messageDodat = resp;
    })
  }

  odobri(p: predmeti){
    this.casoviService.odobriPredmet(p.predmet).subscribe(resp=>{
      this.messageOdobren = resp;
      this.ngOnInit();
    })
  }
  
  prikaziDijagrame(){
    this.flagObradaZahteva = false;
    this.inicijalizuj();
  }
  obradiZahteve(){
    this.flagObradaZahteva = true;
  }

  renderChart(imenaPredmeta: string[], brojNastavnika: number[], chartElement: ElementRef): void {
    const context = chartElement.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: imenaPredmeta,
        datasets: [{
          label: 'Broj nastavnika po predmetu',
          data: brojNastavnika,
          backgroundColor: '#8561a8',
          borderColor: '#64427a',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    };
    this.chart = new Chart(context, config);
  }

  renderChartUzrast(uzrasti: string[]): void {
    const context = this.columnChartUzrast.nativeElement.getContext('2d');
    const uzrastLabels = uzrasti.map(uzrast => uzrast);
    const brojNastavnikaUzrast = uzrasti.map(uzrast => this.casoviService.getNumberOfTeachersPerUzrast(uzrast)); 
    forkJoin(brojNastavnikaUzrast).subscribe(brojNastavnika => {
      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: uzrastLabels,
          datasets: [{
            label: 'Broj nastavnika po uzrastu',
            data: brojNastavnika,
            backgroundColor: '#8561a8',
            borderColor: '#64427a',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                precision: 0
              }
            }
          }
        }
      };
      this.chartUzrast = new Chart(context, config);
    });
  }

  renderChartNastavnik(){
    const context = this.nastavnikPieChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Zensko', 'Musko'],
        datasets: [{
          label: 'Raspodela nastavnika',
          data: [this.zenskoNastavnik, this.muskoNastavnik],
          backgroundColor: ['#77568b', '#dcc7f1'],
          borderColor: ['#64427a', '#64427a'],
          borderWidth: 1
        }]
      },
      options: {}
    }
    this.nastavnikChart = new Chart(context, config);
  }

  renderChartUcenik(){
    const context = this.ucenikPieChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Zensko', 'Musko'],
        datasets: [{
          label: 'Raspodela ucenika',
          data: [this.zenskoUcenik, this.muskoUcenik],
          backgroundColor: ['#77568b', '#dcc7f1'],
          borderColor: ['#64427a', '#64427a'],
          borderWidth: 1
        }]
      },
      options: {}
    }
    this.ucenikChart = new Chart(context, config);
  }

  renderHistogram(){
    const context = this.histogramChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.daysOfWeek,
        datasets: [{
          label: 'Prosecan broj casova po danima u nedelji',
          data: this.averageCasoviPerDayOfWeek,
          backgroundColor: '#8561a8',
          borderColor: '#64427a',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    }
    this.histogram = new Chart(context, config);
  }

  renderLinijski(){
    const context = this.linijskiChart.nativeElement.getContext('2d');
    const labele = this.nastavniciPerMonths.map(helper=>helper.nastavnik);
    const datasets = this.nastavniciPerMonths.map(helper=>({
      label: helper.nastavnik,
      data: helper.brojCasovaPoMesecu,
      fill: false,
      borderColor: this.getColor(),
      borderWidth: 2
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.months,
        datasets: datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    }
    this.linijski = new Chart(context, config)
  }

  getColor(){
    const rnd = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
      color += rnd[Math.floor(Math.random() * 16)]
    }
    return color;
  }
}
