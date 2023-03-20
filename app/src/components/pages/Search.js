import React from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

/**
 * @ return Search
 * @author Noorullah Niamatullah w18002720
 */
import SearchIcon from '@mui/icons-material/Search';

//<input value={props.searchTerm} onChange={onChange} />
export const Search = (props) => {

  const onChange = (event) => props.handler(event.target.value);
  return (
    <div>
      <Paper component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center',width:{xs:300,md:400}}}>
        <InputBase
        sx={{ ml: 1, flex: 1}}
        placeholder="Search"
        value={props.searchTerm}onChange={onChange}
      />
       <SearchIcon />
      
      </Paper>
    </div>
  )
}
export default Search;
