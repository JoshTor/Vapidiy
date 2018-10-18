import { Component } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    parome: number;
    totaLiquide: number;

    gouttes: number;
    gouttesML: number;

    erreur: boolean = false;
    strResultat: string[] = ["", "", ""];

    constructor(public navCtrl: NavController, public toastCtrl: ToastController) {}

    public precisionRound(nb: number,precision: number){
    const factor = Math.pow(10, precision);
    return Math.round(nb * factor) / factor;
    }

    private showGouttes(){
      if(this.parome < 50 && this.parome > 1 && this.totaLiquide < 1000 && this.totaLiquide > 1 ){
        const qArome = this.parome/100*this.totaLiquide;
        const nbGouttes = qArome*30;
        const liquideRestant = this.totaLiquide - qArome;
        this.strResultat[0] = "Résultat de votre composition finale : ";
        this.strResultat[1] = "Arôme : "+this.precisionRound(qArome, 1)+" mL soit "+this.precisionRound(nbGouttes, 0)+" gouttes. ";
        this.strResultat[2] = "Liquide : "+this.precisionRound(liquideRestant, 1)+" mL";
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
