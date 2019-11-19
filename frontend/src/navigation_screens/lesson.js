import React from 'react';
import {List, ListItem, ListItemText} from '@material-ui/core';

export function Lesson(props) {
  return (
    <List component="nav" aria-label="Lesson">
    {
      props.data.exercises.map((item, index)=>{
        return (
          <ListItem key={index} button onClick={()=>{ props.handler(item.type, item.params); }}>
            <ListItemText primary={item.name} secondary={item.duration + " мин"} />
          </ListItem>
        );})
    }
    </List>
  );
}

