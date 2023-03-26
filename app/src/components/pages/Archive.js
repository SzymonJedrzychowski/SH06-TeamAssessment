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

  //hook for all the published newsletter
  const [data, setdata] = useState([]);
  //hook for the searchterm
  const [searchterm, setSearchTerm] = useState("");
  //hook for pages
  const [page, setPage] = useState(0);
  //hook for rows
  const [rows, setRows] = useState(5);
  //hook for select
  const [selectValue, setSelectValue] = useState("");
  //list of organisations
  const organisationName =[]
  const [error , setError] = useState(null) ;
  const [loading , setLoading] = useState (true);

  /**
   * makes request to the getpublished newsletter
   * get the response and parsed it as json
   * set the data as the parsed responses
   */
  useEffect(() => {
      fetch(
        process.env.REACT_APP_API_LINK + "getpublishednewsletters"
      )
        .then((response) => {
          if(!response.ok){
            throw Error('Could not fetch the data for that resource');
                          }  
          return response.json()
        })
        .then((res) => {
          setdata(res.data)
          setLoading(false);
          setError(null)
        })
        .catch((e) => {
          console.log(e.message);
          setLoading(false)
          setError(e.message)
        });
        ;
    }, []);
  
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const listOfNewsletters =[]
  
  //geting the deatils of the nesletters
  if (data) {
    
    for(let i in data){
      let temp = { id: 0, title: "", editor: "", date: "",contributer:"" ,org:"" };
      let tempContentParsed = [];
      let tempOrg = "";
      let tempCont = "";
      let tempTitle = ""
      temp.id = data[i].newsletter_id;
      temp.date = data[i].date_published
      temp.editor = data[i].first_name+ " " +data[i].last_name
       tempContentParsed.push(JSON.parse(data[i].newsletter_content))
      for (let i in tempContentParsed)
      for (let j in tempContentParsed[i])
        if (tempContentParsed[i][j].type === "newsletter"){
        tempTitle = tempTitle + " " +tempContentParsed[i][j].data.item_title +" - ";
        tempCont= tempCont + " "+ tempContentParsed[i][j].data.first_name +" " + tempContentParsed[i][j].data.last_name +"  /";        
        tempOrg = tempOrg + " " +tempContentParsed[i][j].data.organisation_name + " "
        organisationName.push(tempContentParsed[i][j].data.organisation_name);
        }
        temp.org = tempOrg
        temp.contributer = tempCont
        temp.title = tempTitle
        listOfNewsletters.push(temp)
    }

  }
  //remove dupliactes for filter
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

  //filter 
  const onChangeSelect = (event) => {
    setSearchTerm(event.target.value);
    setSelectValue(event.target.value);
  };

  //create table row
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
        {error && <div>{error}</div>}
        { !loading && (
        <>
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
                  <TableCell>Titles</TableCell>
                  <TableCell>Published Date</TableCell>
                  <TableCell>Editor</TableCell>
                  <TableCell>Contributing Author</TableCell>
                  <TableCell>Contributing Organisation</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOfNewsletters.filter(searchPapers).slice(page * rows, page * rows + rows).map((value)=>createRow(value)) }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={listOfNewsletters.length}
                    rowsPerPage={rows}
                    page={page}
                    onPageChange={(event, page) => setPage(page)}
                    onRowsPerPageChange={(event) => { setRows(parseInt(event.target.value, 10)); setPage(0) }} />
            </>)}{loading &&(<p>Loading ...</p>)}
      </Box>
    );
  }
  
};

export default Archive;
