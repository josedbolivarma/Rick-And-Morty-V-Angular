import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Character } from '@app/interfaces/character.interface';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(
    private http: HttpClient
  ) { }

  searchCharacters(query= '', page= 1) {
    const filter = `${environment.baseUrlAPI}/?name=${query}&page=${page}`;
    return this.http.get<Character[]>(filter);

  }

  getDetails(id: number) {
    const filter = `${environment.baseUrlAPI}/${id}`;
    return this.http.get<Character>(filter)
  }

}
