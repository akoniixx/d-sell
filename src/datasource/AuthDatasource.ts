import { intanceAuth } from "../config/develop-config";

export class AuthDatasource {
  static login(email: any) {
    // const app_key = "15782536645_sellcoda_bo";
    return intanceAuth
      .post(`/auth/auth/login-user-staff`, {
        email: email,
      })
      .then((response) => {
        console.log("auth", response.data);
        localStorage.setItem("profile", response.data.data);
        localStorage.setItem("company", JSON.stringify(response.data.company));
        //const userProfile = JSON.parse(localStorage.getItem("profile");
        //console.log("final", userProfile);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
