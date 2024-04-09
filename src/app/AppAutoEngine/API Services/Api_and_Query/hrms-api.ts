export class HrmsAPI {
    HRMS_API = {  "api": {
        "attendance": "atdserv/attendance",
        "check_in": "atdserv/check_in?mode=",
        "atd_download": "atdserv/atd_download",
        "day_log_summary": "atdserv/day_log_summary",
        "holiday": "atdserv/holiday",
        "holiday_type": "atdserv/holiday_type",
        "org_details": "atdserv/org_details",
        "org_ip": "atdserv/org_ip",
        "org_details_ip": "atdserv/org_details_ip",
        "leavetype": "atdserv/leave_type",
        "leave_summary": "atdserv/leave_summary",
        "leave_request": "atdserv/leave_request",
        "leave_approve": "atdserv/leave_approve",
        "searchemployee": "atdserv/searchemployee",
        "attendancetypestatus":"atdserv/attendance_type_summary",
        "recruitment":"hrmsserv/recruitment?action=",
        "recruit": "hrmsserv/recruitment",
        "leaveTrackReport":"atdserv/employee_leave_count?action=monthly_leave_report",
        "hrmsStatusDropdown": "hrmsserv/get_approvalstatus",
        "proposedJob": "",
        "AttendanceRequest": "atdserv/attendance_change_request",
        "perDayLog": "atdserv/per_day_log/",
        "penalty": "atdserv/penalty",
        "penalityDropDown":"atdserv/penalty_drop_down",
        "attendanceRequestApproval": "atdserv/change_request_approval",
        "SpecialPermission": "atdserv/emp_special_rights",
        "EmpbasicDetails": 'hrmsserv/employeedetails/',
        "empEducation":"hrmsserv/employeeeducationdetails/",
        "empExperience":"hrmsserv/employeeexperiences/",
        "empFamilyInfo":"hrmsserv/employeefamilyinfo/",
        "empEmergencyContact":"hrmsserv/empemergencycontact/",
        "empBank":"hrmsserv/employeebankdetails/",
        "AttendanceReport": "atdserv/fetch_attendance_report?date=",
        "attendanceFilterType":"atdserv/attendance_report_drop_down",
        "employeeattendanceReport": "atdserv/attendance_report_summary",
        "Leavereportbalance": "atdserv/month_leave_calculation",
        "PendingCountsTaskAndLeave":"atdserv/pending_count",
        "EmpReport": "atdserv/attendance?action=attendance_penalty_report",
        "EmpReportFilterSummary": "atdserv/attendance?action=atd_penalty_report",
        "EmployeeCreate": "usrserv/hremployee",
        "shift": "hrmsserv/workshift",
        "DeactivateEmployee": "usrserv/hremployee",
        "Employeeget": "usrserv/employee/", 
        "AdminViewValidation": "usrserv/hr_employee_role_validation",
        "leaveBalanceReport": "atdserv/employee_leave_count?action=leave_balance_report",
        "ondutyrequest" : "atdserv/od_request",
        "get_od_request": "atdserv/get_od_request"
        
        
    },
    "queries":{
        "page": "page",
        "status": "status",
        "fromdate": "fromdate",
        "todate":"todate",
        "mode": "mode",
        "action": "action",
        "query": "query",
        "month": "month",
        "year": "year",
        "lr_week": "lr_week" 
    }
}
}

// action=leave_report&query=&month=02&year=2023&page=1&lr_week=1


