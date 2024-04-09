export class ProductAPI {

    ProductsAPI = {
        "product": "prodserv/product",
        "EmployeeTask": "prodserv/employee_task",
        "LeadHistory": "prodserv/lead_fileupload_history",
        "Source": "prodserv/source",
        "leadData": "prodserv/lead_entry",
        "unassaignedCount": "prodserv/count_query?action=unassignedlead",
        "VendorAllocationHistory": "prodserv/vendor_alloc_history",
        "VendorAllocation": "prodserv/agent_vendor_mapping?action=summary",
        "productAgainstVendor": " venserv/vendor_group_summary?vendor_id=",
        "campaign": 'prodserv/campaign',
        "unassignedAllocation": 'prodserv/unassigned_allocation',
        "source": "prodserv/source"
    }
    queries = {
        "action": "?action=",
        "id": "&id=",
        "page": "page="

    }

}
