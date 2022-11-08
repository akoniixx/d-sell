import { Avatar, Button, Col, Modal, Radio, Row, Space, Typography, Upload } from 'antd';
import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { UserOutlined, ArrowLeftOutlined, UploadOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CardContainer } from '../../components/Card/CardContainer';
import { SaveButton } from '../../components/Button/SaveButton';

import Swal from 'sweetalert2';

const DemoBox: React.FC<{ children: React.ReactNode; value: number }> = (props) => (
  <p className={`height-${props.value}`}>{props.children}</p>
);

// const { Map } = require("immutable");

export function AddNewSale() {
  const [sale, setSale] = useState([]);
  const [action, setAction] = useState<boolean>(true);
  const [fname, setFname] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: '',
  });
  const [lname, setLname] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: '',
  });
  const [nickname, setNickname] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: '',
  });
  const [phone, setPhone] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: '',
  });
  const [email, setEmail] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: '',
  });
  const [zone, setZone] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: '',
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const validationThLetter = (text: string) => {
    return text.match(/[ก-๙ ]/g);
  };
  const validationNumber = (text: string) => {
    return text.match(/[0-9]/g);
  };
  const validationEnLetter = (text: string) => {
    return text.match(/[a-zA-Z0-9$@$!%*?&#^-_. +:;]/g);
  };
  const validationEnNumLetter = (text: string) => {
    return text.match(/[a-zA-Z0-9]/g);
  };

  return (
    <>
      <div>
        <CardContainer>
          <Row>
            <Col span={2}>
              <Link to='/SaleManagementPage'>
                <span>
                  <ArrowLeftOutlined style={{ fontSize: '30px', color: 'black' }} />
                </span>
              </Link>
            </Col>
            <Col span={20}>
              <span>
                <Space align='start' style={{ fontSize: '20px' }}>
                  เพิ่มรายชื่อพนักงาน
                </Space>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <span>
                <Space align='start' style={{ fontSize: '14px', color: '#C6C6C6' }}>
                  รายชื่อพนักงาน
                </Space>
              </span>
              <span>
                <RightOutlined
                  style={{
                    width: '10px',
                    height: '10px',
                    color: '#C6C6C6',
                    margin: '10px',
                  }}
                />
              </span>
              <span>
                <Space align='start' style={{ fontSize: '14px', color: '#0068F4' }}>
                  เพิ่มรายชื่อพนักงาน
                </Space>
              </span>
            </Col>
          </Row>
          <br />
          <Row justify='start' align='middle'>
            <Col span={4}>
              <Avatar size={150} icon={<UserOutlined />} />
            </Col>
            <Col span={4}>
              <DemoBox value={120}>
                <Upload>
                  <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                </Upload>
              </DemoBox>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={10}>
              <label className='text-dark-50'>ชื่อ*</label>
              <input className='form-control' placeholder='ระบุชื่อ' />
              {fname ? <span className='text-danger'>{fname.massage}</span> : <span></span>}
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <label className='text-dark-50'>นามสกุล*</label>
              <input className='form-control' placeholder='ระบุนามสกุล' />
              {lname ? <span className='text-danger'>{lname.massage}</span> : <span></span>}
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={10}>
              <label className='text-dark-50'>ชื่อเล่น</label>
              <input className='form-control' placeholder='ระบุนามสกุล' />
              {lname ? <span className='text-danger'>{nickname.massage}</span> : <span></span>}
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={10}>
              <label className='text-dark-50'>เบอร์โทรศัพท์*</label>
              <input className='form-control' placeholder='ระบุเบอร์โทรศัพท์' />
              {phone ? <span className='text-danger'>{phone.massage}</span> : <span></span>}
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <label className='text-dark-50'>E-mail*</label>
              <input className='form-control' placeholder='กรอก E-mail' />
              {email ? <span className='text-danger'>{email.massage}</span> : <span></span>}
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={10}>
              <label className='text-dark-50'>ตำแหน่ง*</label>
              <input className='form-control' placeholder='กรอกตำแหน่ง' />
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <label className='text-dark-50'>เขต*</label>
              <input className='form-control' placeholder='กรอกเขต' />
              {zone ? <span className='text-danger'>{zone.massage}</span> : <span></span>}
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={20}>
              <p style={{ fontSize: 14, color: '#BABCBE' }}>โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก</p>
            </Col>
            <Col span={4}>
              <Link to='/SaleManagementPage'>
                <Button>บันทึก</Button>
              </Link>
            </Col>
          </Row>

          <Modal visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
            <p style={{ color: '#464E5F', fontSize: 24 }}>ยืนยันการบันทึกข้อมูล</p>
            <p style={{ color: '#BABCBE', fontSize: 16 }}>
              โปรดยืนยันการบันทึกข้อมูลเพิ่มตำแหน่งชื่อ
            </p>
          </Modal>
        </CardContainer>
      </div>
    </>
  );
}
