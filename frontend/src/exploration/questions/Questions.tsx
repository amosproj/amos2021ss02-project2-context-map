import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createStyles } from '@material-ui/core/styles';
import ExplorationStore from '../../stores/exploration/ExplorationStore';
import useService from '../../dependency-injection/useService';
import explorationQuestions from '../../stores/exploration/ExplorationQuestions';
import useObservable from '../../utils/useObservable';
import { ExplorationAnswer } from '../../stores/exploration';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    formControl: {
      margin: theme.spacing(3),
    },
  })
);

/**
 * Creates the questions of the exploration page.
 * @returns a JSX Element containing the questions of the exploration page.
 */
function Questions(): JSX.Element {
  const classes = useStyle();
  const explorationStore = useService(ExplorationStore);
  const answers = useObservable(
    explorationStore.getState(),
    explorationStore.getValue()
  );

  /**
   * Handles change event of the exploration questions,
   * by adding newly selected answers and
   * removing de-selected answers from the ExplorationStore.
   * @param event the changeEvent emitting this function.
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    answer: ExplorationAnswer
  ) => {
    if (event.target.checked) {
      explorationStore.addAnswer(answer);
    } else {
      explorationStore.removeAnswer(answer);
    }
  };

  return (
    <>
      <Box>
        {explorationQuestions.map((question, qIndex) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`question-${qIndex}-content`}
              id={`question-${qIndex}-header`}
            >
              <Typography className={classes.heading}>
                {question.text}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={`question-${qIndex}-content`}>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  {question.answers.map((answer, aIndex) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={answers.some((a) => a === answer)}
                          onChange={(event) => handleChange(event, answer)}
                          color="primary"
                        />
                      }
                      label={answer.text}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
}

export default Questions;
