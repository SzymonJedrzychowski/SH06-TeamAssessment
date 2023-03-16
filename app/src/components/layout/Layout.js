import { Box } from '@mui/material'
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
  const appStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
  return (
    <Box sx={appStyle}>
      <Box>
        <Navbar />

        {children}
      </Box>

      <Footer />
    </Box >
  )
}

export default Layout