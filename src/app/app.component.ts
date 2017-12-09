import {Component, OnInit, ViewChild} from '@angular/core';

import {GithubService} from './service/github.service';
import {User} from "./models/user";
import {Repo} from "./models/repo";
import {SearchuserComponent} from "./components/searchuser/searchuser.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(SearchuserComponent) searchUserComponent: SearchuserComponent;

  public user: User = null;
  public repos: Repo[] = [];

  constructor(private gitHubAPI: GithubService) {
  }

  ngOnInit() {

  }

  /**
   * user select form organization should update the search history of the git user search
   * @param name
   */
  onUserSelect = (name) => {
    this.searchUserComponent.select(name);
  }

  /**
   * search user information and repository information
   * @param username - github username
   */
  searchUser = (username) => {
    if (username) {
      this.gitHubAPI.getUser(username).toPromise()
        .then(user => this.user = user).catch(error => this.user = null);
      this.gitHubAPI.getRepos(username).toPromise()
        .then(repos => this.repos = repos).catch(error => this.repos = []);
    }
  }
}
