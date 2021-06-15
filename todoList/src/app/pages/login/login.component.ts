import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  dataUsers:any[] = []
  checkField:boolean = false
  checkPhoneField:boolean = false
  userForm:FormGroup;
  id:number
  @ViewChild('emailInput') emailInput:ElementRef
  @ViewChild('phoneInput') phoneInput:ElementRef
  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private toastr:ToastrService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.get()
    this.initForm()
    
  }

  get():void{
    async function getData(url){
      const response = await fetch(url)
      const data = await response.json()
      return data  
      
    }
    function getFetch(){
      getData('http://localhost:3000/users')
        .then(data=>console.log(data))
        .catch(err=>console.log(err))
    }
    getFetch()
  }
  initForm():void{
    this.userForm = this.fb.group({
      name:[null,Validators.required],
      username:[null,Validators.required],
      email:[null,Validators.required],
      phone:[null,Validators.required],
      street:[null,Validators.required],
      suite:[null,Validators.required],
      city:[null,Validators.required],
      zipcode:[null,Validators.required]
    })
  }
  // pattern('\w+@\w+.\w{0,5}')
  createUser():void{
    const user:IUser = {
      name:this.userForm.value.name,
      username:this.userForm.value.username,
      email:this.userForm.value.email,
      phone:this.userForm.value.phoneNumber,
      address:{
        street:this.userForm.value.street,
        suite:this.userForm.value.suite,
        city:this.userForm.value.city,
        zipcode:this.userForm.value.zipcode
      }
      
      
    }
    
    const RegExForEmail = /\w+@\w+.\w{0,5}/
    const checkEmail = RegExForEmail.exec(this.userForm.value.email)
    const RegExForPhone = /[0-9]{4,11}/
    const checkPhone = RegExForPhone.exec(this.userForm.value.phone)
    
    if(checkEmail === null){
      this.emailInput.nativeElement.style.background = '#FDF7EB'
      this.emailInput.nativeElement.style.border = '1px solid #E39735'
      this.checkField = true
      this.warning('Please enter a valid email address')
    }
    if(checkEmail != null){
      this.emailInput.nativeElement.style.background = ''
      this.emailInput.nativeElement.style.border = ''
      this.checkField = false
    }
    if(checkPhone === null){
      this.phoneInput.nativeElement.style.background = '#FDF7EB'
      this.phoneInput.nativeElement.style.border = '1px solid #E39735'
      this.checkPhoneField = true
      this.warning('Please enter a valid phone number')
    }
    if(checkPhone != null){
      this.phoneInput.nativeElement.style.background = ''
      this.phoneInput.nativeElement.style.border = ''
      this.checkPhoneField =false
    }
    if(checkPhone != null && checkEmail != null){
      fetch('http://localhost:3000/users',{
        method:'POST',
        body:JSON.stringify(user),
        headers:{
                'Content-Type':"application/json"
              }
      })
      .then((response) => response.json())
      .then((json) =>localStorage.setItem('user',JSON.stringify(json)))
      .catch(err=>console.log(err))
      this.router.navigateByUrl('home')
      this.userForm.reset()
      this.showSuccess()
      
    }
     this.get()
   
  }
  showSuccess(){
    this.toastr.success('User created');
  }
  warning(messege){
    this.toastr.warning(messege)
  }
  
}
