export class Master {
    masters = {
        "category":"mstserv/Apcategory_search?query=",
        "subcategory": "mstserv/Apsubcat_search?query=",
        "City": 'mstserv/new_city_search?query=',
        "District": 'mstserv/district_search?query=',
        "State":'mstserv/state_search?query=',
        "Pincode": 'mstserv/pincode_search?query=',
        "leave_type": 'mstserv/leave_type?action=leave_request',
        "Department": '',
        "Premise": '',
        "employee":"usrserv/searchemployee?query=",
        "holidayBasedOnStateAndYear": 'mstserv/holidaymst?state=',
        "holiday": 'mstserv/holidaymst',
        "stateSearch": 'mstserv/state?query=',
        "bank": 'mstserv/bank_info_get?name=',
        "bankbranch": 'mstserv/bank_fetch/',
        "designation": 'mstserv/designation?name=',
        
    }
    subQuerys = {
        "category": "category_id"
    }
    files = {
        "files": "docserv/doc_download/"
    }
}
