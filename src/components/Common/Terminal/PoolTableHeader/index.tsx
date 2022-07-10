import { makeStyles, Tooltip } from '@material-ui/core'
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
  itemAlignRight: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
          <Tooltip title="The ratio of each LP asset required to deposit in USD terms">
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </PoolTd>
      <PoolTd type="tvl">
        <div className={classes.itemAlignRight}>
          TVL
          {/* <SortButton /> */}
        </div>
      </PoolTd>
      <PoolTd type="vesting">
        <div className={classes.itemAlignRight}>VESTING</div>
      </PoolTd>
      <PoolTd type="program">
        <div className={classes.itemAlignRight}>PROGRAM</div>
      </PoolTd>
      <PoolTd type="ending">
        <div className={classes.itemAlignRight}>ENDING</div>
      </PoolTd>
      <PoolTd type="apr">
        <div className={classes.itemAlignRight}>APR</div>
      </PoolTd>
      <PoolTd type="network">
        <div className={classes.itemAlignRight}>NETWORK</div>
      </PoolTd>
    </div>
  )
}
