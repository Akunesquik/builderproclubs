const images = import.meta.glob(
  '../img/archetypes/*.{png,jpg,jpeg,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
)

const archetypeImages = Object.fromEntries(
  Object.entries(images).map(([path, url]) => {
    const nom = path.split('/').pop().split('.')[0]
    return [nom, url]
  })
)

export default archetypeImages