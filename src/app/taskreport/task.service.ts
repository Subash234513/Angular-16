import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from '@angular/compiler';


const CMS_Url = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  [x: string]: any;

  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }




   //// task maker summary 

   public task_search_summary(searchlist: any,pageno,statusarray,type_Id,order_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let jsonstatus: any = {
      "status": statusarray
    }
    let jsonValue = Object.assign({}, searchlist,jsonstatus)
    console.log("task search", jsonValue)
    return this.http.post<any>(CMS_Url + 'taskserv/task_summary?page=' + pageno + '&type=' + type_Id + '&order=' + order_Id, jsonValue, { 'headers': headers })
  }

   //// task approval summary 

   public task_Approval_Summary(serch,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("task search", searchlist)
    return this.http.get<any>(CMS_Url + 'taskserv/project_approval_list?page=' + pageno,  { 'headers': headers })
  } 
  public task_Approval_Search(module,project,client): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("task search", searchlist)
    return this.http.get<any>(CMS_Url + 'taskserv/project_approval_list?module='+module+'&project='+project+'&client='+client+'&page=1',  { 'headers': headers })
  } 

  // // task creation with file
  // public taskCreateForm(vendor: any,selected_Dev,Documentfilearray): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
    
  //   let jsonValue: any = {
  //     "employee_arr": selected_Dev
  //   }
  //   let Json = Object.assign({},vendor,jsonValue)
  //   // const body = JSON.stringify(Json)
  //   // console.log("Body", body)
  //   console.log("this.Documentfilearray", Documentfilearray)
  //   const formData: FormData = new FormData();
  //   formData.append('data', JSON.stringify(Json))
  //   for (var i = 0; i < Documentfilearray.length; i++) {
  //     let keyvalue = 'file'
  //     let pairValue = Documentfilearray[i];
  //     formData.append(keyvalue, pairValue)
  //   }
  //   return this.http.post<any>(CMS_Url + "taskserv/taskreport_create", formData, { 'headers': headers })
  // }


    // task creation without file
    public taskCreateForm(data: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      
      // let jsonValue: any = {
      //   "employee_arr": selected_Dev
      // }
      let Json = Object.assign({},data)
      // const body = JSON.stringify(Json)
      // console.log("Body", body)
      // console.log("this.Documentfilearray", Documentfilearray)
      // const formData: FormData = new FormData();
      // formData.append('data', JSON.stringify(Json))
      // for (var i = 0; i < Documentfilearray.length; i++) {
      //   let keyvalue = 'file'
      //   let pairValue = Documentfilearray[i];
      //   formData.append(keyvalue, pairValue)
      // }
      return this.http.post<any>(CMS_Url + "taskserv/create_multiple_task_tl", Json, { 'headers': headers })
    }


  // task edit
  public taskEditForm(vendor: any, tasKId:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let id = {
      "id":tasKId
    }
    let Json = Object.assign({},vendor,id)
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(Json))
    return this.http.post<any>(CMS_Url + "taskserv/taskreport_create", formData, { 'headers': headers })
  }


  // app name
  public getappNameFilter(client_Id,appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/trans_project_search/'+client_Id+'?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
  }  
  public gettlFilter(tl_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params={'id':tl_id}
    return this.http.post<any>(CMS_Url + 'taskserv/employee_task_summary' , params, { 'headers': headers })
  }  
  public gettaskname(data:any,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/tasklist?query='+data+'&page='+page, { 'headers': headers })
  }
  public getemployee(data:any,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/employee?query='+data+'&page='+page, { 'headers': headers })
  }
  public getunitheadname(data:any,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/search_unit_head?query='+data+'&page='+page, { 'headers': headers })
  }
  public getemp_based_tstatus(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/employee_status_report?page='+page, { 'headers': headers })
  }
  public downloademployeebaseddata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'taskserv/task_report_employee',data, { 'headers': headers ,responseType: 'blob' as 'json'})
  }
   public downloademployeeclientbased(data): Observable<any> {
    this.reset();
     const getToken: any = localStorage.getItem('sessionData')
     let tokenValue = JSON.parse(getToken);
     let token = tokenValue.token
     const headers = { 'Authorization': 'Token ' + token }
     return this.http.post<any>(CMS_Url + 'taskserv/employee_report',data, { 'headers': headers ,responseType: 'blob' as 'json'})
   }
  public downloaddata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'taskserv/task_report',data, { 'headers': headers ,responseType: 'blob' as 'json'})
  }
  public getprojectheadname(data:any,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/search_team_lead?query='+data+'&page='+page, { 'headers': headers })
  }
  // client
  public getcltFilter(appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/trans_client_search?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  // dev type
  public getdevtype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token } 
    return this.http.get<any>(CMS_Url + 'taskserv/dev_type_dd', { 'headers': headers })
  }
   // notification
   public getNotification(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token } 
    return this.http.get<any>(CMS_Url + 'taskserv/non_assign_emp', { 'headers': headers })
  }

    // status
    public getStatus(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token } 
      return this.http.get<any>(CMS_Url + 'taskserv/task_status_list', { 'headers': headers })
    }

    // get status for mutiple selection
    public getStatus_multipleSelection(data: any, page,): Observable<any> {
      this.reset(); 
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token } 
      return this.http.get<any>(CMS_Url + 'taskserv/task_status_list', { 'headers': headers })
    }

  // module name
  public getmodulenameFilter(client_Id,project_Id,appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/trans_module_search/' + project_Id +'?query=' + appkeyvalue + '&page=' + pageno + '&client_id=' + client_Id, { 'headers': headers })
  }

  // unit head
  public getUnitHeadFilter(appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/search_unit_head?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  // team lead
  public getTeamLeadFilter(appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/search_team_lead?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
  }


  // client master
  
  public getclientmasterFilter(appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/mst_client_search?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  
    // project master
  
    public getprojectnamemasterFilter(client_master_id,appkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/mst_project_search/' + client_master_id + '?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
    }


      // module master
  
      public getmodulenamemasterFilter(client_master_id,project_master_Id,appkeyvalue, pageno): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(CMS_Url + 'taskserv/mst_module_search/' + project_master_Id + '?query=' + appkeyvalue + '&page=' + pageno + '&client_id=' +client_master_id, { 'headers': headers })
      }


  // developer name
  public employeesearch(data: any, page, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/search_developer?query=' + data + '&page=' + page + '&type=' + type, { 'headers': headers })
  }


    //statement download
      public getTaskdownload(json:any,statusarray): Observable<any> {
        // this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        let jsonstatus: any = {
          "status": statusarray
        }
        let jsonValue = Object.assign({}, json,jsonstatus)
        console.log("stmt downlod", JSON.stringify(jsonValue))
        return this.http.post<any>(CMS_Url + 'taskserv/task_download', jsonValue,{ 'headers': headers, responseType: 'blob' as 'json' })
      }

      
      // taskview
      public gettaskview(task_Id:any): Observable<any> {
        this.reset();
        const getToken: any = localStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token } 
        return this.http.get<any>(CMS_Url + 'taskserv/task_view/' + task_Id, { 'headers': headers })
      }


      

        // status_update
        public getstatus_Update(type_Id:any): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token } 
          return this.http.get<any>(CMS_Url + 'taskserv/status_change_dd?type=' + type_Id, { 'headers': headers })
        }

        // update task
       

        public updateTaskForm(obj: any,task_Id:any): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          
          // let jsonValue: any = {
          //   "employee_arr": selected_Dev
          // }
          // let Json = Object.assign({},vendor,jsonValue)
          // const body = JSON.stringify(Json)
          // console.log("Body", body)
          // // let formData = new FormData();
          // // formData.append("data", JSON.stringify(Json))
          return this.http.post<any>(CMS_Url + "taskserv/task_view/" + task_Id, obj, { 'headers': headers })
        }



     
         // status_update
         public taskApproveClick(id:any): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token } 
          return this.http.get<any>(CMS_Url + 'taskserv/mapping_approval/' + id, { 'headers': headers })
        }



        // client form
        public clientForm(json): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token } 
          return this.http.post<any>(CMS_Url + 'taskserv/client', json,{ 'headers': headers })
        }

         // project form
         public projectForm(json): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token } 
          return this.http.post<any>(CMS_Url + 'taskserv/project', json,{ 'headers': headers })
        }

        // module form
        public moduleForm(json): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token } 
          return this.http.post<any>(CMS_Url + 'taskserv/client_module',json, { 'headers': headers })
        }

           // mapping form
           public mappingForm(json): Observable<any> {
            this.reset();
            const getToken: any = localStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token } 
            return this.http.post<any>(CMS_Url + 'taskserv/mapping',json, { 'headers': headers })
          }

          //team form
          public  addteamform(json): Observable<any> {
            this.reset();
            const getToken: any = localStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = {'Authorization': 'Token ' + token}
            return this.http.post<any>(CMS_Url + 'taskserv/team', json, {'headers': headers })
          }

          public addpipelineform(json): Observable<any> {
            this.reset();
            const getToken: any = localStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = {'Authorization': 'Token ' + token}
            return this.http.post<any>(CMS_Url + 'taskserv/pipeline', json, {'headers': headers })
          }

