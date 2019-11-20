import React from 'react';
import {List, ListItem, ListItemText, Tabs, Tab} from '@material-ui/core';

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
  let [lessonId, setLessonId] = useStateWithLocalStorage('currentLessonId');
  if (!lessonId && props.lessons) {
    lessonId = props.lessons[0].id;
  }
  const lessonData = props.lessons.find((item) => { return item.id === lessonId; });
  if (!lessonData) {
    return null;
  }

  return (
    <div>
      <LessonsNavBar lessons={props.lessons}
                     lessonId={lessonId}
                     setLessonHandler={(lessonId)=>{ setLessonId(lessonId); }} />
      <List component="nav" aria-label="Lesson">
      {
        lessonData.exercises.map((item, index)=>{
          return (
            <ListItem key={index} button onClick={()=>{ props.handler(item.type, item.params); }}>
              <ListItemText primary={item.name} secondary={item.duration + " мин"} />
            </ListItem>
          );})
      }
      </List>
    </div>
  );
}
