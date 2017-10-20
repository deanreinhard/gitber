import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Base64 } from 'js-base64';

@Injectable()
export class GithubService {

  // Authentication
  client = '69af424226e15a6396dd';
  secret = '683d05837403207f247939ab21668065352b65db';
  oauth = '?client_id='+ this.client +'&client_secret='+ this.secret;

  constructor(
    private http: Http
  ) { }

  getUser(username:string){
    return this.http.get('https://api.github.com/users/'+username+''+this.oauth)
    .map(res => res.json());
  }

  getUserRepos(username:string){
    // Get repository of a user
    return this.http.get('https://api.github.com/users/'+username+'/repos'+this.oauth)
    .map(res => res.json()).map(data =>{
      data.forEach(element => {
        // Get readme.md of a repository              
        this.http.get('https://api.github.com/repos/'+username+'/'+element.name+'/readme'+this.oauth).map(res => res.json()).subscribe(data => {
          element.readme = Base64.decode(data.content);          
        }, error => {
          element.readme = 'No readme found';
        });  
      });
      return data;
    });
  }

  getOrganization(orgname: string){
    // Get members from an organizaion
    return this.http.get('https://api.github.com/orgs/'+orgname+'/members'+this.oauth).map(res => res.json());
  }
}
