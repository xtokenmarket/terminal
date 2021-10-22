import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 32,
    lineHeight: "42px",
  },
  description: {
    marginTop: 24,
    color: theme.colors.white,
    fontSize: 18,
    lineHeight: "25px",
  },
}));

const TerminalAboutPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>About us</Typography>
      <Typography className={classes.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac
        metus varius, pretium neque sed, scelerisque orci. Ut ac libero in est
        rutrum fermentum. Suspendisse vehicula orci in eleifend imperdiet. Cras
        lacinia velit lorem, eu iaculis augue hendrerit nec. Suspendisse vitae
        orci et tortor tincidunt euismod. Vestibulum mollis, felis eget
        malesuada ullamcorper, sapien turpis ultrices ante, ut porta sem sapien
        a purus. Suspendisse potenti. Curabitur feugiat, dolor vel egestas
        varius, leo ipsum hendrerit velit, non suscipit orci nunc ut leo. Nullam
        sed nibh aliquam, blandit nisl at, tristique est. Donec laoreet vitae
        lectus nec efficitur. Morbi maximus porta justo ac iaculis. Aenean vel
        elit interdum, euismod leo non, scelerisque quam. Phasellus a metus
        velit. Sed scelerisque in ligula sit amet tincidunt. Donec sed posuere
        ligula. Sed commodo ac dolor non pulvinar. Morbi dignissim mauris porta
        lectus condimentum lacinia. Mauris tempor, leo quis dictum tincidunt,
        erat odio consequat odio, ut dapibus ex nunc interdum dolor. Ut vehicula
        dui vitae est dignissim congue. Mauris bibendum pharetra eleifend.
        Aliquam erat volutpat. Nulla scelerisque eleifend hendrerit. Maecenas
        mattis, velit nec egestas mattis, metus nulla posuere massa, quis
        suscipit odio nulla at ante. Praesent tempor elementum ex, ut rhoncus
        urna efficitur non.
      </Typography>
    </div>
  );
};

export default TerminalAboutPage;
