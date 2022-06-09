import { intanceAuth } from "../config/develop-config"


  
export class AuthDatasource {
     static login (email: any) {
       const app_key = '15782536645_sellcoda_bo'
        return intanceAuth
          .get(`/token/GetToken?email=${email}&app_key=${app_key}`)
          .then((response) => {
            return response.data
          })
          .catch((error) => {
            console.log(error)
          })
      }
}
 

