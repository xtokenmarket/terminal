import { LoadingScreen } from 'components'
import { MainLayout, TerminalLayout, OriginationLayout } from 'layouts'
import React, { Fragment, Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const routes = [
  {
    path: '/',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: lazy(() => import('pages/Home')),
      },
      {
        exact: true,
        path: '/native',
        component: lazy(() => import('pages/ComingSoon')),
      },
      {
        exact: true,
        path: '/origination/new-token-sale',
        component: lazy(() => import('pages/origination/CreateTokenSale')),
      },
      {
        exact: true,
        path: '/auction',
        component: lazy(() => import('pages/ComingSoon')),
      },
      {
        exact: true,
        path: '/mining/new-pool',
        component: lazy(() => import('pages/mining/CreatePool')),
      },
      {
        exact: true,
        path: '/mining/pools/:network/:id',
        component: lazy(() => import('pages/mining/PoolDetails')),
      },
      {
        exact: true,
        path: '/origination/token-offers/:network/:poolAddress',
        component: lazy(() => import('pages/origination/TokenSaleDetails')),
      },
      {
        path: '/mining',
        layout: TerminalLayout,
        routes: [
          {
            exact: true,
            path: '/mining/discover',
            component: lazy(() => import('pages/mining/Discover')),
          },
          {
            exact: true,
            path: '/mining/my-pools',
            component: lazy(() => import('pages/mining/MyPools')),
          },
          {
            exact: true,
            path: '/mining/about',
            component: lazy(() => import('pages/About')),
          },

          {
            path: '*',
            // eslint-disable-next-line
            component: () => <Redirect to="/mining/discover" />,
          },
        ],
      },
      {
        path: '/origination',
        layout: OriginationLayout,
        routes: [
          {
            exact: true,
            path: '/origination/discover',
            component: lazy(() => import('pages/origination/Discover')),
          },
          {
            exact: true,
            path: '/origination/my-offers',
            component: lazy(() => import('pages/origination/MyOffers')),
          },
          {
            exact: true,
            path: '/origination/about',
            component: lazy(() => import('pages/About')),
          },
          {
            path: '*',
            // eslint-disable-next-line
            component: () => <Redirect to="/origination/discover" />,
          },
        ],
      },
      {
        path: '*',
        // eslint-disable-next-line
        component: () => <Redirect to="/mining" />,
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
