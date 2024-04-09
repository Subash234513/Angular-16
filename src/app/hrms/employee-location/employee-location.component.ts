import { Component, OnInit } from '@angular/core';
import { AttendanceMasterServiceService } from '../attendance-master-service.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { employee } from 'src/app/fet/executivetask/executivetask.component';
import { SharedService } from 'src/app/service/shared.service';

export interface Employee{
  code:string,
  id:number,
  name:string
}
@Component({
  selector: 'app-employee-location',
  templateUrl: './employee-location.component.html',
  styleUrls: ['./employee-location.component.scss']
})

export class EmployeeLocationComponent implements OnInit {
  SummaryData: any=[];
  EmployeeArrayData: any=[];
  admin:boolean=true
  isEmployeeId: any;
  
 
  // EditForm=new FormGroup({
  //   latitude:new FormControl(''),
  //   longitude:new FormControl(''),
  //   radius:new FormControl(''),
  //   id:new FormControl('')
  // })

  Status=[
    {
    id:-1,
    name:'Pending'
  },
  {
    id:1,
    name:'Approved'
  },
  {
    id:2,
    name:'Rejected'
  },

]
  isStatusid: any;
  item:any;
  InputCheckBox: boolean;
  adminUser: boolean;
  checkUser: boolean;
  normalUser: boolean;
  BulkCheckBool:boolean;
  EmployeeArrayId: any=[];
  constructor(private service:AttendanceMasterServiceService,private notification:NotificationService,private sharedservice:SharedService) { }
  CreateData:boolean=false
  UpdateData:boolean=false
  Search:boolean=true
  summary:boolean=true
  pagination={
    has_next:false,
    has_prev:false,
    index:1
  }
  CreateForm:FormGroup;
  DataArray:FormArray;
  SearchForm=new FormGroup({
    Employee:new FormControl(''),
    status:new FormControl('')
  })
  
  ngOnInit(): void {
    // this.Summary('','','summary',this.pagination.index)
    this.EmployeeData('')

    
    let userdata = this.sharedservice.transactionList;
    console.log("USER DATE", userdata);
    const userRole = this.getUserRole(userdata);
    console.log('User Role:', userRole);
    console.log(userRole)
    this.SummaryApi()
   
    this.CreateForm=new FormGroup({
      DataArray:new FormArray([
     
      
      ])
    })
  }
  

  details(){
    const data=new FormGroup({
      EmployeeId:new FormControl(''),
      latitude:new FormControl(''),
      longitude:new FormControl(''),
      radius:new FormControl(''),
      id:new FormControl(''),
      status:new FormControl('')
    })
    return data
  }
  Add(){
    this.CreateData=true
    this.Search=false
    this.summary=false
    this.UpdateData=false
  }
  AddFormArray(){
    const control=<FormArray>this.CreateForm.get('DataArray')
    control.push(this.details())
    console.log('control',control)
  }
  delete(i,data){
    console.log('delete',data)
    if(data?.value?.id){
      this.Delete(data?.value?.id)
    }
    else{
      const control=<FormArray>this.CreateForm.get('DataArray')
      control.removeAt(i)
    }

    
  }
  BulKcheckBox(data){
    if(data.target.checked){
      this.InputCheckBox=true
      console.log('datass', this.CreateForm.get('DataArray').value)
      let Array= this.CreateForm.get('DataArray').value
      for(let i=0;i<Array.length;i++){
        if(Array[i].status.text==='Pending'){
          // console.log('true',this.EmployeeArrayId.filter(item=>item!==Array[i].id))
          
          if (this.EmployeeArrayId.includes(Array[i].id)){
            console.log('continue')
           continue
          }
          else{
            this.EmployeeArrayId.push(Array[i].id)
          }
        
        }
  
      }
      console.log('emp',this.EmployeeArrayId)
    }
    else{
      this.InputCheckBox=false
      this.EmployeeArrayId=[]
    }
  }
  checkBox(event,data){
    if(event.target.checked){
      this.EmployeeArrayId.push(data.value.id)
      console.log(this.EmployeeArrayId)
    }
    else{
      const index=this.EmployeeArrayId.indexOf(data.value.id)
      this.EmployeeArrayId.splice(index,1)
      console.log(this.EmployeeArrayId)
    }
  }
DataForm(form){
    return form.controls.DataArray.controls
  }
  get formData() { return <FormArray>this.CreateForm.get('DataArray'); }

