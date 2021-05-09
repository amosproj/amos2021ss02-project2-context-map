import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

function Layout(props: LayoutProps): JSX.Element {
  const { children } = props;
  return <div>{children}</div>;
}

export default Layout;
