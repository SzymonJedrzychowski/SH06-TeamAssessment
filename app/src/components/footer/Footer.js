import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const Footer = () => {
  return (
    <Box>
      <Typography>&copy; {new Date().getFullYear()} IC3 Newsletter</Typography>
    </Box>
  )
}

export default Footer