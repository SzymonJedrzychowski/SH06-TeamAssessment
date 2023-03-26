import { Box, Card, CardContent, Typography } from "@mui/material";
import { Markup } from "interweave";
import React, { useEffect, useState } from "react";
import draftToHtml from 'draftjs-to-html';
import convertImages from "../helper/convertImages";
/**
 * 
 * @returns hompage which is displaying the last published newsletter
 * @author Noorullah Niamatullah
 */
const Homepage = () => {
  
  //Hook to hold the error
  const [error,setError] = useState(null);
  //Hook to hold data of the last published Newsletter
  const [newsLetter, setNewsLetter] = useState([]);

  // Hook to show the page is loaded with data
  const [loading, setLoading] = useState(true);

  //object to hold the data from the newsletter
  const contentProcessd = {date: "",publisher: "",content: {},paragraph:[]};

  //array to hold the newsletter items
  const newsLetterContents =[]

  // function to load the data of the newsletter
  useEffect(() =>
   {
      fetch(process.env.REACT_APP_API_LINK + "getlastpublishednewsletter")
      .then((response) => {
        if(!response.ok){
          throw Error('could not fetch the data for that resource');
        }
        return response.json()
      })
      .then((json) => {
        setNewsLetter(json.data);
        setLoading(false);
        setError(null)
      })
      .catch((e) => {
          console.log(e.message);
          setLoading(false)
          setError(e.message)
      });
  }, []);

  // if newsletter is loaded get the publisher name and published date
  if (newsLetter.length > 0)
    {
      contentProcessd.date = newsLetter[0].date_published;
      contentProcessd.publisher =newsLetter[0].first_name + " " + newsLetter[0].last_name;
      Object.assign(contentProcessd.content,JSON.parse(newsLetter[0].newsletter_content));
    }

  // get the newsletter item contents and the paragraphs added by the publisher
  if(newsLetter.length >0)
    {
      for(let i in contentProcessd.content)
          if(contentProcessd.content[i].type === "newsletter")
          
            {let temp ={itemTitle :"", itemAuthor:"",itemOrganisation:"",itemContent:""}
            temp.itemTitle = contentProcessd.content[i].data.item_title
            temp.itemAuthor = contentProcessd.content[i].data.first_name + " " + contentProcessd.content[i].data.last_name
            temp.itemOrganisation = contentProcessd.content[i].data.organisation_name
            temp.itemContent=convertImages(draftToHtml(JSON.parse(contentProcessd.content[i].data.  content)))
            newsLetterContents.push(temp)}
          else
          {
              let temp ={itemAuthor:"",itemContent:""}
              temp.itemAuthor= contentProcessd.publisher;
              temp.itemContent=convertImages(draftToHtml(JSON.parse(contentProcessd.content[i]. data)));
              contentProcessd.paragraph.push(temp)
          }
    }
  
  //create markups for the newsletter items
  const newsLetterContentMarkup =newsLetterContents.map((value,key) =>(
    <Card key={key}>
      <CardContent>
        <Typography variant="h5">Title :{value.itemTitle}</Typography>
        <Markup key={key} content={value.itemContent}/>
        <Typography>Contributing Author :{value.itemAuthor}</Typography>
        <Typography>Contributing Organisation:{value.itemOrganisation}</Typography>
      </CardContent>
    </Card>
    )
  );

  // create markup for the paraghraphs added by the publisher
  const paragraphMark= contentProcessd.paragraph.map((value,key) =>
    <Card>
      <CardContent>
        <Markup key ={key} content ={value.itemContent} />
      </CardContent>
    </Card>
  )
   
  const boxStyling = {display: "flex",flexDirection: "column",padding: 3,};
  return (
    <Box sx={boxStyling}>
      {error && <div>{error}</div>}
      {!loading && (
        <>
          <Typography variant="h5">Publisher: {contentProcessd.publisher}</Typography>
          <Typography >Published Date:{contentProcessd.date}</Typography>
          
          <div>
              {newsLetterContentMarkup}
              
              {paragraphMark}
          </div>
        </>
      )}{loading &&(<p>Loading ...</p>)}
    </Box>
  );
};

export default Homepage;
