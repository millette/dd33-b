<app>
  <p>
    nNodes: {nNodes}<br />
    nLinks: {nLinks}<br />
  </p>

  <script>
    this.nNodes = 0
    this.nLinks = 0

    const i = setInterval(() => {
      const on = this.nNodes
      const ol = this.nLinks
      this.nNodes = this.opts.dataNodes.length
      this.nLinks = this.opts.dataLinks.length
      if (on !== this.nNodes || ol !== this.nLinks) this.update()
    }, 500)

    // setTimeout(() => clearInterval(i), 15000)
  </script>
</app>
