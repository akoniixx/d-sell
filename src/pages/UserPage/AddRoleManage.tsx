import { Button, Col, Row, Space } from "antd";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CardContainer } from "../../components/Card/CardContainer";

export function AddRoleManage() {
  const [name, setname] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: "",
  });

  return (
    <>
      <div className='container'>
        <CardContainer>
          <Row>
            <Col span={2}>
              <div className='space-align-block'>
                <Link to='/RoleManagementPage'>
                  <h4>
                    <ArrowLeftOutlined />
                  </h4>
                </Link>
              </div>
            </Col>
            <Col span={6}>
              <h4>
                <Space align='start'>เพิ่มชื่อตำแหน่ง</Space>
              </h4>
            </Col>
          </Row>

          <form>
            <div className='col-lg-12 col-xl-12 py-5 row'>
              <div className='col-lg'>
                <label className='text-dark-50'>ชื่อตำแหน่ง</label>
                <input className='form-control' placeholder='ระบุชื่อตำแหน่ง' />
                {name ? <span className='text-danger'>{name.massage}</span> : <span></span>}
              </div>
            </div>
            <div className='col-lg-12 col-xl-12 row'>
              <div className='col-lg'>
                <label className='text-dark-50'>คำอธิบายตำแหน่ง</label>
                <input className='form-control' placeholder='ระบุคำอธิบายตำแหน่ง' />
                {name ? <span className='text-danger'>{name.massage}</span> : <span></span>}
              </div>
            </div>

            <div className='col-lg-12 col-xl-12 py-4 row'>
              <div className='d-flex flex-row align-items-center justify-content-between'>
                <div>
                  <p style={{ fontSize: 14, color: "#BABCBE" }}>
                    โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก
                  </p>
                </div>
                <div>
                  <Button type='primary' htmlType='submit'>
                    บันทึก
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContainer>
      </div>
    </>
  );
}
