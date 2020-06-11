import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface CreateResponse {
  name: string
}

export interface Task {
  id?: string
  title: string
  date?: string
}

@Injectable({providedIn: 'root'})
export class TasksService {
  static url = 'https://angular-organizer-47b2d.firebaseio.com/tasks';

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return []
        }
        return Object.keys(tasks).map(key => ({...tasks[key], id: key}))
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(response => {
        return { ...task, id: response.name }
      }))
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}
