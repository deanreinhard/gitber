import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import each from "lodash/each";

// rxjs
import { Observable } from "rxjs/Observable";

// models
import { User } from "../models/user";
import { Repo } from "../models/repo";
import { ReadMe } from "../models/readme";

// environment
import { environment } from '../../environments/environment';

@Injectable()
export class GithubService {

  private api = environment.api;
  private clientid = environment.clientid;
  private clientsecret = environment.clientsecret;

  constructor(
    protected httpClient: HttpClient,
  ) {}

  /**
   * Compose URL to build the full URL
   * @param url - URL
   * @param {{}} params - Parameters which need to pass to as params
   * @returns {any} build URL
   */
  public composeURL(url, params = {}) {
    const oauth = 'client_id=' + this.clientid + '&client_secret=' + this.clientsecret;
    params['auth'] = oauth;
    each(params, (value, key) => {
      url = url.replace('{' + key + '}', value);
    });
    return url;
  }

  /**
   * Load User information
   * @param {string} username - Username
   * @returns {Observable<User>}
   */
  public getUser(username: string): Observable<User> {
    const url = this.composeURL(this.api.user, {username : username});
    return this.httpClient.get<User>(url);
  }

  /**
   * Load repository of the user
   * @param {string} username - Username
   * @returns {Observable<Repos[]>}
   */
  public getRepos(username: string): Observable<Repo[]> {
    const url = this.composeURL(this.api.repos, {username : username});
    return this.httpClient.get<Repo[]>(url);
  }

  /**
   * Load read me file content
   * @param {string} username - Username
   * @param {string} repo - Repository name
   * @returns {Observable<ReadMe>}
   */
  public getReadMe(username: string, repo: string): Observable<ReadMe> {
    const url = this.composeURL(this.api.readme, {username : username, repo: repo});
    return this.httpClient.get<ReadMe>(url);
  }

  /**
   * Get all members of an organisation
   * @param {string} organisation - organisation name
   * @returns {Observable<User[]>}
   */
  public getOrgMembers(organisation: string): Observable<User[]> {
    const url = this.composeURL(this.api.organisation, {organisation : organisation});
    return this.httpClient.get<User[]>(url);
  }


}
