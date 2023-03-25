import { Button, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import PaperDialog from "./PaperDialog";
import Search from "./Search";
/**
 * 
 * @returns Archvie component for all the published newsletters
 * author noorullah niamatullah
 */
const Archive = () => {
  const [data, setdata] = useState([]);
  const [searchterm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [selectValue, setSelectValue] = useState("");
  const organisationName =[] 

  /**
   * makes request to the getpublished newsletter
   * get the response and parsed it as json
   * set the data as the parsed responses
   */
  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_LINK + "getpublishednewsletters"
    )
      .then((response) => response.json())
      .then((res) => setdata(res.data));
  }, []);
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const listOfPapers =[]
 
  if (data) {
    
    for(let i in data){
      let temp = { id: 0, title: "", editor: "", date: "",contributer:"" ,org:"" };
      let cont = [];
      temp.id = data[i].newsletter_id;
      temp.date = data[i].date_published
      temp.editor = data[i].first_name+ " " +data[i].last_name
       cont.push(JSON.parse(data[i].newsletter_content))
      for (let i in cont)
      for (let j in cont[i])
        if (cont[i][j].type === "newsletter"){
        temp.title = cont[i][j].data.item_title;
        temp.contributer= cont[i][j].data.first_name +" " + cont[i][j].data.last_name +" ";
        temp.org =cont[i][j].data.organisation_name
        organisationName.push(cont[i][j].data.organisation_name);
        }
      listOfPapers.push(temp)
    }

  }
  function removeDuplicates(arr) {
    return organisationName.filter((item,
        index) => organisationName.indexOf(item) === index);
  }
 const paperStyle ={
  ml: 2, flex: 1 ,padding:2
 }
   // value paper information
   const searchPapers = (value) => {
    const paperDetails =
      value.title.toLowerCase() + " " + value.editor.toLowerCase() +value.date +value.contributer.toLowerCase() + value.org.toLowerCase();
    return paperDetails.includes(searchterm.toLowerCase());
  };

  const onChangeSelect = (event) => {
    setSearchTerm(event.target.value);
    setSelectValue(event.target.value);
  };
  const createRow =(value)=>{
    return <TableRow key ={value.id}>
        <TableCell>{value.title}</TableCell>
        <TableCell>{value.date}</TableCell>
        <TableCell>{value.editor}</TableCell>
        <TableCell>{value.contributer}</TableCell>
        <TableCell>{value.org}</TableCell>
        <TableCell>
          {<PaperDialog id ={value.id} data ={data} title ={value.title} author={value.editor} date={value.date}/>}
        </TableCell>
    </TableRow>
  }
  if (data) {
    return (
      <Box sx={{ padding: 2}}>
        <Typography variant="h4" textAlign={"center"} gutterBottom>List of all Newsletters</Typography>
        <Box container display="flex"gap="20px" sx={{ paddingBottom:2 }}
            >
            <Search searchterm={searchterm} handler={handleSearch}/>
            <InputLabel  id="tagSelectLabel" sx={{ paddingTop:0.7 }}>
            Filter by Organisation
          </InputLabel>
          <Select value={selectValue} onChange={onChangeSelect} size='small'>
            {removeDuplicates(organisationName).map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
              
            ))}
            <MenuItem  value={""}onChange ={()=>{
              setSearchTerm("")
              }}>All</MenuItem>
          </Select>
        </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Published Date</TableCell>
                  <TableCell>Editor</TableCell>
                  <TableCell>Contributing Author</TableCell>
                  <TableCell>Contributing Organisation</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOfPapers.filter(searchPapers).slice(page * rows, page * rows + rows).map((value)=>createRow(value)) }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
                    sx={{ 'div > p': { marginBottom: "0px !important" } }}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={listOfPapers.length}
                    rowsPerPage={rows}
                    page={page}
                    onPageChange={(event, page) => setPage(page)}
                    onRowsPerPageChange={(event) => { setRows(parseInt(event.target.value, 10)); setPage(0) }} />
      
      </Box>
    );
  }
  
};

export default Archive;
