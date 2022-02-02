import { createContext, useContext } from 'react'

export function createContextWithDefault<C>(): [React.Context<C>, () => C] {
  const proxy = new Proxy(
    {},
    {
      get(target: any, property: any) {
        throw new Error(
          `You tried to access the ${property} property within a Context, but it couldn't be found.
        You probably forgot to use a Provider.`
        )
      },
    }
  )

  const context = createContext<C>(proxy)
  return [context, () => useContext(context)]
}
