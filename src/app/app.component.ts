import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { AppServices, ITodo } from './services/app.services';

import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  todos: ITodo[] = [];
  loading: boolean = false;
  todoTitle = '';
  error: string = '';

  errorAfterAdded: string =
    'Так как это апишка удаленная, мы не сможем его добавить';
  constructor(private service: AppServices) {}

  ngOnInit(): void {
    //для отправки запроса нужно подписаться, т.е http сделан полностью на RxJs
    this.fetchTodoos();
  }

  addTodo() {
    if (!this.todoTitle.trim()) {
      return;
    }
    const newTodo: ITodo = {
      title: this.todoTitle,
      completed: false,
    };

    this.service.addTodo(newTodo).subscribe((response) => {
      console.log('responsePost', response);
      this.todos.unshift(response);
      this.todoTitle = '';
    });
  }

  fetchTodoos() {
    this.loading = true;
    this.service
      .fetchTodos()
      .pipe(delay(1000))
      .subscribe(
        (response) => {
          this.todos = response;
          this.loading = false;
        },
        (err) => {
          console.log('ERROR:', err.message);
          this.error = err.message;
        }
      );
  }

  removeTodo(id: number) {
    this.service.removeTodo(id).subscribe(() => {
      //так как мы ничего не получаем, в коллбэк параметр можем не указывать
      this.todos = this.todos.filter((t) => t.id !== id);
    });
  }

  completedTodo(id: number) {
    this.service
      .completedTodo(id)
      .pipe(
        catchError((err) => {
          return throwError(() => new Error(this.errorAfterAdded));
        })
      )
      .subscribe((response: ITodo) => {
        this.todos.find((t) => t.id == response.id).completed = true;
      });
  }
}
