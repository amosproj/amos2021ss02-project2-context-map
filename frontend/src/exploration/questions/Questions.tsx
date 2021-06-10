import React from 'react';
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

function Questions(): JSX.Element {
  const classes = useStyle();

  const explorationStore = useService(ExplorationStore);

  // Map answers to string of questionIndex-answerIndex, in order to add and remove
  // them from the explorationStore in handleChange
  const answers: Record<string, ExplorationAnswer> = {};
  explorationQuestions.forEach((q, qIndex) => {
    q.answers.forEach((a, aIndex) => {
      answers[`explorationAnswer-${qIndex}-${aIndex}`] = a;
    });
  });

  /**
   * Handles change event of the exploration questions,
   * by adding newly selected answers and
   * removing de-selected answers from the ExplorationStore.
   * @param event the changeEvent
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const answer = answers[name];

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
                          onChange={handleChange}
                          name={`explorationAnswer-${qIndex}-${aIndex}`}
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
