// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {
  public url: string = 'http://13.125.35.123/api';
  constructor() {
    console.log('Hello ServerProvider Provider');
  }

}