//teammemberadd 
public addsummaryteam(json): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = {'Authorization': 'Token ' + token}
  return this.http.post<any>(CMS_Url + 'taskserv/team_members', json, {'headers': headers})
}
          // delete task
          public deleteTask(taskId): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token;
            const headers = { 'Authorization': 'Token ' + token };
            return this.http.delete<any>(CMS_Url + 'taskserv/task_view/' + taskId, { 'headers': headers })
          } 

// file download
          public fileDownloads(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(CMS_Url + 'taskserv/taskdocdownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
        
          }  



          // task client search

          public getclientsearchFilter(appkeyvalue, pageno): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(CMS_Url + 'taskserv/mst_client_search?query=' + appkeyvalue + '&status=2&page=' + pageno, { 'headers': headers })
          }
        
          
            // task project search
          
            public getprojectsearchFilter(client_master_id,appkeyvalue, pageno): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.get<any>(CMS_Url + 'taskserv/mst_project_search/' + client_master_id + '?query=' + appkeyvalue + '&status=2&page=' + pageno, { 'headers': headers })
            }
        
        
             // task module search
          
              public getmodulesearchFilter(client_master_id,project_master_Id,appkeyvalue, pageno): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(CMS_Url + 'taskserv/mst_module_search/' + project_master_Id + '?query=' + appkeyvalue + '&status=2&page=' + pageno + '&client_id=' +client_master_id, { 'headers': headers })
              }



              // project tracker team lead APPROVE
         public TeamLead_Approve(task_Id): Observable<any> {
          this.reset();
          const getToken: any = localStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token } 
          return this.http.get<any>(CMS_Url + 'taskserv/task_approve/' + task_Id, { 'headers': headers })
        }  

                // project tracker team lead REJECT
                public TeamLead_Reject(json): Observable<any> {
                  this.reset();
                  const getToken: any = localStorage.getItem('sessionData')
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const headers = { 'Authorization': 'Token ' + token } 
                  return this.http.get<any>(CMS_Url + 'taskserv/tl_reject', { 'headers': headers })
                }




  // developer name for edit screen
  public employeesearch_edit(data: any, page ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/search_developer?query=' + data + '&page=' + page, { 'headers': headers })
  }


   // developer name for task creation screen
   public getdeveloperFilter(data: any, page ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/search_developer?query=' + data + '&page=' + page, { 'headers': headers })
  }


  // client master summary
  public clientSummary_master(pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/client?page=' + pageno, { 'headers': headers })
  }
  public clientSummary_master_search(name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/client?query='+name+'&page=1', { 'headers': headers })
  }

    // project master summary
    public projectSummary_master(pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/project?page=' + pageno, { 'headers': headers })
    }

    
    // module master summary
    public moduleSummary_master(pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/client_module?page=' + pageno, { 'headers': headers })
    }

     // mapping master summary
     public mappingSummary_master(pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/mapping_summery?page=' + pageno, { 'headers': headers })
    }
    public mappingSummary_master_search(module,client,project): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/mapping_summery?module='+module+'&client='+client+'&project='+project+'&page=1', { 'headers': headers })
    }


    //team master summary
    public teamSummary_master(pageno): Observable<any>{
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue  = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(CMS_Url + 'taskserv/team?page=' + pageno, {'headers': headers})
    }
