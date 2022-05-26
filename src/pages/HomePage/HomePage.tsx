import React, { Component } from 'react'

import Navbar from '../../components/Navbar/Navbar'


export default class HomePage extends Component<{}> {
  render() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    return (
      
        <div className='d-flex flex-column justify-content-center align-items-center' style={{height:'100%'}}>
          <i className="menu-icon icon-10x flaticon2-user"></i>
          <h1>ยินดีต้อนรับ</h1>
          <h2>คุณ {profile?.name}</h2>
        </div>
    
    )
  }
}
