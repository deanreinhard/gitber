import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  moduleId: module.id,
  selector: 'profile',
  templateUrl: `profile.component.html`,
  providers: [GithubService]
})
export class profileComponent  { 
    user: any;
    repos:any;
    members:any;
    username:string;
    organisation:any;
    organisationname:string;
    constructor(private _githubService: GithubService){
        console.log('ok');
    }
    searchByusername(){
       this._githubService.updateUsername(this.username);
       this._githubService.getUser()
            .subscribe(user => {
                //console.log(users);
                this.user = user;
        })
        this._githubService.getRepos().subscribe(repos => {
            this.repos = repos;
        });
    }
    searchByorganisation(){
        this._githubService.updateOrganisationname(this.organisationname);
        this._githubService.getOrganisation()
            .subscribe(organisation => {
                //console.log(users);
                this.organisation = organisation;
        })
         this._githubService.getRepos().subscribe(repos => {
            this.repos = repos;
        });
    }
 }