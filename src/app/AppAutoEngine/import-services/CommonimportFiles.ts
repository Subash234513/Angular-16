///// 
export { environment } from 'src/environments/environment';

/////Log Files 
export { LogFile } from '../consolelog/log-file'; 

/////Icons 
// export { DefaultIcons as icon } from '../Icons/default-icons';

/////Error Handling and Toaster services 
export { ErrorHandlingServiceService } from '../../service/error-handling-service.service';  
export { ToastrService } from 'ngx-toastr';
 
/////Share services 
export { SharedService } from '../../service/shared.service';

/////Spinner 
export { NgxSpinnerService } from "ngx-spinner";

////RXJS  
export { fromEvent } from 'rxjs';
export { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';

/////Date picker 
import { NativeDateAdapter } from '@angular/material/core';
export { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';

export const PICK_FORMATS = {
    parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
    display: {
      dateInput: 'input',
      monthYearLabel: { year: 'numeric', month: 'short' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' }
    }
  };
  
export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
        return formatDate(date, 'dd-MMM-yyyy', this.locale);
      } else {
        return date.toDateString();
      }
    }
  }

/////Util files 
export { UtilFiles } from 'src/app/AppAutoEngine/UtilFiles/util-files';  
export { MenuFilesHRMS } from '../UtilFiles/menu-files-hrms';
 
///// API service path 
// export { ServPaths, ApiPaths, QueryMethod, QueryPaths  } from 'src/app/AppAutoEngine/API Services/Api_and_Query/api-queries';
export { APIServicesPath } from '../API Services/Api_and_Query/api-services-path';
// export { ApicallserviceService } from '../API Services/Api_and_Query/apicallservice.service';

//// APIs 
export { HrmsAPI } from '../API Services/Api_and_Query/hrms-api';
export { ProductAPI } from '../API Services/Api_and_Query/product-api';
export { Master } from '../API Services/Api_and_Query/master'
export { Files } from '../API Services/Api_and_Query/files';
export { Vendor } from '../API Services/Api_and_Query/vendor';
export { Userserv } from '../API Services/Api_and_Query/userserv';
export { TaskApi }  from '../API Services/Api_and_Query/task'










export { AmountPipePipe} from '../Pipes/amount-pipe.pipe'