import gql from 'graphql-tag'
import { get } from 'lodash/fp'
import { connect as hcWebClientConnect } from '@holochain/hc-web-client'

let holochainClient

async function initAndGetHolochainClient () {
  if (!holochainClient) {
    holochainClient = await hcWebClientConnect(process.env.HOLOCHAIN_WEBSOCKET_URI)
  }
  return holochainClient
}

export function createResultFetcher (instance, zome, fun) {
  return async (args = {}) => {
    await initAndGetHolochainClient()
    const rawResult = holochainClient.callZome(instance, zome, fun)(args)
    const jsonResult = JSON.parse(rawResult)
    const error = get('Err', jsonResult)
    const ok = get('Ok', jsonResult)

    return { ok, error }
  }
}

// * HOW TO CREATE LOCAL RESOLVERS
// https://www.apollographql.com/docs/link/links/state
export const resolvers = {
  Mutation: {},
  Query: {
    async MessageThreads (_, { testVariable }, context) {
      const fetchResults = createResultFetcher('hylo-chat', 'chat', 'get_my_threads')
      console.log('!!!! here:', fetchResults)
      const { ok, error } = await fetchResults()

      console.log('!!!! ok:', ok, error)

      return null
    }
  }
}

export default resolvers

export const typeDefs = gql`
  extend type Query {
    MessageThreads(testVariable: String!): [MessageThread]
  }

  extend type MessageThread {
    id: ID
    createdAt: String
    updatedAt: String
    participants(first: Int, cursor: ID, order: String): [Person]
    participantsTotal: Int
    messages(first: Int, cursor: ID, order: String): MessageQuerySet
  }

  extend type MessageQuerySet {
    total: Int
    hasMore: Boolean
    items: [Message]
  }

  extend type Person {
    id: ID
    name: String
    avatarUrl: String
  }
`
