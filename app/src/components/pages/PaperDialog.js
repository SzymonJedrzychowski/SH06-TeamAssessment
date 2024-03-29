import * as React from "react";
import {Button, Dialog, ListItemText, List, Divider,AppBar, Toolbar , IconButton, Typography, Slide, ListItem  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Markup } from "interweave";
import draftToHtml from "draftjs-to-html";
import convertImages from "../helper/convertImages";
/**
 * @ return PaperDialog using MUI Full-screen dialogs component
 * @author Noorullah Niamatullah w18002720
 * @props id ={news.id} data ={data} title ={news.title} author={news.editor} date={news.date}
 *
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaperDialog(props) {
  //hook for opening of the paperDialog for newsletter
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  //content of a specfic newsletter
  const content = [];
  //to identifify specfic newsletter
  const filter = (value) => value.newsletter_id === props.id;
  const list = props.data
    .filter(filter)
    .map((value, key) => content.push(JSON.parse(value.newsletter_content)));
  
  
  function isJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  //list to hold markups of the newsletter item 
  const contentMarkup = [];
  for (let v in content) {
    for (let v1 in content[v])
      if (content[v][v1].type === "paragraph")
      isJsonString(content[v][v1].data)?
        contentMarkup.push(convertImages(draftToHtml(JSON.parse(content[v][v1].data)))):
        contentMarkup.push(content[v][v1].data)
      else {
        contentMarkup.push("Title: " + content[v][v1].data.item_title);
        isJsonString(content[v][v1].data.content) ?
        contentMarkup.push(
          convertImages(draftToHtml(JSON.parse(content[v][v1].data.content)))
        ) :contentMarkup.push(content[v][v1].data.content)
        contentMarkup.push(
          "Contributing Author: " +
          content[v][v1].data.first_name +
          " " +
          content[v][v1].data.last_name + " "
        );
        contentMarkup.push(
          "Contributing Organisation: " + content[v][v1].data.organisation_name
        );

      }
  }
  //create markup
  const newsContentMa = (value, index) => {
    return <Markup key={index} content={value} />;
  };
  return (
    <div>
      <Button size="small" onClick={handleClickOpen}>
        Read this paper
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {props.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <ListItemText
              primary={"By " + props.author}
              secondary={props.date}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              secondary={contentMarkup.map((value, index) =>
                newsContentMa(value, index)
              )}
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
