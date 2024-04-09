export class Userserv {
    userserv = {
        "employeegrp":"usrserv/employeegroup_search?name=",
        "empSearch": "usrserv/searchemployee?query=",
        "getemployee": "usrserv/employee/",
        "employee": "usrserv/employee",
        "empEducation":"hrmsserv/employeeeducationdetails/",
        "empExperience":"hrmsserv/employeeexperiences/",
        "empFamilyInfo":"hrmsserv/employeefamilyinfo/",
        "empEmergencyContact":"hrmsserv/empemergencycontact/",
        "empBank":"hrmsserv/employeebankdetails/",
        "branch": "usrserv/Branch_data?data="
    }
    subQuerys = {
        
    }
    files = {
        "files": "docserv/doc_download?entity_id=1&user_id=1/"
    }
}
// 'usrserv/employeegroup_search?name=' + data + '&page=' + page + '&type=' + type,