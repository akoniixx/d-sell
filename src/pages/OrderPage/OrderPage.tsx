import React, { useEffect, useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space } from "antd";
import Layouts from "../../components/Layout/Layout";

export function OrderPage() {
  const token = localStorage.getItem("token");
  const mystyle = {
    color: "black",
    backgroundColor: "white",
    padding: "10px",
    fontFamily: "Arial",
  };

  return (
    <>
      <div className='container' style={mystyle}>
        <div className='col-xl-12'>
          <h2>Dash Board</h2>
          <div className='text-muted'>รายการสั่งซื้อประจำวัน </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-9'>
            <form className='row'>
              <div className='col-4'>
                <div className='input-group'>
                  <input type='text' className='form-control' placeholder='Search for...' />
                </div>
              </div>
              <div className='col-6'>
                <div className='input-daterange input-group'>
                  <input
                    type='date'
                    className='form-control'
                    name='start'
                    placeholder='Order Date'
                  />
                  <div className='input-group-append'>
                    <button className='btn btn-primary' type='submit'>
                      ค้นหา
                    </button>
                  </div>
                  <input type='date' className='form-control' name='end' placeholder='Order Date' />
                  <div className='input-group-append'>
                    <button className='btn btn-primary' type='submit'>
                      ค้นหา
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <br />
        <Row justify='space-between'>
          <Col span={12}>
            {" "}
            <span className='card-label font-weight-bolder text-dark'>จัดการคำสั่งซื้อ</span>
          </Col>
          <Col span={4}></Col>
        </Row>

        <Row>
          <Col span={6}>
            <Input placeholder='SPO NO.' />
          </Col>
          {/* <Col span={12} offset={6}> <Select
              defaultValue="แสดงข้อมูลทั้งหมด"
              style={style}
              onChange={handleChange}
            >
              <Option value="แสดงข้อมูลของวันนี้">แสดงข้อมูลของวันนี้</Option>
              <Option value="แสดงข้อมูลของสัปดาห์นี้">
                แสดงข้อมูลของสัปดาห์นี้
              </Option>
              <Option value="แสดงข้อมูลของเดือนนี้">
                แสดงข้อมูลของเดือนนี้
              </Option>
            </Select></Col> */}
        </Row>
        <div className='card card-custom'>
          <div className='card-body py-0'>
            <div className='table-responsive h-500px'>
              <table className='table table-head-custom table-head-bg table-borderless table-vertical-center'>
                <thead>
                  <tr>
                    <th className='freezeTopic'>Order No.</th>
                    <th className='freezeTopic'>SO No.</th>
                    <th className='text-center freezeTopic'>Customer</th>
                    <th className='text-center freezeTopic'>Sale</th>
                    <th className='text-center freezeTopic'>Shipment</th>
                    <th className='text-center freezeTopic'>Total</th>
                    <th className='text-center freezeTopic'>Date & Status</th>
                    <th className='text-center freezeTopic'>Action</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
