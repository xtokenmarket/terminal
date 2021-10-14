import { LoadingScreen } from "components";
import { MainLayout } from "layouts";
import React, { Fragment, Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const routes = [
  {
    path: "/",
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/home",
        component: lazy(() => import("pages/ComingSoonPage")),
      },
      {
        exact: true,
        path: "/market",
        component: lazy(() => import("pages/ComingSoonPage")),
      },
      {
        exact: true,
        path: "/cafe",
        component: lazy(() => import("pages/ComingSoonPage")),
      },
      {
        exact: true,
        path: "/vote",
        component: lazy(() => import("pages/ComingSoonPage")),
      },
      {
        exact: true,
        path: "/terminal",
        component: lazy(() => import("pages/ComingSoonPage")),
      },
      {
        path: "*",
        // eslint-disable-next-line
        component: () => <Redirect to="/home" />,
      },
    ],
  },
];

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route: any, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            exact={route.exact}
            key={i}
            path={route.path}
            render={(props) => (
              <Layout>
                {route.routes ? (
                  renderRoutes(route.routes)
                ) : (
                  <Component {...props} />
                )}
              </Layout>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

export default routes;
