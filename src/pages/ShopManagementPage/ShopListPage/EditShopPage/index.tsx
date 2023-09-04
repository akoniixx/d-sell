import { Divider, Form } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import StepAntd from "../../../../components/StepAntd/StepAntd";
import { shopDatasource } from "../../../../datasource/ShopDatasource";
import { zoneDatasource } from "../../../../datasource/ZoneDatasource";
import {
  CustomerDetailEntity,
  FormStepCustomerEntity,
  PayloadCustomerEntity,
} from "../../../../entities/CustomerEntity";
import { profileAtom } from "../../../../store/ProfileAtom";
import { defaultPropsForm } from "../../../../utility/DefaultProps";
import StepOne from "../AddNewShopPage/StepOne";
import StepTwo from "../AddNewShopPage/StepTwo";

export default function EditShopPage() {
  const [current, setCurrent] = React.useState(0);

  const profile = useRecoilValue(profileAtom);
  const navigate = useNavigate();
  const [dataDetail, setDataDetail] = React.useState<CustomerDetailEntity | null>(null);
  const [searchValue] = useSearchParams();
  const taxId = searchValue.get("taxId");
  const [brandData, setBrandData] = React.useState<
    {
      company: string;
      product_brand_id: string;
      product_brand_logo: string;
      product_brand_name: string;
    }[]
  >([]);

  const [zoneList, setZoneList] = React.useState<
    {
      label: string;
      value: string;
      key: string;
    }[]
  >([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const getShopDetailByTaxId = async () => {
      try {
        const res = await shopDatasource.getCustomerByTaxId({
          taxNo: taxId || "",
          company: profile?.company || "",
        });
        setDataDetail(res);
        if (res && res?.data) {
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

          const findDataByCompany = (res?.data?.customerCompany || []).find(
            (el: { company: string }) => el.company === profile?.company,
          );
          const customerCompany =
            res.data.customerCompany.length > 0 ? res.data.customerCompany[0] : null;

          const findBrandCompany = (res.data.customerCompany || []).find(
            (el: { company: string }) => el.company === profile?.company,
          );
          form.setFieldsValue({
            customerNo: findDataByCompany?.customerNo || "",
            isActiveCustomer: findDataByCompany ? findDataByCompany?.isActive : true,
            typeShop: findDataByCompany?.customerType || "SD",
            zone: findDataByCompany?.zone || "",
            createDate: findDataByCompany ? dayjs(findDataByCompany?.createDate) : dayjs(),
            updateBy: res.data.updateBy,
            updateDate: res.data.updateDate,
            lat: res.data.lat || "",
            lag: res.data.lag || "",
            address: res.data.address,
            postcode: res.data.postcode,
            subdistrict: res.data.subdistrict,
            district: res.data.district,
            province: res.data.province,
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
            customerName: findDataByCompany?.customerName || customerCompany?.customerName || "",
            customerCompanyId: findDataByCompany?.customerCompanyId || 0,
            taxId,
            productBrand: `${findBrandCompany.productBrand[0].product_brand_id}`,
            isHaveDealer,
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
  const onFinish = async (values: any) => {
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
        customerName,
        isActiveCustomer,
        customerCompanyId,
        // memberId,
        typeShop,
        userShopId,
        zone,
        customerNo,
        productBrand,
      }: FormStepCustomerEntity = form.getFieldsValue(true);
      
      let newProductBrand: any = "";
      if (profile?.company === "ICPF") {
        const mapBrand = await shopDatasource.getBrandList("ICPF" || "").then((res) => {
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
        newProductBrand = mapBrand.find((x: any) => x.product_brand_id === `${productBrand}`);
      } else {
        newProductBrand = dataDetail?.data.customerCompany.find((el: any) => {
          return el.company === profile?.company;
        })?.productBrand[0];
      }
      const stringifyProductBrand = JSON.stringify([newProductBrand]);
      const findCusCom = dataDetail?.data.customerCompany.find(
        (x: any) => x.company === profile?.company,
      );
      const payload: PayloadCustomerEntity = {
        customerId: dataDetail?.data.customerId ? +dataDetail?.data.customerId : 0,
        address,
        district,
        lag,
        lat,
        postcode,
        province,
        subdistrict,
        taxNo: taxId,
        updateBy: `${profile?.firstname} ${profile?.lastname}`,
        customerCompany: [
          {
            customerName: customerName || "",
            customerCompanyId: (customerCompanyId && +customerCompanyId) || 0,
            customerNo: customerNo || "",
            customerId: dataDetail?.data.customerId ? +dataDetail?.data.customerId : 0,
            company: profile?.company || "",
            customerType: typeShop,
            zone,
            isNav: findCusCom ? findCusCom?.isNav : false,
            termPayment: findCusCom ? findCusCom?.termPayment : "",
            creditLimit: findCusCom ? findCusCom?.creditLimit : 0,
            isActive: isActiveCustomer,
            salePersonCode: findCusCom ? findCusCom.salePersonCode : "",
            updateBy: `${profile?.firstname} ${profile?.lastname}`,
            productBrand: stringifyProductBrand,
          },
        ],
        userShop: {
          firstname: firstname || "",
          lastname: lastname || "",
          nickname,
          telephone,
          isActive,
          isPrimary,
          position,
          idCard: idCard || "",
          updateBy: `${profile?.firstname} ${profile?.lastname}`,
          nametitle: nametitle || "",
          secondtelephone,
          email: email || "",
          userShopId: userShopId ? userShopId : null,
        },
      };

      try {
        const res = await shopDatasource.updateCustomer(payload);
        if (res && res.success) {
          Swal.fire({
            title: "บันทึกข้อมูลสำเร็จ",
            text: "",
            width: 250,
            icon: "success",
            customClass: {
              title: "custom-title",
            },
            timer: 2000,
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
      } catch (e) {
        console.log(e);
      }
    }
  };

  const renderStep = () => {
    switch (current) {
      case 0: {
        return (
          <>
            <StepOne
              form={form}
              company={profile?.company}
              dataDetail={dataDetail}
              zoneList={zoneList}
            />
          </>
        );
      }
      case 1: {
        return <StepTwo form={form} onClickBack={onClickPrevStep} />;
      }
    }
  };

  return (
    <CardContainer>
      <PageTitleNested
        title='แก้ไขข้อมูลร้านค้า'
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
      <Form {...defaultPropsForm} form={form} onFinish={onFinish}>
        {renderStep()}
      </Form>
    </CardContainer>
  );
}
