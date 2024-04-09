import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const CMS_Url = environment.apiURL



@Injectable({
  providedIn: 'root'
})
export class CmsService {


  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  // project type search summary
  public project_type_Search_Summary(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/projecttype?query=' + data.title + '&page=' + page, { 'headers': headers })
  }

  // doc type  summary search
  public document_type_Search_Summary(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/documenttype?query=' + data.title + '&page=' + page, { 'headers': headers })
  }

  // Master create 
  public ProjectAndDocumentCreate(data: any, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(CMS_Url + 'mst?query=' + data, { 'headers': headers })
    if (type == 'Project') {
      return this.http.post<any>(CMS_Url + 'cmsserv/projecttype', data, { 'headers': headers })
    }
    if (type == 'Document') {
      return this.http.post<any>(CMS_Url + 'cmsserv/documenttype', data, { 'headers': headers })
    }
    if (type == 'Group') {
      return this.http.post<any>(CMS_Url + 'usrserv/employeegroup', data, { 'headers': headers })
    }
  }


  //// project summary search

  public project_Search_Summary(data: any, ref_type, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("project final", data)
    return this.http.get<any>(CMS_Url + 'cmsserv/project?approval_status=' + data.approvalstatus + '&is_closed=' + data.is_closed + '&code=' + data.code + '&title=' + data.title + '&projecttype=' + data.projecttype + '&ref_type=' + ref_type+ '&page=' + page, { 'headers': headers })
  }

  //// get_viewtype

