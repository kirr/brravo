import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const gridStyles = makeStyles({
  root: {
    position: "absolute",
    top: "calc(50% - 40px)",
    width: "100%"
  }
});

export function AutomatitionExercise() {
  const classes = gridStyles();
  return (<Grid container classes={{root: classes.root}} justify="center" spacing={2}>
          {["Pa", "Pa", "Pa"].map(value => (
            <Grid key={value} item>
              <Paper elevation={5}>{value}</Paper>
            </Grid>
          ))}
    </Grid>);
}