  cancel(){
    this.CreateData=false
    this.Search=true
    this.summary=true
    this.UpdateData=false
  }
  // Edit(data){
  //   this.CreateData=false
  //   this.Search=false
  //   this.summary=false
  //   this.UpdateData=true
  //   this.service.EmpDataLocationEdit(data.id).subscribe(result=>{
  //     this.EditForm.patchValue({
  //       latitude:result.latitude,
  //       longitude:result.longitude,
  //       radius:result.radius,
  //       id:result.id
  //     })
  //   })
  // }
  Summary(Employee,status,action,page){
    this.service.EmpLocSummary(Employee,status,action,page).subscribe(data=>{
      
      this.SummaryData=data['data']
      this.pagination={
        has_prev:data?.pagination?.has_previous,
        has_next:data?.pagination?.has_next,
        index:data?.pagination?.index
      }
      const control=<FormArray>this.CreateForm.get('DataArray')
      control.clear();
      console.log('Summary',this.SummaryData)
      for(let i=0;i<this.SummaryData?.length;i++){
        for(let j=0;j<this.SummaryData[i]?.location_arr.length;j++){
          let func=new FormGroup({
            latitude:new FormControl(this.SummaryData[i]?.location_arr[j]?.latitude),
            longitude:new FormControl(this.SummaryData[i]?.location_arr[j]?.longitude),
            radius:new FormControl(this.SummaryData[i]?.location_arr[j]?.radius),
            id:new FormControl(this.SummaryData[i]?.location_arr[j]?.id),
            status:new FormControl(this.SummaryData[i]?.location_arr[j]?.status),
            EmployeeId:new FormControl(this.SummaryData[i]?.location_arr[j]?.employee)
          })
          control.push(func)
          // console.log('payload',control)

        }
      }
     
    })
  }
  clear(){
    this.SearchForm.reset()
    this.isEmployeeId=''
    this.isStatusid=''
    this.SummaryApi()
    
  }
  SummaryApi(){
    if(this.admin){
      this.Summary('','','approve_summary',this.pagination.index)
    }
    else{
      this.Summary('','','summary',this.pagination.index)
    }
  }
  EmployeeData(name){
    this.service.EmpDataLocation(name).subscribe(data=>{
      this.EmployeeArrayData=data['data']
    })
  }
  EmployeeId(data){
    this.isEmployeeId=data.id
  }
  StatusData(data){
    this.isStatusid=data.id
  }
  Submit(){
    if(!this.CreateForm.value.latitude){
      this.notification.showError('Please Enter Latitude')
    }
    else if(!this.CreateForm.value.longitude){
      this.notification.showError('Please Enter Longitude')
    }
    else if(!this.CreateForm.value.radius){
      this.notification.showError('Please Enter Radius')
    }
    else{
      this.service.EmpDataLocationCreate(this.CreateForm.value).subscribe(data=>{
        this.cancel()
        this.notification.showSuccess(data.message)
      })
    }
   
  }
  PatchData(){
    this.service.EmpLocSummaryPatch(this.pagination.index).subscribe(data=>{

    })
  }
  SubmitData(){
    let data=this.CreateForm.get('DataArray').value
    let payload=[]
    for(let i=0;i<data.length;i++){
      if(this.admin){
        if(data[i].id){
          this.item={
            'employee_id':data[i].EmployeeId.id,
            'latitude':data[i].latitude,
            'longitude':data[i].longitude,
            'radius':data[i].radius,
            'id':data[i].id
          }
        }
        else{
          this.item={
            'employee_id':data[i].EmployeeId.id,
            'latitude':data[i].latitude,
            'longitude':data[i].longitude,
            'radius':data[i].radius,
         
          }
        }
     
      }
      else{
        if(data[i].id){
          this.item={
            'latitude':data[i].latitude,
            'longitude':data[i].longitude,
            'radius':data[i].radius,  
            'id':data[i].id
          }
        }
        else{
          this.item={
            'latitude':data[i].latitude,
            'longitude':data[i].longitude,
            'radius':data[i].radius
          }
        }
       
      }
      
      payload.push(this.item)
    }
    this.service.EmpDataLocationCreate(payload).subscribe(data=>{
      this.cancel()
      if(data.description){
        this.notification.showError(data.description)
        // this.Summary('','','summary',this.pagination.index)
        // this.SummaryApi()
      }
      else if(data.message){
        this.notification.showSuccess(data.message)
      
        // this.Summary('','','summary',this.pagination.index)
        this.SummaryApi()
     
       
      }
     
    })
  }
  // Update(){
  //   if(!this.EditForm.value.latitude){
  //     this.notification.showError('Please Enter Latitude')
  //   }
  //   else if(!this.EditForm.value.longitude){
  //     this.notification.showError('Please Enter Longitude')
  //   }
  //   else if(!this.EditForm.value.radius){
  //     this.notification.showError('Please Enter Radius')
  //   }
  //   else{
  //     this.service.EmpDataLocationCreate(this.EditForm.value).subscribe(data=>{
  //       this.cancel()
  //       this.notification.showSuccess(data.message)
  //     })
  //   }
  // }
  public EmployeeDisplay(data:Employee){
    return data?data.name:undefined
  }
  SearchData(){
    if(!this.isEmployeeId && !this.isStatusid){
      // this.Summary('','','summary',this.pagination.index)
      this.SummaryApi()
    }
    else{
      if(!this.isEmployeeId){
        this.isEmployeeId=''
      }
      if(!this.isStatusid){
        this.isStatusid=''
      }
      if(this.admin){
        this.Summary(this.isEmployeeId,this.isStatusid,'fetch_approve',this.pagination.index)
      }
      else{
        this.Summary(this.isEmployeeId,this.isStatusid,'fetch',this.pagination.index)
      }
   
    }
    
  }
  ApproveData(){
    let payload=[]
    for(let i=0;i<this.EmployeeArrayId.length;i++){
      let data={
        'id':this.EmployeeArrayId[i],
        'status':1
      }
      payload.push(data)
    }
    this.service.EmpDataLocationApprovee(payload,'approve').subscribe(data=>{
      if(data.message){
        this.notification.showSuccess(data.message)
        this.EmployeeArrayId=[]
        // this.Summary('','','summary',this.pagination.index)
        this.SummaryApi()
        this.BulkCheckBool=false
        this.InputCheckBox=false
      }
      else if(data.description){
        this.notification.showError(data.description)
      }
    })
   
  }
  RejectData(){
    let payload=[]
    for(let i=0;i<this.EmployeeArrayId.length;i++){
      let data={
        'id':this.EmployeeArrayId[i],
        'status':2
      }
      payload.push(data)
    }
    this.service.EmpDataLocationApprovee(payload,'approve').subscribe(data=>{
      if(data.message){
        this.notification.showSuccess(data.message)
        this.EmployeeArrayId=[]
        // this.Summary('','','summary',this.pagination.index)
        this.SummaryApi()
        this.BulkCheckBool=false
        this.InputCheckBox=false
      }
      else if(data.description){
        this.notification.showError(data.description)
      }
   
    })

  }
Delete(id){
  this.service.EmpDataLocationDelete(id).subscribe(result=>{
    if(result.message){
      this.notification.showSuccess(result.message)
      // this.Summary('','','summary',this.pagination.index)
      this.SummaryApi()
    }
    else{
      this.notification.showError(result.description)
    }
   
  })
}
getUserRole(data) {
  let hasMaker = false;
  let hasChecker = false;
  let hasAdmin = false;

  for (const entry of data) {
    if (entry.name === 'HRMS Report') {
      for (const role of entry.role) {
        if (role.name === 'Admin') {
          hasAdmin = true;
        } else if (role.name === 'Maker') {
          hasMaker = true;
        } else if (role.name === 'Checker') {
          hasChecker = true;
        }
      }
    }
  }
  if(hasAdmin || hasChecker){
    this.admin=true
  }
  else if(hasMaker){
    this.admin=false
  }
  else{
    this.admin=false
  }
  

//   if (hasAdmin) {
//     this.adminUser = true;
//     return 'Admin';
// } else if (hasMaker && hasChecker) {
//     this.checkUser = true;
//     return 'Checker';
// } else if (hasMaker) {
//     this.normalUser = true;
//     return 'Maker';
// } else if (hasChecker) {
//     this.checkUser = true;
//     return 'Checker';
// } else {
//     this.normalUser = true;
//     return 'Maker';
// }
}
hasPrev(){
  this.pagination.index=this.pagination.index-1
  this.SummaryApi()
}
hasNext(){
  this.pagination.index=this.pagination.index+1
  this.SummaryApi()
}

}
