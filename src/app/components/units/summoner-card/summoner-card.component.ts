import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SummonerService } from 'src/app/services/summoner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-summoner-card',
  templateUrl: './summoner-card.component.html',
  styleUrls: ['./summoner-card.component.css']
})
export class SummonerCardComponent implements OnInit {
  sdata: any;
  srankdata: any;
  matches: any;
  comprobacion: boolean;
  soloq: boolean = false;
  flexq: boolean = false;
  notexistant: boolean = false;
  posicion: number = 0;

  user:any={};

  constructor(private route: ActivatedRoute, private _summonerService: SummonerService, private _usuariosService: UsuariosService) {
    this.comprobacion = false;
  }

  ngOnInit(): void {
    this.summonerFind()
    setTimeout(() => { this.comprobacion = true }, 2000);
    
  }

  lookForDiscord(){
    this._usuariosService.buscarUserPorSummonerName(this.sdata.name).subscribe(data=>{
      if(data){
        this.user=data;
      }
    })
  }

  partida(puuid: string) {
    this.matches = undefined;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this._summonerService.obtenerPartidasInvocador(puuid, params.get('region') || "").subscribe(data => {
        [...data].forEach((data: any) => {
          if (!data.status && !data.info.gameMode.includes('TUTORIAL')) {

            //tiempo partida
            if (!data.info.gameEndTimestamp) {
              data.info.totalMinutes = Math.trunc(((data.info.gameDuration) / 1000) / 60);
            } else {
              data.info.totalMinutes = Math.trunc(((data.info.gameEndTimestamp - data.info.gameCreation) / 1000) / 60);
            }


            this._summonerService.queueIds.forEach((itemQueue: any) => {
              if (itemQueue.queueId == data.info.queueId) {
                //tipo de partida
                data.info.gameType = itemQueue.description;
              }
            });
            //hace cuanto se acabo
            if (data.info.gameEndTimestamp) {
              data.info.howOldGameIs = (((Date.now() - data.info.gameEndTimestamp) / 1000) / 60) / 60;
            } else {
              data.info.howOldGameIs = (((Date.now() - data.info.gameCreation) / 1000) / 60) / 60;
            }
            if (data.info.howOldGameIs < 24) {
              if (data.info.howOldGameIs < 1) {
                data.info.howOldGameIs = Math.round(data.info.howOldGameIs * 60) + " minutes ago";
              } else {
                data.info.howOldGameIs = Math.round(data.info.howOldGameIs) + " hours ago";
              }
            } else {
              data.info.howOldGameIs = Math.trunc(Math.round(data.info.howOldGameIs) / 24) + " day/s ago";
            }

            //champion jugado
            let i = 0;
            data.info.participants.forEach((p: any) => {
              i++;
              if (p.summonerId == this.sdata.id)
                data.info.posicion = i - 1;

            })

            let player = data.info.participants[data.info.posicion];
            if (player)
              data.info.rutaChampion = './assets/12.7.1/img/champion/' + player.championName + '.png';

            //summoners
            let summoner1;
            let summoner2;

            this._summonerService.sspellsIds.forEach((objetoSummoner: any) => {
              if (player)
                if (player.summoner1Id == objetoSummoner.key)
                  summoner1 = objetoSummoner.id;
              if (player)
                if (player.summoner2Id == objetoSummoner.key)
                  summoner2 = objetoSummoner.id;
            })

            data.info.rutaSummoner1 = './assets/12.7.1/img/spell/Summoner' + summoner1 + '.png';
            data.info.rutaSummoner2 = './assets/12.7.1/img/spell/Summoner' + summoner2 + '.png';

            //runas

            this._summonerService.runesIds.forEach((objetoRune: any) => {
              objetoRune.slots.forEach((objetoRunas: any) => {
                objetoRunas.runes.forEach((runas: any) => {
                  if (player)
                    if (runas.id == player.perks.styles[0].selections[0].perk) {
                      data.info.primaryRune = "./assets/img/perk-images/Styles/" + objetoRune.key + "/" + runas.key + "/" + runas.key + ".png";
                    }
                  if (player)
                    if (objetoRune.id == player.perks.styles[1].style) {
                      data.info.secondaryRune = "./assets/img/" + objetoRune.icon;
                    }
                })
              })
            })

            //items
            
              data.info.item1 = './assets/12.7.1/img/item/' + player.item1 + '.png';
              data.info.item0 = './assets/12.7.1/img/item/' + player.item0 + '.png';
              data.info.item2 = './assets/12.7.1/img/item/' + player.item2 + '.png';
              data.info.item3 = './assets/12.7.1/img/item/' + player.item3 + '.png';
              data.info.item4 = './assets/12.7.1/img/item/' + player.item4 + '.png';
              data.info.item5 = './assets/12.7.1/img/item/' + player.item5 + '.png';
              data.info.item6 = './assets/12.7.1/img/item/' + player.item6 + '.png';
            
            //iconos champions partida

            data.info.participants.forEach((participante: any) => {

              participante.rutaChampion = "./assets/12.7.1/img/champion/" + participante.championName + ".png";
            })
          }
        });


        if (data.length > 0)
          this.matches = data;

      });
    });

  }

  summonerFind() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this._summonerService.obtenerInvocador(params.get('sname') || "", params.get('region') || "").subscribe(data => {
        this.partida(data.puuid);
        this.soloq = false;
        this.flexq = false;
        this.user={};
        this.sdata = undefined;
        this.srankdata = undefined;
        if (data.id != undefined) {
          this.notexistant = false;
          data.profileIconId = "./assets/12.7.1/img/profileicon/" + data.profileIconId + ".png";
          this.sdata = data;
          this.lookForDiscord();
          this._summonerService.obtenerRankInvocador(data.id, params.get('region') || "").subscribe(data => {
            if (data != []) {
              data.forEach((element: any) => {
                if (element.queueType == "RANKED_SOLO_5x5") {
                  element.queueType = "Solo Queue";
                  this.soloq = true;
                  element.tierrank = element.tier;
                  element.tier = "./assets/ranked-emblems/Emblem_" + element.tier + ".png";
                  element.winrate = Math.round((element.wins * 100) / (element.wins + element.losses));
                }
                if (element.queueType == "RANKED_FLEX_SR") {
                  element.queueType = "Flex Queue";
                  this.flexq = true;
                  element.tierrank = element.tier;
                  element.tier = "./assets/ranked-emblems/Emblem_" + element.tier + ".png";
                  element.winrate = Math.round((element.wins * 100) / (element.wins + element.losses));
                }
              })
              data.sort((a: any, b: any) => {
                if (a.queueType < b.queueType) {
                  return 1;
                } else if (a.queueType > b.queueType) {
                  return -1;
                }
                return 0;
              })
              this.srankdata = data;
            } else {
              alert('Algo ha fallado');
            }
          });
        } else {
          this.notexistant = true;
        }
      });
    });
  }
}
