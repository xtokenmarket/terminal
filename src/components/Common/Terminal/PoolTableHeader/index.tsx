import { makeStyles, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import { SortButton } from 'components'
import { PoolTd } from '..'

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    marginBottom: 12,
  },
  item: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
  },
}))

export const PoolTableHeader = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <PoolTd type="pool">
        <div className={classes.item}>POOL</div>
      </PoolTd>
      <PoolTd type="allocation">
        <div className={classes.item}>
          ALLOCATION&nbsp;
          <Tooltip title="This is lorem ipsum sit dolor allocation. Lorem allocation ipsum.">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </PoolTd>
      <PoolTd type="tvl">
        <div className={classes.item}>
          TVL
          <SortButton />
        </div>
      </PoolTd>
      <PoolTd type="vesting">
        <div className={classes.item}>
          VESTING
          <SortButton />
        </div>
      </PoolTd>
      <PoolTd type="program">
        <div className={classes.item}>PROGRAM</div>
      </PoolTd>
      <PoolTd type="ending">
        <div className={classes.item}>
          ENDING
          <SortButton />
        </div>
      </PoolTd>
      <PoolTd type="apr">
        <div className={classes.item}>
          APR
          <SortButton />
        </div>
      </PoolTd>
    </div>
  )
}
