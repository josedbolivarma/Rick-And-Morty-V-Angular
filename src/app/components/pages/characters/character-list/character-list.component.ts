import { Component, OnInit } from '@angular/core';
import { Character } from '@app/interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
import { take } from 'rxjs';

type RequestInfo = {
  next: string | null
}
@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  
  info: RequestInfo = {
    next: null
  }

  private pageNum:number = 1;
  private query: string = '';
  private hideScrollHeight: number = 200;
  private showScrollHeight: number = 500;

  constructor(
    private characterSvc: CharacterService
  ) { }

  ngOnInit(): void {
    this.getDataFromService();
  }

  private getDataFromService (): void {
    this.characterSvc.searchCharacters(this.query, this.pageNum)
    .pipe(
      take(1)
    ).subscribe((res: any) => {
      console.log('Response => ', res);
      const { info, results } = res;
      this.characters = [...this.characters,...results ];
      this.info = info;
    })
  }
}
