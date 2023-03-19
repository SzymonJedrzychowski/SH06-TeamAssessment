import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
// import SignUp from '../pages/SignUp'

const Footer = () => {
  return (
    <Box>
      <Typography>&copy; {new Date().getFullYear()} IC3 Newsletter</Typography>
      {/* <SignUp></SignUp> */}
    </Box>
  )
}

export default Footer