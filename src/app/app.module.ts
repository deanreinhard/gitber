import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'angular2-markdown';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchuserComponent } from './components/searchuser/searchuser.component';

import { GithubService } from './service/github.service';

import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatToolbarModule,
} from '@angular/material';
import { UserinfoComponent } from './components/userinfo/userinfo.component';
import { ReposComponent } from './components/repos/repos.component';
import { MarkdownComponent } from './components/markdown/markdown.component';
import { RepoComponent } from './components/repo/repo.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchorgComponent } from './components/searchorg/searchorg.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchuserComponent,
    UserinfoComponent,
    ReposComponent,
    MarkdownComponent,
    RepoComponent,
    FooterComponent,
    SearchorgComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    GithubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
