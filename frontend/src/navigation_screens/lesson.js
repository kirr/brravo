import React from 'react';
import {List, ListItem, ListItemText, Tabs, Tab} from '@material-ui/core';

import {config} from '../config.js'

const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey)
  );
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value, localStorageKey]);
  return [value, setValue];
};

function LessonsNavBar(props) {
  return (
     <Tabs
      value={props.lessonId}
      onChange={(event, value)=>{ props.setLessonHandler(value); }}
      variant="scrollable"
      scrollButtons="off"
    >
      {props.lessons.map((item)=>{ return <Tab value={item.id} label={item.name} /> })}
    </Tabs> );
}

export function Lesson(props) {
  const [lessons, setLessons] = React.useState([]);
  React.useEffect(() => {
    fetch(config.API_URL + '/lessons')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      }).then(data => {
          setLessons(data);
      }).catch(error => console.log(error))
  }, []);

  let [lessonId, setLessonId] = useStateWithLocalStorage('currentLessonId');
  if (!lessonId && lessons) {
    lessonId = lessons[0].id;
  }
  const lessonData = lessons.find((item) => { return item.id === lessonId; });
  const exercises = lessonData ? lessonData.exercises.map((item, index)=> {
        return (
          <ListItem key={index} button onClick={()=>{ props.handler(item.type, item.params); }}>
            <ListItemText primary={item.name} secondary={item.duration + " мин"} />
          </ListItem>
        );}) : null;

  return (
    <div>
      <LessonsNavBar lessons={lessons}
                     lessonId={lessonId}
                     setLessonHandler={(lessonId)=>{ setLessonId(lessonId); }} />
      <List component="nav" aria-label="Lesson">
      {exercises}
      </List>
    </div>
  );
}
