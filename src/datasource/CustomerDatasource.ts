import { BASE_URL, httpClient } from "../config/develop-config";

export class CustomerDatasource {
    static getCustomer(companyId:number): Promise<any>{
        const params = {
            comp_id:companyId,
        }
        return httpClient
        .get(BASE_URL + '/customer',{params})
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err,'err getCustomer')
        })
    }
}