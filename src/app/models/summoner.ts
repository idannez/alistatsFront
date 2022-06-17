export class Summoner {
    accountId:string;
    profileIconId:number;
    revisionDate:number;
    name:string;
    id:string;
    puuid:string;
    summonerLevel:number;

    constructor(accountId:string,profileIconId:number,revisionDate:number,name:string,id:string,puuid:string,summonerLevel:number){
        this.accountId=accountId;
        this.profileIconId=profileIconId;
        this.revisionDate=revisionDate;
        this.name=name;
        this.id=id;
        this.puuid=puuid;
        this.summonerLevel=summonerLevel;
    }
}