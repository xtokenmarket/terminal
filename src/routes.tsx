import { LoadingScreen } from "components";
import { MainLayout, TerminalLayout } from "layouts";
import React, { Fragment, Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const routes = [
  {
    path: "/",
    layout: MainLayout,
    routes: [
      // {
      //   exact: true,
      //   path: "/home",
      //   component: lazy(() => import("pages/ComingSoon")),
      // },
      {
        exact: true,
        path: "/market",
        component: lazy(() => import("pages/ComingSoon")),
      },
      {
        exact: true,
        path: "/cafe",
        component: lazy(() => import("pages/ComingSoon")),
      },
      {
        exact: true,
        path: "/vote",
        component: lazy(() => import("pages/ComingSoon")),
      },
      {
        exact: true,
        path: "/terminal/new-pool",
        component: lazy(() => import("pages/CreatePool")),
      },
      {
        exact: true,
        path: "/terminal/pools/:id",
        component: lazy(() => import("pages/PoolDetails")),
      },
      {
        path: "/terminal",
        layout: TerminalLayout,
        routes: [
          {
            exact: true,
            path: "/terminal/discover",
            component: lazy(() => import("pages/Discover")),
          },
          {
            exact: true,
            path: "/terminal/my-pool",
            component: lazy(() => import("pages/MyPools")),
          },
          {
            exact: true,
            path: "/terminal/about",
            component: lazy(() => import("pages/About")),
          },

          {
            path: "*",
            // eslint-disable-next-line
            component: () => <Redirect to="/terminal/discover" />,
          },
        ],
      },
      {
        path: "*",
        // eslint-disable-next-line
        component: () => <Redirect to="/terminal" />,
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
