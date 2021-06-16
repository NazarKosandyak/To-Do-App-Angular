import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ITodo } from 'src/app/interfaces/todo.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  checkClose: boolean = false
  checkEdit: boolean = false
  checkDelete: boolean = false
  dataTextarea: string
  getUser: any;
  editItem: any;
  taskId: number
  newTask: string;
  dataTask: any[] = []
  infoDelete: string;
  currentTask;
  update: Subject<string> = new Subject()
  @ViewChild('title') title: ElementRef
  @ViewChild('checkBox') checkBox: ElementRef
  @ViewChild('labelCheck') labelCheck: ElementRef
  @ViewChild('main') main:ElementRef
  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTask()
    this.getUser = JSON.parse(localStorage.getItem('user'))
    this.updateTask()
  }
  getTask(): void {
    fetch('http://localhost:3000/todos')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.dataTask = data
        this.dataTask.reverse()
      })

  }
  openAdd(): void {
    this.checkClose = true
  }
  add(): void {
    if (this.dataTextarea) {
      const task: ITodo = {
        userId: this.getUser.id,
        title: this.dataTextarea,
        completed: false,
      }
      fetch('http://localhost:3000/todos', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': "application/json"
        }
      })
      this.dataTextarea = ''
      this.showSuccess()
      this.dataTask.push(task)
      this.checkClose = false
      this.update.next('item')
      this.getTask()
    }
    else {
      this.warning('Please enter a task')
    }
  }
  close(): void {
    this.checkClose = false
  }
  checkMyBox(item): void {
    item.completed = !item.completed
  }
  editTask(item): void {
    console.log(item);
    this.checkEdit = true
    this.newTask = item.title
    this.editItem = item
    this.taskId = item.id
  }
  closeEdit(): void {
    this.checkEdit = false
    this.dataTextarea = ''
  }
  saveEdit(): void {
    if (this.newTask) {
      fetch(`http://localhost:3000/todos/${this.taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          userId: this.editItem.userId,
          title: this.newTask,
          completed: this.editItem.completed,
          id: this.editItem.id
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(json => console.log(json))
      this.getTask()
      this.update.next('item')
      this.checkEdit = false
    }
  }

  showDelete(item): void {
    this.checkDelete = true
    this.infoDelete = item.title
    this.currentTask = item
    document.body.style.background = 'rgba(0, 0, 0, 0.05)'
    this.main.nativeElement.style.background = 'rgb(255 255 255 / 5%)'

  }
  deleteTask(): void {
    fetch(`http://localhost:3000/todos/${this.currentTask.id}`, {
      method: 'DELETE',
    });
    this.getTask()
    this.update.next('item')
    this.checkDelete = false
    console.log(this.currentTask);
    document.body.style.background = 'white'
    this.main.nativeElement.style.background = 'white'
    
    
  }
  closeDelete(): void {
    this.checkDelete = false
    document.body.style.background = 'white'
    this.main.nativeElement.style.background = 'white'
  }
  updateTask(): void {
    this.update.subscribe(() => {
      this.getTask()
    })
  }
  showSuccess() {
    this.toastr.success('Task created');
  }
  warning(messege) {
    this.toastr.warning(messege)
  }
}