  public GetApprovalStatus(ref): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/get_approvalstatus/' + ref, { 'headers': headers })
  }

  ////

  public employeesearch(data: any, page, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/employeegroup_search?name=' + data + '&page=' + page + '&type=' + type, { 'headers': headers })
  }

  public projecttypesearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/projecttype?query=' + data + '&page=' + page, { 'headers': headers })
  }

  public proposal_Search_Summary(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("project final", data)
    return this.http.get<any>(CMS_Url + 'cmsserv/proposal/' + data.id + '?name=' + data.name + '&code=' + data.code + '&proposer_code=' + data.proposer + '&approval_status=' + data.approval_status + '&page=' + page, { 'headers': headers })
  }

  public CommentsList_Summary(id, reltype, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/comments/' + id + '?ref_type=' + reltype + '&page=' + page, { 'headers': headers })
  }

  public HistoryList_Summary(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'mst?query=' + '&page=', { 'headers': headers })
  }


  public ProjectTranCreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/project', data, { 'headers': headers })
  }


  public projectcatsearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'mstserv/categoryname_search?query=' + data + '&page=' + page, { 'headers': headers })
  }
  public projectsubcatsearch(data: any, cat, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'mstserv/Apsubcategory_search?category_id=' + cat + '&query=' + data + '&page=' + page, { 'headers': headers })
  }

  public OnBeHalfsearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/employeegroup?query=' + data + '&page=' + page, { 'headers': headers })
  }

  public getproject(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/project/' + data, { 'headers': headers })
  }


  public files(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + "inwdserv/fileview/" + id, { headers, responseType: 'blob' as 'json' })
  }


  public Approval_Reject_Review(id, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/project_approval/' + id, data, { 'headers': headers })
  }

  public getTranHistory(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (type == 'project') {
      return this.http.get<any>(CMS_Url + "cmsserv/project_approval_history/" + id, { 'headers': headers })
    }
    if (type == 'identification') {
      return this.http.get<any>(CMS_Url + "cmsserv/project_approval_history/" + id + '?rel_type=' + 1, { 'headers': headers })
    }
    if (type == 'proposal') {
      return this.http.get<any>(CMS_Url + "cmsserv/proposal_approval_history/" + id, { 'headers': headers })
    }
  }


  public getViewType(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/get_viewtype', { 'headers': headers })
  }


  public postcomment(id, reltype, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/comments/' + id + '?ref_type=' + reltype, data, { 'headers': headers })
  }
  public replycomment(id, reltype, commentid, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/reply/' + id + '?ref_type=' + reltype + '&reply_id=' + commentid + '&entity_id=1&is_user=1', data, { 'headers': headers })
  }

  public getProposalView(dataID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/get_proposal/' + dataID, { 'headers': headers })
  }

  public getVersionProposal(dataID, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/proposal_version/' + dataID, { 'headers': headers })
  }


  public bulkApprovalAssign(dataID, obj): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/assign_proposal/' + dataID, obj, { 'headers': headers })
  }




  // group summary
  public group_Search_Summary(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/employeegroup?query=' + data.title + '&page=' + page, { 'headers': headers })
  }
  // employee List
  public get_EmployeeList(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
    }
    let urlvalue = CMS_Url + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  // employee Mapping
  public employee_mapping(json: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const url = CMS_Url + 'usrserv/mapping_employee_group'
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url, json, { 'headers': headers })
  }
  // get role
  public getRole(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/group_role', { 'headers': headers })
  }
  // get employee from group
  public getemployee_from_group(group_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/get_employee_from_grpid/' + group_Id, { 'headers': headers })
  }
  // identification summary
  public identificationSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("value of search", val)
    return this.http.get<any>(CMS_Url + 'cmsserv/projectidentification?page=' + pageNumber + '&title=' + val.title + '&approval_status=' + val.approval_status, { 'headers': headers })
  }
  //identification creation- type list
  public getType(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/employeegroup_search', { 'headers': headers })
  }
  //identification creation- onbehalf list
  public getOnBehalf(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/employeegroup', { 'headers': headers })
  }
  // identification creation
  public IdentificationCreate(data, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if(type == 'create'){
    return this.http.post<any>(CMS_Url + 'cmsserv/projectidentification', data, { 'headers': headers })
    // }
  }
  // identification view
  public identificationView(Identification_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/projectidentification_get/' + Identification_Id, { 'headers': headers })
  }
  // approval-reject-return - identification view
  public identification_Approval_Reject_Review(Identification_Id, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/project_identification_approval/' + Identification_Id, data, { 'headers': headers })
  }
  // delete-mapped employee
  public getdelete_MappedEmployee(employee_Id, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'usrserv/mapping_employee_group?is_remove=' + employee_Id, data, { 'headers': headers })
  }

  ////// Identification Summary 

  public project_APP_Identification_Search_Summary(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("project final", data)
    return this.http.get<any>(CMS_Url + 'cmsserv/projectidentification?&page=' + page + '&is_project=0&approval_status=5', { 'headers': headers })
  }


  public commoditysearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'mstserv/searchcommodity?query=' + data + '&page=' + page, { 'headers': headers })
  }

  public usersearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'venserv/search_contact?query=' + data + '&type=1&page=' + page, { 'headers': headers })
  }



  public getidentification(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/projectidentification_get/' + data, { 'headers': headers })
  }

  public getVersionProject(dataID, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/project_version/' + dataID, { 'headers': headers })
  }


  public shortlist_Search_Summary(data: any, id, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("project final", data)
    return this.http.get<any>(CMS_Url + 'cmsserv/proposal/' + id + '?name=&shortlist=' + data.status + '&proposer_code=&approval_status='+data.appstatus+'&page=' + page, { 'headers': headers })
  }


  public shortlistproposal(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/proposal_shortlist?is_shortlist=1', data, { 'headers': headers })
  }


  public getVendor(dataID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/vendor_get?vendor_code=' + dataID, { 'headers': headers })
  }

  public get_QA_For_Proposal(dataID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/quesans?question_type=8', { 'headers': headers })
  }

  public getevaluation(typeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + "venserv/evaluate_vendor/" + 6, { 'headers': headers })
  }


  public finalize_Search_Summary(data: any, id, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("project final", data)
    return this.http.get<any>(CMS_Url + 'cmsserv/proposal/' + id + '?name=&shortlist=' + data.status + '&proposer_code=&approval_status=&page=' + page, { 'headers': headers })
  }


  public finalizeproposal(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/proposal_shortlistfinalize', data, { 'headers': headers })
  }


  // identification creation
  public IdentificationResubmit(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/project_resubmit/' + data, {}, { 'headers': headers })
  }


  public QuestionAnsBasedOnVendor(projectid, proposalid, qtype?:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (qtype == 0){
      return this.http.get<any>(CMS_Url + 'cmsserv/cms_questionnaire/'+projectid+'?proposal_id='+proposalid, { 'headers': headers })
    }
    else{
      return this.http.get<any>(CMS_Url + 'cmsserv/cms_questionnaire/'+projectid+'?proposal_id='+proposalid+'&q_type='+qtype, { 'headers': headers })
    }
  }


  public questionaaire(id, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/project_qtype_mapping/' + id, data, { 'headers': headers })
  }



  public ProposalEvaluationComments(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/cmsquesansmap', data, { 'headers': headers })
  }

  public getEvaluationComments(id, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/cms_evaluation/'+id+'?type_id='+type, { 'headers': headers })
  }





  // Relationship category
  public getRelationShipCategory(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'mstserv/group', { 'headers': headers })
    }

    
  // vendor Type
  public getvendorType(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'mstserv/classification', { 'headers': headers })
    }

    
  // criticality
  public getCriticality(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'mstserv/type', { 'headers': headers })
    }
  
  
  
  public MoveToApprover(data, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/proposal_approval/'+id, data, { 'headers': headers })
  }
  
  

  public TotalEvaluationView(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/final_evaluation/'+id, { 'headers': headers })
  }



  public MoveToFinalApprover(id, data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/move_to_finalapprover/'+id, data, { 'headers': headers })
  }


  public NoteForFinalApprovalGroup(id, data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/project_finalcovernote/'+id, data,  { 'headers': headers })
  }
  
  public CoverNoteGet(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/project_finalcovernote/'+id, { 'headers': headers })
  }


  public getEvaluationComparision(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/new_evaluator/'+id+'?type_id='+type, { 'headers': headers })
  }

  public getVersionProjectBasedOnID(dataID, versionID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/project_viewsummary/'+dataID+'?history_id=' + versionID, { 'headers': headers })
  }

  public getVendorProjectViewDetails(datacode): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/proposal_catalog/'+ datacode, { 'headers': headers })
  }


  public Allemployeesearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'usrserv/searchemployee?query=' + data + '&page=' + page, { 'headers': headers })
  }


  public ProductSearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'mstserv/product_search?query=' + data + '&page=' + page, { 'headers': headers })
  }


  public supplierCatlogCreate(id: any, data ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/proposal_catalog/' + id, data, { 'headers': headers })
  }



  public SupplierVendor(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(CMS_Url + 'venserv/search_contact?query=' + data + '&type=1&page=' + page, { 'headers': headers }) 
    return this.http.get<any>(CMS_Url + 'venserv/branch_drpdwn?code=' + data , { 'headers': headers })
  }


  public getLegal(appstatus, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/legal_clause_insert?approval_status='+appstatus+'&type='+type, { 'headers': headers })
  }

  public clauseGet(proposalID, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/proposal_agreement/'+proposalID+'?clauses_id='+id, { 'headers': headers })
  }

  public getLegalResponse(proposalid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/legal_agreement/' + proposalid, { 'headers': headers })
  }

  public getLegalResponseCreate(proposalid, obj): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/legal_agreement/' + proposalid, obj, { 'headers': headers })
  }


  public getpdfDocument(id, clauseID): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + "cmsserv/legal_agreement_download/"+clauseID, { headers, responseType: 'blob' as 'json' })
  }

  public moveLegalDocLToVendor(clauseID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/agreement_moveto_vendor/'+clauseID,{}, { 'headers': headers })
  }

  public ApprovedProposalsAndProject(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/approved_proposal' +'?page=' + page, { 'headers': headers })
  }

  // legal clause summary
  public legal_Search_Summary(val,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(CMS_Url + 'cmsserv/legal_clause_insert?page=' + page + '&title=' + val.title + '&approval_status=' + val.approval_status, { 'headers': headers })
  }


   // legal form 
   public legalform(data: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(CMS_Url + 'cmsserv/legal_clause_insert', data, { 'headers': headers })
    
  }
     // legal delete
     public deleteLegal(legal_Id: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.delete<any>(CMS_Url + 'cmsserv/legal_clause_get/' + legal_Id, { 'headers': headers })
      
    }

    // legal particular get
    public getParticularLegal(legal_Id: any): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'cmsserv/legal_clause_get/' + legal_Id, { 'headers': headers })
      
    }

    // legal approve reject review
    public Approval_Reject_Review_legal(legalView_Id, data): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(CMS_Url + 'cmsserv/legal_clause_approve/' + legalView_Id, data, { 'headers': headers })
    } 

     //move to approve
     public move_to_approver(legalView_Id,obj): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // Object.assign
      return this.http.post<any>(CMS_Url + 'cmsserv/legal_clause_approve/' + legalView_Id, obj, { 'headers': headers })
    } 

    // legal type list
    public legaltypelist(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'cmsserv/legal_clause_typedropdown' , { 'headers': headers })
    }

    public getLegalResponseAggrement(aggrementId): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'cmsserv/agreement_superscript/' + aggrementId, { 'headers': headers })
    }

    public CommentOnSuperectipt(id,obj): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      Object.assign
      return this.http.post<any>(CMS_Url + 'cmsserv/cms_superscript_comments/' + id, obj, { 'headers': headers })
    } 

    public getLegalResponseAggrementVersionBased(aggrementId, version): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'cmsserv/agreement_superscript/' + aggrementId+'?version='+ version, { 'headers': headers })
    }


    public move_to_approver_Or_Return_Questionnaire(proposalid, data): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // Object.assign
      return this.http.post<any>(CMS_Url + 'cmsserv/questionary_group_approval/' + proposalid, data, { 'headers': headers })
    } 

    public fileDownloads(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'docserv/doc_download/' + id+'?entity_id=1&user_id=1', { 'headers': headers, responseType: 'blob' as 'json' })
  
    }

    public GetApprovalStatusCMS_Summary(ref): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token } 
      return this.http.get<any>(CMS_Url + 'cmsserv/approval_status_search', { 'headers': headers })
    }
  

    public EvaluateCallList(id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'cmsserv/project_questiontype/' + id, { 'headers': headers }) 
    }

    public GetApprovalStatusIdentificationCMS_Summary(ref): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token } 
      return this.http.get<any>(CMS_Url + 'cmsserv/get_approvalstatus/' + ref, { 'headers': headers })
      
    }

    public proposal_vendorcreate(id, code): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(CMS_Url + 'cmsserv/proposal_vendorcreate/'+id+'?vendor_code='+code, { 'headers': headers })
    }
  
}
// cmsserv/proposal_version/30 