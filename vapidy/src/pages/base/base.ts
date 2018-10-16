// 310px EST LE MINIMUM DE LARGEUR D'ECRAN

import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, NavParams, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-base',
  templateUrl: 'base.html',
})
export class BasePage {

  baseAObtenir: number;
  tauxNicotineAObtenir: number;
  strResultatObtenir: string[] = ["", "", ""];

  baseDispo: number;
  tauxBaseDispo: number;
  tauxNicotineAObtenirDispo: number;
  strResultatDispo: string[] = ["", "", ""];

  contenanceBooster: number = 10;
  tauxNicotineBooster: number = 20;

  typeDosage: string;
  erreurObtenir: boolean = false;
  erreurDispo: boolean = false;



  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private nativeStorage: NativeStorage, public alertCtrl: AlertController) {

  }

// *********** CALCUL ************
  public precisionRound(nb: number,precision: number) {
  var factor = Math.pow(10, precision);
  return Math.round(nb * factor) / factor;
  }

  public showBaseObtenir()
  {
    if(this.baseAObtenir < 1000 && this.baseAObtenir > 1 &&
      this.tauxNicotineAObtenir < 21 && this.tauxNicotineAObtenir > 1 &&
      this.contenanceBooster <= 10 && this.contenanceBooster > 1 &&
      this.tauxNicotineBooster  < 21 && this.tauxNicotineBooster > 1)
      {
        var mgDeNicotine = this.baseAObtenir * this.tauxNicotineAObtenir;
        var mgDeNicotineBooster = this.tauxNicotineBooster * this.contenanceBooster;

        var nbBoosters = mgDeNicotine / mgDeNicotineBooster;

        this.strResultatObtenir[0] = "Il vous faudra "+this.precisionRound(nbBoosters, 1)+" boosters.";
        this.strResultatObtenir[1] = "Soit "+this.precisionRound(this.contenanceBooster*nbBoosters, 1)+" mL de boosters.";
        this.strResultatObtenir[2] = "Nicotine au total : "+this.precisionRound(mgDeNicotine, 1)+"mg.";
        this.erreurObtenir = false;
      }
      else
      {
        this.strResultatObtenir[0] = "";
        this.strResultatObtenir[1] = "";
        this.strResultatObtenir[2] = "";
        this.showToastError();
        this.erreurObtenir = true;
      }
  }

  public showBaseDispo()
  {
    if(this.baseDispo < 1000 && this.baseDispo > 1 &&
       this.tauxBaseDispo < 21 && this.tauxBaseDispo > 0 &&
       this.tauxNicotineAObtenirDispo < 21 && this.tauxNicotineAObtenirDispo > 1 &&
       this.contenanceBooster <= 10 &&  this.contenanceBooster > 1 &&
       this.tauxNicotineBooster  < 21 && this.tauxNicotineBooster > 1)
      {

        /*
          FAIRE CALCUL

          DISPO : 100 ml de 6mg/ml
          JE VEUX : 3mg/ml

          Nicotine :
          1 Booster = 10*20 = 200mg
          Dispo : 100*6 = 600mg

          if tauxBaseDispo > Voulu
            ajouterBase
          elseif tauxBaseDispo < Voulu
            ajouterBooster

            this.baseDispo : Dispo
            this.tauxBaseDispo

            this.tauxNicotineAObtenirDispo
            this.contenanceBooster
        */
        // Conversion en type number
        this.baseDispo = +this.baseDispo;
        this.tauxBaseDispo = +this.tauxBaseDispo;
        this.tauxNicotineAObtenirDispo = +this.tauxNicotineAObtenirDispo;
        this.contenanceBooster = +this.contenanceBooster;
        this.tauxNicotineBooster = +this.tauxNicotineBooster;

        if(this.tauxBaseDispo > this.tauxNicotineAObtenirDispo)
        {
          //ajouterBase
          let mlBaseAjouter:number; let mgDeNicotine:number; let mlBaseTotal:number;

          let ratio:number = this.tauxNicotineAObtenirDispo/this.tauxBaseDispo;

          mlBaseAjouter = this.baseDispo*ratio;
          mlBaseTotal = this.baseDispo+mlBaseAjouter;
          mgDeNicotine = mlBaseTotal*this.tauxNicotineAObtenirDispo;

          this.strResultatDispo[0] = "Il vous faudra ajouter "+this.precisionRound(mlBaseAjouter, 1)+" ml de base nicotinée en 0mg/ml.";
          this.strResultatDispo[1] = "Base totale après ajout : "+this.precisionRound(this.baseDispo + mlBaseAjouter, 1)+"ml.";
          this.strResultatDispo[2] = "Nicotine au total : "+this.precisionRound(mgDeNicotine, 1)+"mg.";
          this.erreurDispo = false;
        }
        else //tauxBaseDispo < Voulu
        {
          //ajouterBooster
          var nbBoosters = 0; var mgDeNicotine = 0;

          /*this.strResultatDispo[0] = "Il vous faudra "+this.precisionRound(nbBoosters, 1)+" boosters.";
          this.strResultatDispo[1] = "Soit "+this.precisionRound(this.contenanceBooster*nbBoosters, 1)+" mL de boosters.";
          this.strResultatDispo[2] = "Nicotine au total : "+this.precisionRound(mgDeNicotine, 1)+"mg.";*/
        }

        this.erreurObtenir = false;
      }
      else
      {
        this.strResultatDispo[0] = "";
        this.strResultatDispo[1] = "";
        this.strResultatDispo[2] = "";
        this.showToastError();
        this.erreurDispo = true;
      }
  }





  /*
     Obtenir xL de Base en y mg/ml
     BaseAObtenir * tauxNicotine = mgDeNicotine;
     contenanceBooster * tauxNicotineBooster = mgDeNicotineBooster       *Pour 1 booster
     mgDeNicotine / mgDeNicotineBooster = nbBoosters     //Au total

     BaseAObtenir - (nbBoosters * contenanceBooster) = Quantité de base à verser
  */

  // *********** AFFICHAGE ************
  ionViewDidLoad(){
      this.showSegment();
  }

  public setSegment(): void
  {
    this.nativeStorage.setItem('segment-selected', {typeDosage: this.typeDosage})
    .then(
      () => console.log('Sauvegarde du choix..'),
      error => console.error('Error ing item', error)
    );
    this.showSegment();
  }

  public showToastError(): void
  {
    let toastError = this.toastCtrl.create({
      message: "Des champs sont manquants ou incorrects",
      duration: 2000,
      position: 'top'
    });
    toastError.present();
  }

  public showSegment(): void
  {
    this.nativeStorage.getItem('segment-selected')
    .then(
      data => {this.typeDosage = data.typeDosage},
      error => console.error(error)
    );
  }

  public showAlert(message: string)
  {
      let alert = this.alertCtrl.create({
      title: '!',
      subTitle: message,
      buttons: ['OK']
      });
      alert.present();
  }
}
