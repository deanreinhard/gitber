import { Component, OnInit, ElementRef  } from '@angular/core';
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
    private github: GithubService,
    private elementRef:ElementRef
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

  // Load forkit.js
  ngAfterViewInit() {
    var forkitjs = document.createElement('script');
    forkitjs.type = 'text/javascript';
    forkitjs.src = '/assets/js/forkit.js';    
    this.elementRef.nativeElement.appendChild(forkitjs);

    var forkitcss = document.createElement('link');
    forkitcss.type = 'text/css';
    forkitcss.rel = 'stylesheet';
    forkitcss.href = '/assets/css/forkit.css';    
    this.elementRef.nativeElement.appendChild(forkitcss);

    var jqueryMin = document.createElement('script');
    jqueryMin.type = 'text/javascript';
    jqueryMin.src = '/assets/js/jquery.min.js';    
    this.elementRef.nativeElement.appendChild(jqueryMin);  
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
