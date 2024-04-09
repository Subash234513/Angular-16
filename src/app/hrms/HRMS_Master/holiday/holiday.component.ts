import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss'],
  providers: [imp.HrmsAPI, imp.Master,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class HolidayComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService, 
     private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master
  ) { }

  holidaySearchForm: FormGroup;
  HolidayForm: FormGroup;

  Screens = {
    "HolidaySummary": false,
    "HolidayCreate": false
  }




  ngOnInit(): void {
    this.holidaySearchForm = this.fb.group({
      name: "",
      state: "",
    });
    this.HolidayForm = this.fb.group({
      year: "",
      state: "",
      arr: new FormArray([]),
    });

    this.holidaySearch('') 
    this.Screens['HolidaySummary'] = true
  }

  HolidayObjects = {

    presentpageholiday: 1,
    has_nextholiday: false, 
    has_previousholiday: false,
    StateList: null,
    holidayList: null, 
    pagesize: 10,
    holiday_Id: null,
    TypeOfForm: null  
  }


  holidaySearch(hint: any) {
    let search = this.holidaySearchForm.value;
    let obj = {
      year: search.name, 
      state: search.state
    };
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = "";
      }
    }
    this.SpinnerService.show();

    if (hint == "next") {
      this.getholidaydetails(obj, this.HolidayObjects.presentpageholiday + 1);
    } else if (hint == "previous") {
      this.getholidaydetails(obj, this.HolidayObjects.presentpageholiday - 1);
    } else {
      this.getholidaydetails(obj, 1);
    }
  }

  resetHoliday() {
    this.holidaySearchForm.reset(""); 
    this.holidaySearch('')
  }


  getholidaydetails(data, page) {
    console.log(data);
    this.apicall.ApiCall('get', this.masterApi.masters.holiday+'?action=leavesummary&page='+page+'&', data  )
    .subscribe((result) => {
        this.SpinnerService.hide();
        console.log("holiday", result);
        let datass = result["data"];
        this.HolidayObjects.holidayList = datass;
        let datapagination = result["pagination"];
        if (this.HolidayObjects.holidayList.length > 0) {
          this.HolidayObjects.has_nextholiday = datapagination.has_next;
          this.HolidayObjects.has_previousholiday = datapagination.has_previous;
          this.HolidayObjects.presentpageholiday = datapagination.index; 
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  public displayholiday(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  public displayState(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  getState(data) {
    this.apicall.ApiCall('get', this.masterApi.masters.stateSearch+data)
    .subscribe((results) => {
      this.HolidayObjects.StateList = results["data"]; 
    });
  }


  /////////////////////////////////////////////////////////////////////////////////////// 

  createItem() {
    let fg = this.fb.group({
      name: new FormControl(""),
      date: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    });
    return fg; 
  }

  AddholidayForm() {
    const add = this.HolidayForm.get("arr") as FormArray;
    console.log("add controls ", add);

    add.push(this.createItem());
  }

  deleteholidaydetail(index) {
    const add = this.HolidayForm.get("arr") as FormArray;
    add.removeAt(index);
  }

  ChangeDateFormat(key, index?:number){
    this.HolidayForm.get('arr')['controls'][index].get(key).setValue(this.datePipe.transform(this.HolidayForm.get('arr')['controls'][index].get(key).value, 'yyyy-MM-dd')) 
  }


  
  addHoliday(FormName, data, type) {
    this.HolidayObjects.TypeOfForm = FormName;  
    this.ScreensModules(type) 
    if (data != "") {
      this.HolidayObjects.holiday_Id = data.id;
      this.HolidayForm.patchValue({
        year: data.year,
        state: data.state,
      });
      this.HolidayForm.addControl('id', this.fb.control(data?.id)) 

      let year = data.year;
      let statedata = data.state.id;
      console.log(year, statedata);
      this.apicall.ApiCall('get', this.masterApi.masters.holidayBasedOnStateAndYear + statedata +'&year='+ year)
        .subscribe((results) => {
          let dataset = results["data"];
          for (let dataindividual of dataset) {
            let obj = this.fb.group({
              name: dataindividual?.holidayname,
              date: this.datePipe.transform(dataindividual?.date, "yyyy-MM-dd"),
              id: dataindividual?.id,
            });
            let control = this.HolidayForm.get("arr") as FormArray;
            control.push(obj);
          }
        });

 
    } else { 
      this.HolidayObjects.holiday_Id = "";
      this.HolidayForm = this.fb.group({
        year: [""],
        state: [""],
        arr: new FormArray([]),
      });
    }

 
 
  }
  onHolidayCancelClick(){
    this.ScreensModules('HolidaySummary')
  }

  onSubmitHolidayClick() {
    let data = this.HolidayForm.value;

    if (data.year == "" || data.year == undefined || data.year == null) {
      this.notify.warning("Please fill Year");
      return false;
    }
    if (data.state == "" || data.state == undefined || data.state == null) {
      this.notify.warning("Please select state");
      return false;
    }

    if (data.arr?.length == 0) {
      this.notify.warning("Please Click the Add Button");
      return false;
    }

    for (let i = 0; i < data.arr?.length; i++) {
      if (data.arr[i].name == "" || data.arr[i].name == null || data.arr[i].name == undefined) {
        this.notify.warning("Please fill Name");
        this.SpinnerService.hide();
        return false;
      }
    } 
    let obj = {
      year: data?.year,
      state: data?.state?.id,
      arr: data?.arr,
      id: data?.id
    }
    for(let data in obj){
      if(obj[data] == null || obj[data] == '' || obj[data] == undefined  ){
        delete obj[data]
      } 
    }

    this.apicall.ApiCall('post', this.masterApi.masters.holiday, obj)
    .subscribe(res =>{
      this.ScreensModules('HolidaySummary')

      this.notify.success(this.HolidayObjects.TypeOfForm == 'Edit' ? 'Successfully Edited':
                          this.HolidayObjects.TypeOfForm == 'Create' ? 'Successfully Created': 'Success')



      // if(this.HolidayObjects.TypeOfForm == 'Edit'){
      //   this.notify.success('Successfully Edited')
      // }else if(this.HolidayObjects.TypeOfForm == ){

      // }
    })


    
    
    














    // console.log(this.HolidayForm.value);

    // let arrobj = [];

    // let dataToSubmit;
    // if (this.HolidayObjects.holiday_Id != "") {
    //   let id = this.HolidayObjects.holiday_Id;
    //   let dataarrHolidays = data.arr;
    //   for (let i in dataarrHolidays) {
    //     let date = this.datePipe.transform(
    //       dataarrHolidays[i].date,
    //       "yyyy-MM-dd"
    //     );
    //     let name = dataarrHolidays[i].name;

    //     let obj = {
    //       date: date,
    //       name: name,
    //       id: dataarrHolidays[i].id,
    //     };

    //     arrobj.push(obj);

    //     console.log("arrobj", arrobj);
    //   }
    //   let objdata = {
    //     arr: arrobj,
    //     state: data?.state?.id,
    //     year: data?.year,
    //   };
    //   dataToSubmit = Object.assign({}, { id: id }, objdata);
    // } else {
    //   let dataarrHolidays = data.arr;
    //   console.log("data arr holidays", dataarrHolidays);
    //   for (let i in dataarrHolidays) {
    //     let date = this.datePipe.transform(
    //       dataarrHolidays[i].date,
    //       "yyyy-MM-dd"
    //     );
    //     let name = dataarrHolidays[i].name;

    //     let obj = {
    //       date: date,
    //       name: name,
    //     };

    //     arrobj.push(obj);
    //   }
    //   dataToSubmit = {
    //     arr: arrobj,
    //     state: data?.state?.id,
    //     year: data?.year,
    //   };
    //   console.log("create submit ", arrobj, dataToSubmit);
    // }
    // this.SpinnerService.show();
    // this.attendanceService.holidayform(dataToSubmit).subscribe(
    //   (results) => {
    //     // this.SpinnerService.hide();
    //     console.log("create", results);
    //     if (results.status == "SUCCESS") {
    //       // this.SpinnerService.hide();
    //       if (this.holiday_Id != "") {
    //         this.notify.success("Successfully Updated"); 
    //         this.holidaySearch("");
    //         this.HolidayForm = this.fb.group({
    //           name: [""],
    //           state: [""],
    //           arr: new FormArray([]),
    //         });
    //       } else {
    //         this.notify.success("Successfully Created"); 
    //         this.holidaySearch("");
    //         this.HolidayForm = this.fb.group({
    //           name: [""],
    //           state: [""],
    //           arr: new FormArray([]),
    //         });
    //       }
    //     } else {
    //       this.notify.error(results.message);
    //       this.SpinnerService.hide();
    //       return false;
    //     }
    //   },
    //   (error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   }
    // );
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ScreensModules(details) {
    console.log("details==>", details)
    let objs = this.Screens
    for (let i in objs) {
      if (!(i == details)) {
        objs[i] = false;
      } else {
        objs[i] = true;
      }
    }
  }



}


interface typelistss{
  name: string;
  code: string;
  id: number; 
}