import {Component, Input, OnInit} from '@angular/core';
import {ReadMe} from "../../models/readme";

@Component({
  selector: 'app-markdown',
  template: `
    <markdown *ngIf="readme" [path]="readme.download_url"></markdown>
    <markdown *ngIf="readme === null" data="No readme found"></markdown>
  `,
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements OnInit {

  @Input() readme: ReadMe;

  constructor() {
  }

  ngOnInit() {
  }

}