//dropdown team list summary

public dropdownsummary_team(pageno): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };

  return this.http.get<any>(CMS_Url + 'taskserv/search_team_lead?query=&page=1'+ pageno, {'headers': headers})

}
public dropdownincharge_team(value:any,pageno): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };

  return this.http.get<any>(CMS_Url + 'taskserv/emp_common_search?page='+pageno+'&designation=higher&query='+value, {'headers': headers})

}

//pipeline master summary
public pipelineSummary_master(pageno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(CMS_Url + 'taskserv/pipeline?page=' + pageno, { 'headers': headers })
}
public pipelineSummary_master_search(name): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(CMS_Url + 'taskserv/pipeline?name='+name+'&page=1', { 'headers': headers })
}

//particular team list summary
public particularsummary_team( team_id): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = {'Authorization': 'Token ' + token};
  return this.http.get<any>(CMS_Url + 'taskserv/team_employee_summary?team_id=' + team_id, {'headers': headers})

}
// public teammembersummary_member(id): Observable<any>{
//   this.reset();
//   const getToken: any = localStorage.getItem('sessionData')
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers =  { 'Authorization': 'Token ' + token};
//   return this.http.get<any>(CMS_Url +'taskserv/team_employee_summary?team_id=' + id, {'headers': headers} )

