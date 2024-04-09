export class TaskApi {

    tasksApi = {
         "api": {
            "devTypeDD": "taskserv/dev_type_dd",  
            "clientsearch": 'taskserv/trans_client_search?',
            "projectSearch": "taskserv/trans_project_search",
            "moduleSearch": "taskserv/trans_module_search/", 
            "taskStatus": "taskserv/task_status_list",
            "teamLead":"taskserv/search_team_lead?query=",
            "QuickAccessProjects":"taskserv/get_recent_project",
            "EmplevelTask":"taskserv/employeeleveltask",
            "changeTaskStatus": "taskserv/task_update/",
            "CreateIndividualTask": "taskserv/task_create",
            "EmpTaskHours": "taskserv/task_hour?date=",
            "Emp_Me_MyTeam_All": "taskserv/emp_summary_type",
            "Emp_Me_MyTeam_All_Emp_DD": "taskserv/sub_emp_dd",
            "taskHourSearch": "taskserv/task_hour_search",
            "MyTaskStatus": "taskserv/get_summary_type"
        },
        "queries":{
            "page": "page", 
            "status":'status=',
            "query":"query="
        }
    }
}
