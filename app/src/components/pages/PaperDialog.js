import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Markup } from "interweave";
import draftToHtml from 'draftjs-to-html';
/**
 * @ return PaperDialog using MUI Full-screen dialogs component
 * @author Noorullah Niamatullah w18002720
 * @props id ={news.id} data ={data} title ={news.title} author={news.author} date={news.date}
 * 
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaperDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const content = []
  const filter =(value) =>
  value.newsletter_id ===props.id
  const list = props.data.filter(filter).map((value,key) =>
  content.push(JSON.parse(value.newsletter_content))
  )
  const contentMarkup =[]
  for (let v in content)
  {
    for(let v1 in content[v])
    if(content[v][v1].type ==="paragraph")
    
      contentMarkup.push(content[v][v1].data)
    
    else{
      contentMarkup.push(content[v][v1].data.content)

    }
  }
  const newsContentMa =(value,index)=>{
    return <Markup key={index}content={draftToHtml(JSON.parse(value))}/>
  }
  return (
    <div>
      <Button size ='small'  onClick={handleClickOpen}>
        Read this paper
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
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
            <ListItemText primary={"By "+props.author}secondary={props.date} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              secondary={contentMarkup.map((value,index)=>newsContentMa(value,index))}
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}