import { intanceAuth } from "../config/develop-config";

export class AuthDatasource {
  static login(email: any) {
    // const app_key = "15782536645_sellcoda_bo";
    return intanceAuth
      .post(`/auth/auth/login-user-staff`, {
        email: email,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
