import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GithubService } from './services/github.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{  
  searchUserForm: FormGroup;
  searchOrganizationForm: FormGroup;
  user = [];
  repositories = [];
  recentSearches = [];
  organization = [];

  constructor(
    private github: GithubService
  ){
    this.searchUserForm = new FormGroup({      
      'username': new FormControl(name),
    });
    this.searchOrganizationForm = new FormGroup({      
      'orgname': new FormControl(name),
    });
  }

  ngOnInit(){
        
  }

  // Search user data and repositories
  searchUserData(){
    var username = this.searchUserForm.value.username;
    if (username != ''){
      this.user = [];
      this.repositories = [];
      if(this.recentSearches.indexOf(username) == -1){
        this.recentSearches.push(username);  
      }
      this.github.getUser(username).subscribe(data => {
        this.user = data;        
      });  
      this.github.getUserRepos(username).subscribe(data => {
        this.repositories = data;      
      });
    }    
  }

  // Search user data and repositories from recent searches and organization list
  searchAgain(name: string){           
    this.user = [];
    this.repositories = [];
    var index = this.recentSearches.indexOf(name);
    if (index != -1){
      this.recentSearches.splice(index,1);
      this.recentSearches.push(name);
    }else{
      this.recentSearches.push(name);
    }    
    this.github.getUser(name).subscribe(data => {
      this.user = data;        
    });  
    this.github.getUserRepos(name).subscribe(data => {
      this.repositories = data;
    });
  }

  // Remove user from recent searches
  removeRecent(name: string){
    var index = this.recentSearches.indexOf(name);
    this.recentSearches.splice(index,1);
  }

  // Search Organization
  searchOrganization(){
    var orgname = this.searchOrganizationForm.value.orgname;
    if (orgname != ''){            
      this.organization = [];  
      this.github.getOrganization(orgname).subscribe(data => {
        this.organization = data;      
      });
    }
  }
}
