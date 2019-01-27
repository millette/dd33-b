<app>
  <p if="{error}">
    {error}
  </p>
  <form onSubmit="{addUser}">
    <label
      >Username:
      <input ref="username" type="text" />
    </label>
    <button>Charger l'utilisateur (ou faire <keyb>Enter</keyb>)</button>
    <button onClick="{addUsers}">
      Charger l'utilisateur et ses <i>follows</i>
    </button>
  </form>
  <button type="button" onClick="{resetGraph}">Effacer le graphe</button>
  <p>
    nNodes: {nNodes}<br />
    nLinks: {nLinks}<br />
    cost: {rateLimit.cost}<br />
    remaining: {rateLimit.remaining}<br />
    reset at: {new Date(rateLimit.resetAt || 0)}
  </p>

  <script>
    const hereRe = /(montréal|montreal|mtl|yul)/

    const name = window.location.hash.slice(1)
    if (name) {
      this.fetchOne(name, hereRe)
        .then(() => this.error = false)
        .catch((e) => this.error = e)
        .then(() => this.update())
    }

    this.error = false
    this.nNodes = 0
    this.nLinks = 0
    this.rateLimit = {}

    resetGraph(ev) {
      this.clearGraph()
    }

    addUsers(ev) {
      ev.preventDefault()
      const val = this.refs.username.value.trim()
      if (!val) return
      this.refs.username.value = ''
      this.fetchFollows(val, hereRe)
        .then(() => this.error = false)
        .catch((e) => this.error = e)
        .then(() => this.update())
    }

    addUser(ev) {
      ev.preventDefault()
      const val = this.refs.username.value.trim()
      if (!val) return
      this.refs.username.value = ''
      this.fetchOne(val, hereRe)
        .then(() => this.error = false)
        .catch((e) => this.error = e)
        .then(() => this.update())
    }

    const i = setInterval(() => {
      const on = this.nNodes
      const ol = this.nLinks
      this.nNodes = this.opts.dataNodes.length
      this.nLinks = this.opts.dataLinks.length
      if (on !== this.nNodes || ol !== this.nLinks) this.update()
    }, 500)

    // this.fetchOne('millette', hereRe)

    // setTimeout(() => clearInterval(i), 15000)
  </script>
</app>
