import { LoadingScreen } from 'components'
import { MainLayout, TerminalLayout } from 'layouts'
import React, { Fragment, Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const routes = [
  {
    path: '/',
    layout: MainLayout,
    routes: [
      // {
      //   exact: true,
      //   path: "/home",
      //   component: lazy(() => import("pages/ComingSoon")),
      // },
      {
        exact: true,
        path: '/native',
        component: lazy(() => import('pages/ComingSoon')),
      },
      {
        exact: true,
        path: '/origination',
        component: lazy(() => import('pages/ComingSoon')),
      },
      {
        exact: true,
        path: '/auction',
        component: lazy(() => import('pages/ComingSoon')),
      },
      {
        exact: true,
        path: '/new-pool',
        component: lazy(() => import('pages/CreatePool')),
      },
      {
        exact: true,
        path: '/pools/:network/:id',
        component: lazy(() => import('pages/PoolDetails')),
      },
      {
        path: '/',
        layout: TerminalLayout,
        routes: [
          {
            exact: true,
            path: '/discover',
            component: lazy(() => import('pages/Discover')),
          },
          {
            exact: true,
            path: '/my-pools',
            component: lazy(() => import('pages/MyPools')),
          },
          {
            exact: true,
            path: '/about',
            component: lazy(() => import('pages/About')),
          },

          {
            path: '*',
            // eslint-disable-next-line
            component: () => <Redirect to="/discover" />,
          },
        ],
      },
      {
        path: '*',
        // eslint-disable-next-line
        component: () => <Redirect to="/" />,
      },
    ],
  },
]

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route: any, i) => {
        const Layout = route.layout || Fragment
        const Component = route.component

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
        )
      })}
    </Switch>
  </Suspense>
)

export default routes
