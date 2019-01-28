// npm
import delay from "delay"
import { print } from "graphql/language/printer"

// self
import followsQuery from "./user-followers.graphql"

const query = print(followsQuery)

const opts = { method: "POST", mode: "cors" }
const headers = { "Content-Type": "application/json" }

const askOne = (token, login, { followersAfter, followingAfter }) =>
  fetch("https://api.github.com/graphql", {
    ...opts,
    headers: {
      ...headers,
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { login, followersAfter, followingAfter },
    }),
  })
    .then((res) => {
      if (res.ok) return res.json()
      const err = new Error("Github query error")
      err.more = { ...res }
      throw err
    })
    .then(({ errors, data }) => {
      if ((!errors || !errors[0]) && data.user) return data
      const error = new Error(
        errors && errors[0] ? errors[0].message : "Unexpected fetch error."
      )
      if (errors) error.errors = errors
      if (data) error.data = data
      throw error
    })

const ask = async (token, login, opts) => {
  if (!opts) opts = {}
  const ret = {}
  const followers = []
  const following = []
  let repeat = true
  while (repeat) {
    const { rateLimit, user } = await askOne(token, login, opts)
    ret.rateLimit = rateLimit
    if (!ret.user)
      ret.user = {
        ...user,
        followers: { totalCount: user.followers.totalCount },
        following: { totalCount: user.following.totalCount },
      }
    if (user.followers.nodes.length) followers.push(user.followers.nodes)
    if (user.following.n2.length) following.push(user.following.n2)
    if (user.followers.pageInfo.endCursor)
      opts.followersAfter = user.followers.pageInfo.endCursor
    if (user.following.pageInfo.endCursor)
      opts.followingAfter = user.following.pageInfo.endCursor
    repeat =
      (user.followers.pageInfo.hasNextPage ||
        user.following.pageInfo.hasNextPage) &&
      followers.length < 3 &&
      following.length < 3

    if (rateLimit.remaining < 10)
      await delay(Math.ceil(Date.parse(rateLimit.resetAt) - Date.now()) / 2)
  }

  ret.user.followers.nodes = followers.reduce((a, b) => [...a, ...b], [])
  ret.user.following.n2 = following.reduce((a, b) => [...a, ...b], [])

  return ret
}

export default ask
