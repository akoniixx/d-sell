import React, { Profiler, useState } from 'react'
import { Modal, Button, Avatar } from 'antd'
import { Col, Row } from 'react-bootstrap'

interface SaleDetailModalProp {
  isModalVisible: boolean
  handleCancel: () => void
  profile: any
}

export const SaleDetailModal: React.FC<SaleDetailModalProp> = ({ isModalVisible, handleCancel, profile }) => {
  return (
   
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <div>
          <div className="d-flex justify-content-center mb-6">
            {profile[1] ? (
              <Avatar size={120} src={profile[1]} />
            ) : (
              <Avatar size={120} style={{ color: '#0068F4', backgroundColor: '#EFF2F9', fontSize: 60 }}>
                {profile[0].userName.charAt(0)}
              </Avatar>
            )}
          </div>
          <Row>
            <Col md={4}>
              <p className='textSecondModal'>ชื่อ</p>
              <p className='textSecondModal'>นามสกุล</p>
              <p className='textSecondModal'>ชื่อเล่น</p>
              <p className='textSecondModal'>เขต</p>
              <p className='textSecondModal'>ตำแหน่ง</p>
              <p className='textSecondModal'>เบอร์โทรศัพท์</p>
              <p className='textSecondModal'>อีเมล</p>
            </Col>
            <Col md={8}>
              <p className='textPrimaryModal'> {profile[0].fisrName}</p>
              <p className='textPrimaryModal'> {profile[0].lastName}</p>
              <p className='textPrimaryModal'>{profile[0].nickName}</p>
              <p className='textPrimaryModal'>{profile[0].zone}</p>
              <p className='textPrimaryModal'>{profile[0].position}</p>
              <p className='textPrimaryModal'>{profile[0].telephone}</p>
              <p className='textPrimaryModal'>{profile[0].email}</p>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <p className='textSecondModal'>วันที่อัปเดทล่าสุด</p>
              <p className='textSecondModal'>ชื่อผู้อัปเดทล่าสุด</p>
            </Col>
            <Col md={8}>
              <p className='textPrimaryModal'>{profile[0].updated}</p>
              <p className='textPrimaryModal'>{profile[0].updated_by.name}</p>
            </Col>
          </Row>
        </div>
      </Modal>
   
  )
}
