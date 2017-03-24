export default function transform (entity) {
  // Functions taking the value to modify as a single argument.
  // Note that most of these need to happen _after_ relations have already
  // been processed in `transformMiddleware`.
  const transforms = {
    creator: creator => creator.id,
    followers: followers => followers.map(f => f.id),
    communities: communities => communities.map(c => c.id),
    comments: comments => comments.map(c => c.id)
  }

  const transformed = {
    ...entity
  }

  Object.keys(transforms).forEach(key => {
    if (entity[key] !== undefined) {
      transformed[key] = transforms[key](entity[key])
    }
  })

  return transformed
}
