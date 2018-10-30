import { Component } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';
import { PrecisionRound } from '../../app/pipes/pipesFunctions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  pipes: [PrecisionRound]
})
export class HomePage {

    parome: number;
    totaLiquide: number;

    gouttes: number;
    gouttesML: number;

    erreur: boolean = true;
    strResultat: string[] = ["", "", ""];

    //Variables résultats
    qArome: number;
    nbGouttes: number

    constructor(public navCtrl: NavController, public toastCtrl: ToastController) {}

    private showGouttes(){
      if(this.parome < 50 && this.parome > 1 && this.totaLiquide < 1000 && this.totaLiquide > 1 ){
        this.qArome = this.parome/100*this.totaLiquide;
        this.erreur = false;
      }
      else{
        for(let i = 0; i<2; i++){this.strResultat[i] = "";}
        let toastError = this.toastCtrl.create({
          message: "Des champs sont manquants ou incorrects",
          duration: 2000,
          position: 'top'
        });
        toastError.present();
        this.erreur = true;
      }
   }
}
