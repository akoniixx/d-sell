import React from "react";
import { useLocation } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const NoMatch = () => {
    let location = useLocation();

    return (
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center">
        <img src="/media/images/404.png" width="264px" height="164px" />
        <h3 className="card-title  mt-5 ">
          <span className="card-label font-weight-bolder text-dark">
            ขออภัย ไม่พบหน้าที่ท่านต้องการ
          </span>
          {NoMatch()}
          <br />
          <span className="text-muted mt-5 font-weight-bold font-size-sm">
            ไม่พบ URL ที่คุณเรียกโปรดตรวจสอบ URL ให้ถูกต้อง
          </span>
        </h3>
      </div>
    </div>
  );
};
export default PageNotFound;
