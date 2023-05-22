import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, tap } from 'rxjs';
export interface ITodo {
  completed: boolean;
  title: string;
  id?: number;
}

@Injectable({ providedIn: 'root' })
export class AppServices {
  constructor(private http: HttpClient) {}

  fetchTodos(): Observable<ITodo[]> {
    let myHttpParams = new HttpParams();
    myHttpParams = myHttpParams.append('_limit', '10');
    myHttpParams = myHttpParams.append('custom', 'param');
    return this.http
      .get<ITodo[]>('https://jsonplaceholder.typicode.com/posts', {
        params: myHttpParams,
        //по умолчанию всегда идет body, но если будет response, нужно будет использовать map
        observe: 'body',
      })
      .pipe(
        // map(response => {
        // return response.body
        // }),
        catchError((error) => {
          return throwError(() => new Error(error.message));
        })
      );
  }
  addTodo(newTodo: ITodo): Observable<ITodo> {
    //ПРИ ПЕРЕДАЧЕ HEADER нужно использовать объект HttpHeaders, и передавать как ключи и значения
    const myHttpHeaders = new HttpHeaders({
      MyCustomHeaders: Math.random().toString(),
      Number: '2312313',
    });

    return this.http.post<ITodo>(
      'https://jsonplaceholder.typicode.com/todos',
      newTodo,
      {
        headers: myHttpHeaders,
      }
    );
  }
  removeTodo(id: number): Observable<any> {
    return this.http
      .delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        observe: 'events',
      })
      .pipe(
        tap((event) => {
          //внутри он перехватывает данные, но ничего не делает (tap)
          // console.log('eventeventeventevent:', event);
          if (event.type === HttpEventType.Sent) {
            console.log('SentTTTT:', event);
          }

          if (event.type === HttpEventType.Response) {
            console.log('ResponseEEEEE:', event);
          }
        })
      );
  }

  completedTodo(id: number): Observable<ITodo> {
    return this.http.put<ITodo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        completed: true,
      }
    );
  }
}
