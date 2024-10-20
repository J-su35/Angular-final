import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, interval, of, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent {

  // finite observable
  numbers$ = of([1, 2, 3, 4, 5])
  numbers:number[] = []

  httpClient = inject(HttpClient)
  users: any

  // infinite observable
  clock$ = interval(1000 * 1)
  now = new Date


  sideEffect = ''

  inputBox = new FormControl<string>('Angular')
  outputText = ''

  post: any

  constructor() {
    this.numbers$.subscribe(vs => this.numbers = vs) //#1, numbers/vs => this.numbers = vs) as a observer
    // #2, vs => this.users = vs) as a observer
    this.httpClient.get('https://jsonplaceholder.typicode.com/users').subscribe(vs => this.users = vs)
    // #3
    // infinite observable
    // v => this.now = new Date() as a observer
    this.clock$.subscribe(v => this.now = new Date())
    // #4
    this.inputBox.valueChanges.pipe(
      startWith(this.inputBox.value),
      filter((v) => v != null),
      tap((v) => this.sideEffect = v?.toUpperCase())
    ).subscribe(v => this.outputText = v)


   // # 5
    /*
    of(1)
      .pipe(
        switchMap(v => this.httpClient.get<any>(`https://jsonplaceholder.typicode.com/posts/${v}`) )
      )
      as a Observable
    */
    // (v => this.post = v) as a observer
    of(2) // as a post.id
      .pipe(
        switchMap(v => this.httpClient.get<any>(`https://jsonplaceholder.typicode.com/posts/${v}`) )
      )
      .subscribe(v => this.post = v)

  }

}