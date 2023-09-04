import { Divider, Form } from "antd";
import React, { useEffect } from "react";
import StepAntd from "../../../../components/StepAntd/StepAntd";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { defaultPropsForm } from "../../../../utility/DefaultProps";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../../../store/ProfileAtom";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";

import { shopDatasource } from "../../../../datasource/ShopDatasource";
import {
  CustomerDetailEntity,
  FormStepCustomerEntity,
  PayloadCustomerEntity,
} from "../../../../entities/CustomerEntity";
import { zoneDatasource } from "../../../../datasource/ZoneDatasource";
import dayjs from "dayjs";

function AddNewShopPage(): JSX.Element {
  const [current, setCurrent] = React.useState(0);
  const [brandData, setBrandData] = React.useState<
    {
      productBrandName: string;
      productBrandId: string;
      company: string;
    }[]
  >([]);
  const profile = useRecoilValue(profileAtom);
  const [searchValue] = useSearchParams();
  const navigate = useNavigate();
  const taxId = searchValue.get("taxId");
  const [form] = Form.useForm();

  const [dataDetail, setDataDetail] = React.useState<CustomerDetailEntity | null>(null);
  const [zoneList, setZoneList] = React.useState<
    {
      label: string;
      value: string;
      key: string;
    }[]
  >([]);

  useEffect(() => {
    const getShopDetailByTaxId = async () => {
      try {
        const res = await shopDatasource.getCustomerByTaxId({
          taxNo: taxId || "",
          company: profile?.company || "",
        });
        const brandData = await shopDatasource.getBrandList(profile?.company || "").then(res => {
          const map = res.map((x: any) => {
            return {
              company: x.company,
              product_brand_id: x.productBrandId,
              product_brand_logo: x.productBrandLogo,
              product_brand_name: x.productBrandName,
            };
          });
          return map;
        });
        setDataDetail(res);
        setBrandData(brandData);

        if (res && res.data) {
          const isHaveDealer = res.data.customerCompany.some((el: any) => el.customerType === "DL");
          const {
            userShop: {
              nametitle,
              firstname,
              lastname,
              nickname,
              telephone,
              secondtelephone,
              isActive,
              isPrimary,
              idCard,
              position,
              email,
            },
            userShopId,
          } =
            res?.data?.customerToUserShops?.length > 0
              ? res.data.customerToUserShops[0]
              : {
                  userShop: {
                    nametitle: "",
                    firstname: "",
                    lastname: "",
                    nickname: "",
                    telephone: "",
                    secondtelephone: "",
                    isActive: false,
                    isPrimary: false,
                    idCard: "",
                    position: "",
                    email: "",
                  },
                  userShopId: "",
                };

          const { customerName } =
            res?.data?.customerCompany?.length > 0
              ? res.data.customerCompany[0]
              : { customerName: "" };

          form.setFieldsValue({
            createDate: dayjs(),
            updateBy: res?.data.updateBy || "",
            updateDate: res?.data.updateDate || "",
            lat: res.data.lat || "",
            lag: res.data.lag || "",
            address: res.data.address || "",
            postcode: res.data.postcode || "",
            subdistrict: res.data.subdistrict || "",
            district: res.data.district || "",
            province: res.data.province || "",
            nametitle,
            firstname,
            lastname,
            nickname,
            telephone,
            secondtelephone,
            isActive,
            isPrimary,
            idCard,
            position,
            email,
            userShopId,
            customerName,
            taxId,
            typeShop: "SD",
            isActiveCustomer: true,
            isHaveDealer,
          });
        } else {
          form.setFieldsValue({
            typeShop: "SD",
            isActiveCustomer: true,
            createDate: dayjs(),
            isHaveDealer: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getShopZoneByCompany = async () => {
      try {
        const res = await zoneDatasource.getAllZoneByCompany(profile?.company || "");
        const formatPattern = res.map((el: any) => {
          return {
            label: el.zoneName,
            value: el.zoneName,
            key: el.zoneId,
          };
        });
        setZoneList(formatPattern);
      } catch (error) {
        console.log(error);
      }
    };
    getShopZoneByCompany();
    getShopDetailByTaxId();
  }, [taxId, profile?.company, form]);
  const onClickNextStep = () => {
    setCurrent(current + 1);
  };
  const onClickPrevStep = () => {
    setCurrent(current - 1);
  };
  const renderStep = () => {
    switch (current) {
      case 0: {
        return (
          <StepOne
            form={form}
            company={profile?.company}
            zoneList={zoneList}
            dataDetail={dataDetail}
          />
        );
      }
      case 1: {
        return <StepTwo form={form} onClickBack={onClickPrevStep} />;
      }
    }
  };

  const onFinish = async (values: FormStepCustomerEntity) => {
    if (current === 0) {
      onClickNextStep();
      return form.setFieldsValue({
        ...values,
      });
    } else {
      const {
        address,
        district,
        email,
        firstname,
        idCard,
        lag,
        lastname,
        lat,
        nametitle,
        nickname,
        postcode,
        province,
        secondtelephone,
        subdistrict,
        taxId,
        telephone,
        isActive,
        isPrimary,
        position,
        primaryId,
        customerName,
        isActiveCustomer,
        customerNo,
        // memberId,
        typeShop,
        userShopId,
        productBrand,
        zone,
      }: FormStepCustomerEntity = form.getFieldsValue(true);
      const newProductBrand =
        profile?.company === "ICPL" || profile?.company === "ICPI"
          ? brandData[0]
          : brandData.find((el) => {
              return el.productBrandId === productBrand;
            });
      const stringifyProductBrand = JSON.stringify([newProductBrand]);
      const payload: PayloadCustomerEntity = {
        customerId: dataDetail?.data?.customerId ? +dataDetail?.data.customerId : 0,
        address,
        district,
        lag,
        lat,
        postcode,
        province,
        subdistrict,
        taxNo: taxId,
        telephone,
        updateBy: `${profile?.firstname} ${profile?.lastname}`,

        customerCompany: [
          {
            customerName: customerName || "",
            company: profile?.company || "",
            customerId: dataDetail?.data?.customerId ? +dataDetail?.data.customerId : 0,
            isActive: isActiveCustomer,
            zone,
            customerType: typeShop,
            isNav: false,
            updateBy: `${profile?.firstname} ${profile?.lastname}`,
            salePersonCode: "",
            termPayment: "",
            creditLimit: 0,
            customerNo,
            productBrand: stringifyProductBrand,
          },
        ],
        userShop: {
          email: email ? email : "",
          firstname: firstname ? firstname : "",
          idCard: idCard ? idCard : "",
          isActive,
          isPrimary,
          lastname: lastname ? lastname : "",
          nametitle: nametitle ? nametitle : "",
          nickname,
          position,
          secondtelephone: secondtelephone ? secondtelephone : null,
          primaryId,
          telephone,
          updateBy: `${profile?.firstname} ${profile?.lastname}`,

          userShopId: userShopId ? userShopId : null,
        },
      };
      if (userShopId) {
        payload.userShop.userShopId = userShopId;
      }
      const res = await shopDatasource.postCustomer(payload);
      if (res && res.success) {
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          text: "",
          width: 250,
          timer: 2000,
          icon: "success",
          customClass: {
            title: "custom-title",
          },
          showConfirmButton: false,
        }).then(() => {
          navigate("/ShopManagementPage/ShopListPage/DetailPage/" + res.responseData.customerId);
        });
      } else {
        Swal.fire({
          title: res.userMessage || "บันทึกข้อมูลไม่สำเร็จ",
          text: "",
          width: 250,
          icon: "error",
          customClass: {
            title: "custom-title",
          },
          timer: 2000,

          showConfirmButton: false,
        });
      }
    }
  };
  return (
    <CardContainer
      style={{
        padding: "24px 0 16px",
      }}
    >
      <PageTitleNested
        onBack={() => {
          if (current === 0) {
            navigate(-1);
          } else {
            setCurrent(current - 1);
          }
        }}
        style={{
          padding: "0 24px",
        }}
        title='เพิ่มร้านค้า'
        extra={
          <div>
            <StepAntd
              current={current}
              onChange={(current) => setCurrent(current)}
              items={[
                {
                  title: "ประเภทสมาชิก",
                },
                {
                  title: "ข้อมูลบุคคล / ข้อมูลร้านค้า",
                },
              ]}
            />
          </div>
        }
      />

      <Divider />
      <Form
        {...defaultPropsForm}
        form={form}
        onFinish={onFinish}
        initialValues={{ isActive: true }}
      >
        {renderStep()}
      </Form>
    </CardContainer>
  );
}

export default AddNewShopPage;
