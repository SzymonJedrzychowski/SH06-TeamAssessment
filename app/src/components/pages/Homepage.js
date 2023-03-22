import { Box } from "@mui/material";
import { Markup } from "interweave";
import React, { useEffect, useState } from "react";
/**
 * 
 * @returns hompage whic is displaying the last published newsletter
 * @author Noorullah Niamatullah
 */
const Homepage = () => {
  const [newsLetter, setNewsLetter] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentProcessd = {
    date: "00/00",
    author: "",
    content: {},
    news: {},
    parghraph: {},
  };
  useEffect(() => {
    fetch(
      "http://unn-W18002720.newnumyspace.co.uk/teamAssessment/api/getlastpublishednewsletter"
    )
      .then((response) => response.json())
      .then((json) => {
        setNewsLetter(json.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  if (newsLetter.length > 0) {
    contentProcessd.date = newsLetter[0].date_published;
    contentProcessd.author =
      newsLetter[0].first_name + " " + newsLetter[0].last_name;
    Object.assign(
      contentProcessd.content,
      JSON.parse(newsLetter[0].newsletter_content)
    );
  }
  let objectnews = { ...newsLetter };
  const ar = [];
  for (let v in objectnews) {
    ar.push(JSON.parse(objectnews[v].newsletter_content));
  }
  const paperContent = [];

  for (let v in ar) {
    for (let v1 in ar[v])
      if (ar[v][v1].type === "paragraph")
        paperContent.push(ar[v][v1].data);
      else {
        paperContent.push(ar[v][v1].data.content);
      }
  }
  console.log(paperContent);
  const newsContentMa = (value, index) => {
<<<<<<< Updated upstream
    return <Markup content={value} />;
=======
    return <Markup content={convertImages(draftToHtml(JSON.parse(value)))} />;
>>>>>>> Stashed changes
  };

  for (let val in contentProcessd.content) {
    if (contentProcessd.content[val].type === "paragraph") {
      contentProcessd.parghraph = contentProcessd.content[val].data;
    }
    if (contentProcessd.content[val].type === "newsletter") {
      contentProcessd.news = { ...contentProcessd.content[val].data };
    }
  }
  const boxStyling = {
    display: "flex",
    flexDirection: "column",
    padding: 3,
  };
  return (
    <Box sx={boxStyling}>
      {!loading && (
        <>
          <h1>{contentProcessd.news.item_title}</h1>
          <p>By: {contentProcessd.author}</p>
          <p>{contentProcessd.date}</p>
          <p>{contentProcessd.news.organisation_name}</p>
          {paperContent.map((value, index) => newsContentMa(value, index))}
        </>
      )}
    </Box>
  );
};

export default Homepage;
