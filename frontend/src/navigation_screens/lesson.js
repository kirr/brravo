import React from 'react';
import {List, ListItem, ListItemText} from '@material-ui/core';

export function Lesson(props) {
  return (
    <List component="nav" aria-label="Lesson">
      <ListItem button>
        <ListItemText primary="С чего начать" secondary="5 мин" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Базовая гимнастика" secondary="3 мин" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Лошадка и грибок" secondary="2 мин" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Заводим мотор" secondary="2 мин" />
      </ListItem>
      <ListItem button onClick={props.handler}>
        <ListItemText primary="Cлоги РА-РО-РУ" secondary="5 мин"/>
      </ListItem>
    </List>
  );
}

