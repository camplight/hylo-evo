import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { removePostFromUrl, editPostUrl } from 'util/navigation'
import getMe from 'store/selectors/getMe'
import {
  deletePost,
  fulfillPost,
  removePost,
  pinPost,
  getCommunity
} from './PostHeader.store'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, props)

  return {
    currentUser: getMe(state, props),
    community
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { slug } = props.routeParams
  const closeUrl = removePostFromUrl(window.location.pathname)
  const isPublic = window.location.pathname.includes('public')
  const deletePostWithConfirm = postId => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId))
        .then(() => dispatch(push(closeUrl)))
    }
  }

  const opts = Object.assign(props.routeParams, {
    context: isPublic && 'public'
  })

  return {
    editPost: postId => props.editPost
      ? props.editPost(postId)
      : dispatch(push(editPostUrl(postId, opts))),
    deletePost: postId => props.deletePost
      ? props.deletePost(postId)
      : deletePostWithConfirm(postId),
    fulfillPost: postId => props.fulfillPost
      ? props.fulfillPost(postId)
      : dispatch(fulfillPost(postId)),
    removePost: postId => props.removePost
      ? props.removePost(postId)
      : dispatch(removePost(postId, slug)),
    pinPost: (postId, communityId) => props.pinPost
      ? props.pinPost(postId)
      : dispatch(pinPost(postId, communityId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, community } = stateProps
  const { id, creator } = ownProps
  const { deletePost, editPost, fulfillPost, removePost, pinPost } = dispatchProps
  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: isCreator ? () => deletePost(id) : undefined,
    editPost: canEdit ? () => editPost(id) : undefined,
    fulfillPost: isCreator ? () => fulfillPost(id) : undefined,
    canFlag: !isCreator,
    pinPost: canModerate && community ? () => pinPost(id, community.id) : undefined,
    removePost: !isCreator && canModerate ? () => removePost(id) : undefined,
    canEdit
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
