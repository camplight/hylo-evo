import { FETCH_JOIN_REQUESTS } from 'store/constants'
import fetchJoinRequestsQuery from 'graphql/queries/fetchJoinRequestsQuery'

export const MODULE_NAME = 'CommunityDetail'
export const CREATE_JOIN_REQUEST = `${MODULE_NAME}/CREATE_JOIN_REQUEST`
export const CREATE_JOIN_REQUEST_PENDING = `${MODULE_NAME}/CREATE_JOIN_REQUEST_PENDING`

export const JOIN_COMMUNITY = `${MODULE_NAME}/JOIN_COMMUNITY`
export const JOIN_COMMUNITY_PENDING = `${MODULE_NAME}/JOIN_COMMUNITY_PENDING`

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, payload, type } = action
  if (error) return state
  switch (type) {
    case FETCH_JOIN_REQUESTS:
      const requests = payload.data.joinRequests.items || []
      return requests.filter(r => r.status === 0)
    default:
      return state
  }
}

export function fetchJoinRequests (communityId) {
  return {
    type: FETCH_JOIN_REQUESTS,
    graphql: {
      query: fetchJoinRequestsQuery,
      variables: { communityId }
    },
    meta: {
      communityId
    }
  }
}

export function joinCommunity (communityId, userId) {
  return {
    type: JOIN_COMMUNITY,
    graphql: {
      query: `mutation ($communityId: ID, $userId: ID) {
        joinCommunity(communityId: $communityId, userId: $userId) {
          membership {
            id
            role
            community {
              id
              name
              slug
            }
          }
          error
        }
      }`,
      variables: {
        communityId,
        userId
      }
    },
    meta: {
      communityId,
      optimistic: true
    }
  }
}

export function createJoinRequest (communityId, userId) {
  return {
    type: CREATE_JOIN_REQUEST,
    graphql: {
      query: `mutation ($communityId: ID, $userId: ID) {
        createJoinRequest(communityId: $communityId, userId: $userId) {
          request {
            id
            user {
              id
            }
            community {
              id
            }
            createdAt
            updatedAt
            status
          }
        }
      }`,
      variables: { communityId, userId }
    },
    meta: {
      communityId,
      optimistic: true
    }
  }
}
