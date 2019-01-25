// npm
import { print } from "graphql/language/printer"

// self
import followsQuery from "./user-followers.graphql"

const query = print(followsQuery)

const opts = { method: "POST", mode: "cors" }
const headers = { "Content-Type": "application/json" }

export default (token, login) =>
  fetch("https://api.github.com/graphql", {
    ...opts,
    headers: {
      ...headers,
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login } }),
  }).then((res) => {
    if (res.ok) return res.json()
    const err = new Error("Github query error")
    err.more = { ...res }
    throw err
  })
