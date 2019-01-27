<app>
  <p if="{error}">
    {error}
  </p>
  <form onSubmit="{addUser}">
    <label
      >Username:
      <input ref="username" type="text" />
    </label>
  </form>
  <button onClick="{resetGraph}">Reset</button>
  <p>
    nNodes: {nNodes}<br />
    nLinks: {nLinks}<br />
    cost: {rateLimit.cost}<br />
    remaining: {rateLimit.remaining}<br />
    reset at: {new Date(rateLimit.resetAt || 0)}
  </p>

  <script>
    const hereRe = /(montréal|montreal|mtl|yul)/

    this.error = false
    this.nNodes = 0
    this.nLinks = 0
    this.rateLimit = {}

    resetGraph(ev) {
      this.clearGraph()
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
