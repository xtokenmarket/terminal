import { makeStyles, Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  tooltipArrow: {
    color: theme.colors.primary300,
  },
  tooltip: {
    backgroundColor: theme.colors.primary300,
    fontFamily: 'Gilmer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8,
  },
}))

interface IQuestionTooltip {
  className?: string
  title: string
}
export const QuestionTooltip = ({ title, className }: IQuestionTooltip) => {
  const classes = useStyles()

  return (
    <Tooltip
      arrow
      placement="right"
      className={className}
      classes={{
        arrow: classes.tooltipArrow,
        tooltip: classes.tooltip,
      }}
      title={title}
    >
      <img alt="question" src="/assets/icons/question.svg" />
    </Tooltip>
  )
}
