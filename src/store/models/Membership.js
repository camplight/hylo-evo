import { attr, fk, Model } from 'redux-orm'

export default class Membership extends Model {
  toString () {
    return `Membership: ${this.id}`
  }
}

Membership.modelName = 'Membership'
Membership.fields = {
  id: attr(),
  person: fk('Person'),
  community: fk('Community')
}
