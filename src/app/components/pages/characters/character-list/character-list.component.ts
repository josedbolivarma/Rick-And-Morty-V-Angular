import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Character } from '@app/interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
import { filter, take } from 'rxjs';
import { DOCUMENT } from '@angular/common';

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
  showGoUpButton: boolean = false;

  private pageNum:number = 1;
  private query: string = '';
  private hideScrollHeight: number = 200;
  private showScrollHeight: number = 500;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private characterSvc: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.onUrlChanged();
   }

  ngOnInit(): void {
    this.getCharactersByQuery()
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const yOffSet = window.pageYOffset;
    if((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if (this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight ) {
      this.showGoUpButton = false;
    }
  }

  onScrollDown(): void {
    if(this.info.next) {
      this.pageNum++;
      this.getDataFromService();
    }
  }

  onScrollTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
  
  private onUrlChanged() :void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe(
      () => {
        this.characters = [];
        this.pageNum = 1;
        this.getCharactersByQuery();
      }
    )
  }

  private getCharactersByQuery(): void {
    this.route.queryParams.pipe(
      take(1)
    ).subscribe(
      (params: ParamMap | any) => {
        console.log('Params => ',params);
        this.query = params['q'];
        this.getDataFromService();
      }
    )
  }

  private getDataFromService (): void {
    console.log('GETDATAFROMSERVICE');
    this.characterSvc.searchCharacters(this.query, this.pageNum)
    .pipe(
      take(1)
    ).subscribe((res: any) => {
      if(res?.results?.length) {
      const { info, results } = res;
      this.characters = [...this.characters,...results ];
      this.info = info;
      } else {
        this.characters = [];
      }
    })
  }
}
