<app>
  <div class="columns">
    <div class="column">
      <form onSubmit="{addUser}">
        <div class="field is-grouped">
          <p class="control">
            <input
              class="input"
              placeholder="Utilisateur"
              ref="username"
              type="text"
            />
          </p>
          <p class="control">
            <button class="button is-primary" title="(ou faire Enter)">
              Ajouter
            </button>
          </p>
          <p class="control">
            <button class="button is-warning" onClick="{addUsers}">
              Avec ses <i>follows</i>
            </button>
          </p>
          <p class="control">
            <button
              class="button is-danger"
              if="{nNodes}"
              type="button"
              onClick="{resetGraph}"
            >
              Effacer le graphe
            </button>
          </p>
        </div>
      </form>

      <form onSubmit="{addLocation}">
        <div class="field is-grouped">
          <p class="control">
            <input
              class="input"
              placeholder="Lieu"
              ref="location"
              type="text"
            />
          </p>
          <p class="control">
            <button
              if="{locations && locations.length}"
              class="button is-danger"
              type="button"
              onClick="{resetLocations}"
            >
              Effacer les lieux
            </button>
          </p>
        </div>
      </form>

      <div class="field">
        <div class="control">
          <label class="label">
            Affichage léger
            <input
              class="checkbox"
              checked
              onChange="{toggleLight}"
              type="checkbox"
              ref="light"
            />
          </label>
        </div>
      </div>
    </div>
    <div class="column is-one-third">
      <div class="notification is-danger" if="{error}">
        <button onClick="{clearError}" class="delete"></button>
        <p>
          {error}
        </p>
      </div>

      <div class="tags" if="{locations && locations.length}">
        <span class="tag is-info">Lieux:</span>
        <span each="{t, i in locations}" key="{i}" class="tag is-rounded">
          {t}
        </span>
      </div>

      <p>
        <b>Nombre d'utilisateurs:</b> {nNodes}<br />
        <b>Nombre de liens:</b> {nLinks}<br />
        <virtual if="{rateLimit}">
          <b>Requêtes disponibles:</b> {rateLimit.remaining}<br />
          <i>Reset</i> dans environ {new Date(Date.parse(rateLimit.resetAt) -
          Date.now()).getUTCMinutes()} minutes
        </virtual>
      </p>
    </div>
  </div>

  <script>
    this.locations = ['québec', 'quebec', 'qc']
    this.hereRe = new RegExp(
      this.locations && this.locations.length
        ? `(${this.locations.join('|')})`
        : ''
    )

    this.light = true
    this.error = false
    this.nNodes = 0
    this.nLinks = 0

    const name = window.location.hash.slice(1)
    if (name) {
      this.fetchOne(name, this.hereRe)
        .then(() => this.update({ error: false }))
        .catch((e) => this.update({ error: e }))
    }

    clearError() {
      this.update({ error: false })
    }

    toggleLight() {
      this.light = this.refs.light.checked
    }

    resetLocations(ev) {
      this.update({
        locations: false,
        hereRe: /()/
      })
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
      this.update({
        locations: this.uniq(this.locations),
        hereRe: new RegExp(`(${this.locations.join('|')})`)
      })
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
        .then(() => this.update({ error: false }))
        .catch((e) => this.update({ error: e }))
    }

    addUser(ev) {
      ev.preventDefault()
      const val = this.refs.username.value.trim()
      if (!val) return
      this.refs.username.value = ''
      this.fetchOne(val, this.hereRe)
        .then(() => this.update({ error: false }))
        .catch((e) => this.update({ error: e }))
    }

    const i = setInterval(() => {
      const on = this.nNodes
      const ol = this.nLinks
      this.nNodes = this.opts.dataNodes.length
      this.nLinks = this.opts.dataLinks.length
      if (on !== this.nNodes || ol !== this.nLinks) this.update()
    }, 500)
  </script>

  <style>
    .tags:not(:last-child) {
      margin-bottom: 0;
    }
  </style>
</app>
