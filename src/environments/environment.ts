// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false, 
    apiURL: 'http://13.200.50.27:8188/',
  //  apiURL: 'http://13.200.50.27:8192/',
   //Final _Live
  // apiURL:'http://3.108.200.134:8208/',

  nacFEURL:'',
  EmemoURL: '',
  EmemoToken:'',
  redirect_TO_NAC: false,
  isSkipLocationChange:true,
  TimeoutGreen:2700,
  TimeoutYellow:900,
  TimeoutRed:300
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * Test
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
