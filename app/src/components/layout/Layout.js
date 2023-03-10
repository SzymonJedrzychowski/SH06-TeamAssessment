import React from 'react'
import Footer from '../footer/Footer'
import Navbar from '../navbar/Navbar'

/**
 * 
 * @param {children} param0 all the components which will nabar on top and footer at the bottom
 * @returns Layout of the application
 * @author Noorullah Niamatullah
 */
const Layout = ({ children }) => {
  return (
    <>
      <Navbar/>

      {children}
      
      <Footer/>
    </>
  )
}

export default Layout