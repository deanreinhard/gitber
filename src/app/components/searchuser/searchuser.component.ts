import {Component, Input, OnInit, Output} from '@angular/core';
import isEmpty from "lodash/isEmpty";
import remove from "lodash/remove";

@Component({
  selector: 'app-searchuser',
  templateUrl: './searchuser.component.html',
  styleUrls: ['./searchuser.component.scss']
})
export class SearchuserComponent implements OnInit {

  @Input() search;
  @Output() query = '';
  @Output() history = [];

  constructor() {
  }

  ngOnInit() {
  }

  searchUser() {
    if (!isEmpty(this.query)) {
      this.search(this.query);
      this.remove(this.query);
      this.history.splice(0, 0, this.query);
      this.query = '';
    }
  }

  remove(name) {
    remove(this.history, item => item === name);
  }

  select(name) {
    this.query = name;
    this.searchUser();
    this.query = name;
  }
}
