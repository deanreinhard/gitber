import {Component, Input, OnInit, Output} from '@angular/core';
import {GithubService} from "../../service/github.service";
import {Repo} from "../../models/repo";
import {ReadMe} from "../../models/readme";

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.scss']
})
export class RepoComponent implements OnInit {

  @Input() repo: Repo;
  @Output() readme: ReadMe;

  constructor(private gitHubAPI: GithubService) {
  }


  /**
   * On load try to load readme file information
   */
  ngOnInit() {
    this.gitHubAPI.getReadMe(this.repo.owner.login, this.repo.name).toPromise()
      .then(readme => this.readme = readme).catch(error => this.readme = null);
  }

}
