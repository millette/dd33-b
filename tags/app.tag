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
  <button if="{nNodes}" type="button" onClick="{resetGraph}">
    Effacer le graphe
  </button>

  <form onSubmit="{addLocation}">
    <label
      >Ajouter un lieu:
      <input ref="location" type="text" />
    </label>
  </form>

  <p>
    nNodes: {nNodes}<br />
    nLinks: {nLinks}<br />
    cost: {rateLimit.cost}<br />
    remaining: {rateLimit.remaining}<br />
    reset at: {new Date(rateLimit.resetAt || 0)}
  </p>

  <p if="{locations && locations.length}">
    Lieux: {locations.join(', ')}<br />
    <button type="button" onClick="{resetLocations}">Effacer les lieux</button>
  </p>

  <script>
    this.hereRe = new RegExp(
      this.locations && this.locations.length
        ? `(${this.locations.join('|')})`
        : ''
    )
    this.error = false
    this.nNodes = 0
    this.nLinks = 0
    this.rateLimit = {}

    const name = window.location.hash.slice(1)
    if (name) {
      this.fetchOne(name, this.hereRe)
        .then(() => this.error = false)
        .catch((e) => this.error = e)
        .then(() => this.update())
    }

    resetLocations(ev) {
      ev.preventDefault()
      this.locations = false
      this.hereRe = /()/
      this.update()
    }

    addLocation(ev) {
      ev.preventDefault()
      const val = this.refs.location.value.trim().toLowerCase()
      if (!val) return
      this.refs.location.value = ''
      if (!this.locations) this.locations = []
      this.locations.push(val)
      const val2 = this.deburr(val)
      if (val2) this.locations.push(val2)
      this.locations = this.uniq(this.locations)
      this.hereRe = new RegExp(`(${this.locations.join('|')})`)
      this.update()
    }

    resetGraph(ev) {
      this.clearGraph()
    }

    addUsers(ev) {
      ev.preventDefault()
      const val = this.refs.username.value.trim()
      if (!val) return
      this.refs.username.value = ''
      this.fetchFollows(val, this.hereRe)
        .then(() => this.error = false)
        .catch((e) => this.error = e)
        .then(() => this.update())
    }

    addUser(ev) {
      ev.preventDefault()
      const val = this.refs.username.value.trim()
      if (!val) return
      this.refs.username.value = ''
      this.fetchOne(val, this.hereRe)
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
  </script>
</app>
