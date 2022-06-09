import { BASE_URL, httpClient } from "../config/develop-config";

export class SaleListDatasource {
    static getSaleList(pageNum:number,pageSize:number,companyId:number,status:string,search?:string): Promise<any>{
        const params = {
            page_number:pageNum,
            page_size:pageSize,
            company_id:companyId,
            status:status,
            search:search,
        }
        return httpClient
        .get(BASE_URL + '/UserStaff/GetUserStaffByCompany',{params})
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err,'err getSaleList')
        })
    }
}