// }





public teammembersummary_member(id): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers =  { 'Authorization': 'Token ' + token};
  return this.http.get<any>(CMS_Url +'taskserv/team_employee_summary?team_id=' + id, {'headers': headers} )

}

  public searchteamcategory(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token}
    return this.http.get<any>( CMS_Url + "taskserv/team?page=" + page + value, {'headers': headers})
  }

    
  
    // client active/inactive
    public clientActiveInactive(client_Id,status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/client_inactive/'+ client_Id + '?type=' + status, { 'headers': headers })
    }

    
    // project active/inactive
    public projectActiveInactive(project_Id,status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/project_inactive/'+ project_Id + '?type=' + status, { 'headers': headers })
    }

    
    // module active/inactive
    public moduleActiveInactive(module_Id,status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/module_inactive/'+ module_Id + '?type=' + status, { 'headers': headers })
    }

    
    // mapping active/inactive
    public mappingActiveInactive(mapping_Id,status): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/mapping_inactive/'+ mapping_Id + '?type=' + status, { 'headers': headers })
    }


    // task chart
    public taskChart(type): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/emp_hours?type=' + type, { 'headers': headers })
    }

// project based task transaction summary
    public projectbasedtask(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'taskserv/emp_task_data', { 'headers': headers })
    }

    public getLeadBasedemployee(lead, data, page): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + "usrserv/employee_entry?query="+data+"&head="+lead+"&status=3&page="+page, { 'headers': headers })
    }


    public getPerMonthActivityOfEmp(month, year, id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + "atdserv/attendance?action=employee_report&query=&month="+month+"&year="+year+"&emp_id="+id, { 'headers': headers })
    }
    public getPerMonthActivityOfEmp_new(month, year, id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + "atdserv/attendance?action=new_report&query=&month="+month+"&year="+year+"&emp_id="+id, { 'headers': headers })
    }
    
    
    public Attendanceexceldownload(month, year): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token //atdserv/attendanceexcel?month=
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'atdserv/attendanceexcel?month='+month+'&year='+year,{ headers, responseType: 'blob' as 'json' })
     }

    
     public getDepartment(appkeyvalue, pageno): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'usrserv/searchdepartment?query=' + appkeyvalue + '&page=' + pageno, { 'headers': headers })
    }
    
    public getActivitySinglelog(data, id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + "atdserv/per_day_log/"+id+"?log_date=" + data, { 'headers': headers })
    }

    public FullattendanceReport(data, page): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // if(name == null || name == undefined){ name = ''};
      // if(month == null || month == undefined){ month = ''};
      // if(year == null || year == undefined){ year = ''}
      let obj = {
        "log_date":data?.log_date,
        "filter_key":data?.filter_key,
        "lead_id":data?.lead_id,
        "org_id":data?.org_id,
        "department":data?.department,
        "employee_id":data?.emp
      }
    
       for (let i in obj) {
       console.log(i,"obj i",  obj[i])
         if (obj[i] == undefined || obj[i] == '' || obj[i] == null) {
           delete obj[i]  ;
         } 
       }
      // obj['employee_id']='';
      console.log("final data in search", obj)
      // return this.http.post<any>(attendance_Url + 'atdserv/attendance?action=report&query=&month='+data.month+'&year='+data.year+'&page='+page,dataemp, { 'headers': headers })
      return this.http.post<any>(CMS_Url + 'atdserv/attendance?action=new_report&query=&month='+data.month+'&year='+data.year+'&page='+page,obj, { 'headers': headers })
    
    }

    public getEmpBasedOrgDetails(data, pageno) {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + "usrserv/search_employeebranch?query=" + data + "&page=" + pageno, { 'headers': headers })
    }
   
    public TaskSumarryFullReport(id,page,fromdate='',todate='',client='',module='',project=''): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
        let params={'fromdate':fromdate,'todate':todate,'id':id,'client':client,'module':module,'project':project,'page':page}
      return this.http.post<any>(CMS_Url + 'taskserv/employee_task_full_summary'+'?page='+page,params, { 'headers': headers })
    
    }

    public Attendanceexceldownloadtime(month, year): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = { 'Authorization': 'Token ' + token }
      

      return this.http.get<any>(CMS_Url + 'atdserv/attendance_excel?month='+month+'&year='+year,{ headers, responseType: 'blob' as 'json' })
     }

     public TeamSumarryFullReport(id,page,fromdate='',todate='',client='',module='',project='',team_lead=''): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
        let params={'fromdate':fromdate,'todate':todate,'id':id,'client':client,'module':module,'project':project,'page':page,'team_lead':team_lead}
      return this.http.post<any>(CMS_Url + 'taskserv/employee_task_full_summary'+'?page='+page,params, { 'headers': headers })
    
    }
  
    public tlemployee(tl): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params={    "team_lead":tl }
        
      return this.http.post<any>(CMS_Url + 'taskserv/tl_employee_search'  ,params    , { 'headers': headers })
    
    }
    public tlpermision(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(CMS_Url + 'taskserv/employee_permission' ,'',{ 'headers': headers })
    
    }
    public get_memberList(empkeyvalue): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>( CMS_Url + 'taskserv/emp_common_search?page='+1+'&query=' + empkeyvalue, { 'headers': headers })
    }
    public get_project_team(teamvalue): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>( CMS_Url + 'taskserv/team_summary?page='+1+'&type=team_wise&query='+teamvalue,{ 'headers': headers })
    }
    public get_project_employee(empvalue): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>( CMS_Url + 'taskserv/emp_common_search?page='+1+'&query='+empvalue,{ 'headers': headers })
    }
    public get_project_summary(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>( CMS_Url + 'taskserv/team_employee_summary?project_id='+id,{ 'headers': headers })
    }
    public projectteamsubmit(proid,json): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>( CMS_Url + 'taskserv/project_user?project_id='+proid,json,{ 'headers': headers })
    }


  public Activitypost(tl_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params = { 'id': tl_id }
    return this.http.post<any>(CMS_Url + 'taskserv/work_activity', tl_id, { 'headers': headers })
  }
  public dropdownsummaryclient_activity(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/team_employee_summary?team_id=' + id, { 'headers': headers })

  }

  public dropdownsummarymodule_activity(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/work_activity?page=1', { 'headers': headers })

  }

  public get_dropdownclient_activity(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/trans_client_search?query=kv&status=2', { 'headers': headers })

  }

  public get_dropdownmodule_activity(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/trans_module_search/12?client_id=2&query=pro&status=2 ', { 'headers': headers })

  }
  public searchactivitycategory(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + "taskserv/work_activity?page=" + page + value, { 'headers': headers })
  }
  public activitymembersummary_member(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/work_activity' + "?page=" + empkeyvalue, { 'headers': headers })
  }
  public pipelinetempsum(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/pipeline_template_order', { 'headers': headers })
  }
  public get_pipeline(pipevalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>( CMS_Url + 'taskserv/pipeline?&query='+ pipevalue, { 'headers': headers })
  }
  public subpipetemp(json): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = {'Authorization': 'Token ' + token}
    return this.http.post<any>(CMS_Url + 'taskserv/pipeline_template', json, {'headers': headers})
  }
  public deletepipetemp(taskId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/pipeline_template?action=remove_template&template_id='+ taskId, { 'headers': headers })
  } 
  public deleteteammembers(teamid,memberid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(CMS_Url + 'taskserv/team_members?team_id='+teamid+'&emp_id='+memberid+'&action=deactivate', { 'headers': headers })
  }
  public getprojectFilter(appkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/project?query=' + appkeyvalue + '&page=' + pageno +'&action=active', { 'headers': headers })
  }  
  public get_project_search(pageno , value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>( CMS_Url + 'taskserv/project?page=' + pageno + value,{ 'headers': headers })
  }
  public getmodule_search(pageno,value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'taskserv/client_module?page=' + pageno + value, { 'headers': headers })
  }

    
}
