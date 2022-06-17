import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  summonerName:string="";
  datosRank:any;
  datos:any;
  region:string="euw";

  constructor (private router: Router) { }

  input:any;

  ngOnInit(): void {
    onload=()=>{
      this.input = document.getElementById("search");
    }
  }

  enterSearch(){
    if(this.input!=null)
    this.input.addEventListener("keypress", function(event:any) {
      
      if (event.key === "Enter") {
        
        event.preventDefault();
        
        var search = document.getElementById("go");
        if(search!=null)
       search.click();
      }
    });
  }

  searchSummoner(){
    
    if(this.summonerName.length>2 && this.summonerName.length<17){
      this.router.navigate(['/summoner/'+this.region+'/'+this.summonerName]);
    }else{
      alert('Summoner name length is not valid (3-16)');
    }
  
  }

}
