import React, { ReactElement } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import DetailPage from "./pages/DetailPage"
import ListPage from "./pages/ListPage"

type RouterProps = { exact: boolean; path: string; component: ReactElement }

const Router: React.VFC = () => {
  const routers: RouterProps[] = [
    {
      path: "/",
      exact: true,
      component: <ListPage />,
    },
    {
      path: "/asset/:id",
      exact: false,
      component: <DetailPage />,
    },
  ]

  return (
    <BrowserRouter>
      <Switch>
        {routers.map(({ path, exact, component }) => (
          <Route key={path} path={path} exact={exact}>
            {component}
          </Route>
        ))}
      </Switch>
    </BrowserRouter>
  )
}

export default Router
