import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/assemblers/search/search.component';
import { SummonerComponent } from './components/assemblers/summoner/summoner.component';
import { AdminComponent } from './components/units/admin/admin.component';
import { CreateUserComponent } from './components/units/create-user/create-user.component';
import { LoginComponent } from './components/units/login/login.component';
import { ModifyUserComponent } from './components/units/modify-user/modify-user.component';

const routes: Routes = [
  {path: '', component: SearchComponent},
  {path: 'summoner/:region/:sname', component: SummonerComponent},
  {path: 'account/new', component: CreateUserComponent},
  {path: 'account/login', component: LoginComponent},
  {path: 'account/modify', component: ModifyUserComponent},
  {path: 'admin', component: AdminComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }