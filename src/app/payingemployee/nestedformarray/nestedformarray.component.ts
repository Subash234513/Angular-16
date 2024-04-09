import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nestedformarray',
  templateUrl: './nestedformarray.component.html',
  styleUrls: ['./nestedformarray.component.scss']
})
export class NestedformarrayComponent implements OnInit {
  title = 'FormArray SetValue & PatchValue Example';

  teachersForm: FormGroup;




 
  constructor(private fb: FormBuilder) {
    this.teachersForm = this.fb.group({
      teachers: this.fb.array([]),
    })
  }
  ngOnInit(): void {
    this.patchValue1()
    // throw new Error('Method not implemented.');
  }
  foods= [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  hide:boolean=false
  Gross(){
    this.hide=true
  }
 
  /** Teachers */
  teachers(): FormArray {
    return this.teachersForm.get("teachers") as FormArray
  }
 
  newTeacher(): FormGroup {
    return this.fb.group({
      name: '',
      batches: this.fb.array([])
    })
  }
 
 
  addTeacher() {
    this.teachers().push(this.newTeacher());
  }
 
 
  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }
 
 
  /** batches */
 
  batches(ti): FormArray {
    return this.teachers().at(ti).get("batches") as FormArray
  }
 
 
  newBatch(): FormGroup {
    return this.fb.group({
      name: '',
      students: this.fb.array([])
    })
  }
 
  addBatch(ti: number) {
    this.batches(ti).push(this.newBatch());
  }
 
  removeBatch(ti: number, bi: number) {
    this.batches(ti).removeAt(ti);
  }
 
  /** students */
 
  students(ti, bi): FormArray {
    return this.batches(ti).at(bi).get("students") as FormArray
  }
 
  newStudent(): FormGroup {
    return this.fb.group({
      name: '',
    })
  }
 
  addStudent(ti: number, bi: number) {
    this.students(ti, bi).push(this.newStudent());
  }
 
  removeStudent(ti: number, bi: number, si: number) {
    this.students(ti, bi).removeAt(si);
  }
 
  onSubmit() {
    console.log(this.teachersForm.value);
  }


  patchValue1() {
    console.log('patchValue1')
    var data = {
      teachers: [
        {
          name: 'Teacher 1', batches: [
            { name: 'Batch No 1', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
            { name: 'Batch No 2', students: [{ name: 'Vikas' }, { name: 'Harish' }, { name: 'Lokesh' }] },
          ]
        }
      ]
    }
 
    this.teachersForm.patchValue(data);
}

 
}


