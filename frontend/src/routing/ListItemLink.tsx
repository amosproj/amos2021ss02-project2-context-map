import React from 'react';
import { NavLink, LinkProps } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

interface ListItemLinkProps {
  icon?: React.ReactElement | undefined;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps): JSX.Element {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <NavLink
          to={to}
          ref={ref}
          activeClassName="Mui-selected"
          // TODO: Fix this, so that the rule does not have to be disabled
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...itemProps}
        />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.defaultProps = {
  icon: undefined,
};

export default ListItemLink;
