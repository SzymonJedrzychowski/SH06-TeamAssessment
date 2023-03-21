import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
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

  /**
   * makes request to the getpublished newsletter
   * get the response and parsed it as json
   * set the data as the parsed responses
   */
  useEffect(() => {
    fetch(
      "http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getpublishednewsletters"
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
      let temp = { id: 0, title: "", author: "", date: "" };
      let cont = [];
      temp.id = data[i].newsletter_id;
      temp.date = data[i].date_published
      temp.author = data[i].first_name+ " " +data[i].last_name
       cont.push(JSON.parse(data[i].newsletter_content))
      for (let i in cont)
      for (let j in cont[i])
        if (cont[i][j].type === "newsletter")
        temp.title = cont[i][j].data.item_title 
      listOfPapers.push(temp)
    }

  }
  
 const paperStyle ={
  ml: 2, flex: 1 ,padding:2
 }
   // value paper information
   const searchPapers = (value) => {
    const paperDetails =
      value.title.toLowerCase() + " " + value.author.toLowerCase() +value.date;
    return paperDetails.includes(searchterm.toLowerCase());
  };
console.log(listOfPapers)
  const createRow =(value)=>{
    return <TableRow key ={value.id}>
        <TableCell>{value.title}</TableCell>
        <TableCell>{value.date}</TableCell>
        <TableCell>{value.author}</TableCell>
        <TableCell>
          {<PaperDialog id ={value.id} data ={data} title ={value.title} author={value.author} date={value.date}/>}
        </TableCell>
    </TableRow>
  }
  if (data) {
    return (
      <Box sx={{ padding: 2}}>
        <Typography variant="h4" textAlign={"center"} gutterBottom>List of all Newsletters</Typography>
        <Box container
            display="flex"
              justifyContent="center"
            >
            <Search searchterm={searchterm} handler={handleSearch}/>
        </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Published Date</TableCell>
                  <TableCell>Author</TableCell>
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
