import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingServiceService {
  public errorMessage: string = '';
 
  constructor(private router: Router,private toastService: ToastrService,  private SpinnerService: NgxSpinnerService,) { }
 
  // public handleError = (error: HttpErrorResponse) => {
  //   if(error.status === 500){
  //     this.handle500Error(error);
  //   }
  //   else if(error.status === 404){
  //     this.handle404Error(error)
  //   }
  //   else{
  //     console.log("log")
  //   }
  // }
 
  // private handle500Error = (error: HttpErrorResponse) => {
  //   // this.createErrorMessage(error);
  //   // this.router.navigate(['/500']);
  //   this.toastService.warning("INTERNAL SERVER ERROR")
  // }
 
  // private handle404Error = (error: HttpErrorResponse) => {
  //   // this.createErrorMessage(error);
  //   // this.router.navigate(['/404']);
  //   this.toastService.warning("PAGE NOT FOUND")
  // }


  public handleError = (error: HttpErrorResponse) => {
    if(error.status === 400){
      this.handle400Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 401){
      this.handle401Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 403){
      this.handle403Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 404){
      this.handle404Error(error);
      this.SpinnerService.hide();
    }
    else if(error.status === 405){
      this.handle405Error(error);
      this.SpinnerService.hide();
    }
    else if(error.status === 408){
      this.handle408Error(error)
      this.SpinnerService.hide();
    }
    // else if(error.status === 411){
    //   this.handle411Error(error)
    // this.SpinnerService.hide();
    // }
    else if(error.status === 413){
      this.handle413Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 415){
      this.handle415Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 429){
      this.handle429Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 500){
      this.handle500Error(error);
      this.SpinnerService.hide();
    }
    else if(error.status === 502){
      this.handle502Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 504){
      this.handle504Error(error)
      this.SpinnerService.hide();
    }
    else if(error.status === 0){
      this.handle0Error(error)
      this.SpinnerService.hide();
    }
    else{
      console.log("log")
      this.SpinnerService.hide();
    }
  }


  // 400 - BAD REQUEST - Many times the 400 error is temporary  
  private handle400Error = (error: HttpErrorResponse) => {
    this.toastService.warning("400- Please refresh the page")
  }

  //401 - Unauthorized response status code

  private handle401Error = (error: HttpErrorResponse) => {
    this.toastService.warning("401 - Permission Denied")
  }

   //403 - Forbidden response status code

   private handle403Error = (error: HttpErrorResponse) => {
    this.toastService.warning("403 - Permission Denied")
  }

  private handle404Error = (error: HttpErrorResponse) => {
    this.toastService.warning("404 - PAGE NOT FOUND")
  }

  private handle405Error = (error: HttpErrorResponse) => {
    this.toastService.warning("405 - API Failed, Method not allowed")
  }

  private handle408Error = (error: HttpErrorResponse) => {
    this.toastService.warning("408 - Request Timeout, Request taking too much time")
  }

  private handle411Error = (error: HttpErrorResponse) => {
    this.toastService.warning("411 - Content-Length header field is not, API failed")
  }

  private handle413Error = (error: HttpErrorResponse) => {
    this.toastService.warning("413 - 413 Payload Too Large Request entity is larger than limits defined by server. The server might close the connection(The request is larger than the server able to handle)")
  }

  private handle415Error = (error: HttpErrorResponse) => {
    this.toastService.warning("415 - Unsupported media type")
  }

  private handle429Error = (error: HttpErrorResponse) => {
    this.toastService.warning("429 - Too Many Requests, Server Busy")
  }

  private handle500Error = (error: HttpErrorResponse) => {
    this.toastService.warning("500 - INTERNAL SERVER ERROR (Unsuccessful request)")
  }

  private handle502Error = (error: HttpErrorResponse) => {
    this.toastService.warning("502 - Got an invalid response")
  }
  
  private handle504Error = (error: HttpErrorResponse) => {
    this.toastService.warning("504 - Server Timeout")
  }

  private handle0Error = (error: HttpErrorResponse) => {
    this.toastService.warning("0 - Unable to connect server")
  }
}

