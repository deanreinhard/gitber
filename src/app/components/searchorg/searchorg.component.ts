import {Component, Input, OnInit, Output} from '@angular/core';
import {GithubService} from "../../service/github.service";
import {User} from "../../models/user";
import isEmpty from "lodash/isEmpty";

@Component({
  selector: 'app-searchorg',
  templateUrl: './searchorg.component.html',
  styleUrls: ['./searchorg.component.scss']
})
export class SearchorgComponent implements OnInit {

  constructor(private gitHubAPI: GithubService) {
  }

  @Input() select;
  @Output() query = '';
  @Output() users: User[];

  onSearch() {
    if (!isEmpty(this.query)) {
      this.gitHubAPI.getOrgMembers(this.query).toPromise()
        .then(users => this.users = users).catch(error => this.users = null);
    }
  }

  ngOnInit() {
  }

}
