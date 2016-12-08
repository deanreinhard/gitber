import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {profileComponent} from './components/profile.component'
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GithubService} from './services/github.service'

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent , profileComponent],
  bootstrap:    [ AppComponent ],
  providers:    [GithubService]
})
export class AppModule { }
