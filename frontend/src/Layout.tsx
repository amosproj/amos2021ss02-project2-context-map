import React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MainMenu from './MainMenu';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
    },
    contentContainer: {
      flexGrow: 1,
      // The position is set to relative, to allow views to display themselves in full-height.
      position: 'relative',
    },
    tabToolbar: {
      height: 48,
    },
  })
);

export interface RenderTab {
  path: string;
  label: string;
}

type LayoutProps = {
  children: React.ReactNode;
  // TODO: Is there a better way then suppressing this? See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/24
  // eslint-disable-next-line react/require-default-props
  tabs?: RenderTab[] | undefined;

  // TODO: Is there a better way then suppressing this? See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/24
  // eslint-disable-next-line react/require-default-props
  tabIdx?: number | undefined;

  // TODO: Is there a better way then suppressing this? See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/24
  // eslint-disable-next-line react/require-default-props
  label?: string | undefined;
};

function isNullOrEmpty(str: string | null | undefined): boolean {
  if (!str) {
    return true;
  }

  if (str.length === 0) {
    return true;
  }

  return false;
}

function Layout(props: LayoutProps): JSX.Element {
  const { children, tabs, tabIdx, label } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  // The component state and the setter that contains a boolean indicating whether the drawer is opened.
  const [open, setOpen] = React.useState(false);

  // The component state and the setter that contains a number that is the index of the selected tab.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tab, setTab] = React.useState(tabIdx ?? 0);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleTabChanges = (newTab: number) => {
    setTab(newTab);

    if (tabs && newTab >= 0 && newTab < tabs.length) {
      const { path } = tabs[newTab];
      history.push(path);
    }
  };

  const title = `KMAP${!isNullOrEmpty(label) ? ` - ${label}` : ''}`;

  function RenderTabs(): JSX.Element | null {
    if (!tabs || tabs.length === 0) {
      return null;
    }

    const handleTabChange = (
      event: React.ChangeEvent<unknown>,
      newValue: number
    ) => handleTabChanges(newValue);

    return (
      <Tabs
        value={tabIdx}
        onChange={handleTabChange}
        aria-label="simple tabs example"
      >
        {tabs.map((tabC) => (
          <Tab key={tabC.path} label={tabC.label} />
        ))}
      </Tabs>
    );
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
        <RenderTabs />
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <div
          className={clsx({ [classes.tabToolbar]: tabs && tabs.length > 0 })}
        />
        <Divider />
        <MainMenu />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div
          className={clsx({ [classes.tabToolbar]: tabs && tabs.length > 0 })}
        />
        <div className={classes.contentContainer}>{children}</div>
      </main>
    </div>
  );
}

export default Layout;
