import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { get, pick } from 'lodash/fp'
import './MapFeed.scss'
import MapExplorer from 'components/MapExplorer'
import Loading from 'components/Loading'
import Button from 'components/Button'
import { bgImageStyle } from 'util/index'

export default class Feed extends Component {
  static propTypes = {
    newPost: PropTypes.func, // delay implementation MapFeed
    routeParams: PropTypes.object,
    querystringParams: PropTypes.object
  }

  static defaultProps = {
    routeParams: {},
    querystringParams: {}
  }

  componentDidMount () {
    const { routeParams, fetchTopic, fetchNetwork } = this.props
    const { networkSlug, topicName } = routeParams

    if (topicName) fetchTopic()
    if (networkSlug) fetchNetwork()
  }

  componentDidUpdate (prevProps) {
    const { routeParams, fetchTopic, fetchNetwork } = this.props
    const { slug, topicName, networkSlug } = routeParams
    const topicChanged = topicName && get('routeParams.topicName', prevProps) !== topicName
    const slugChanged = slug && get('routeParams.slug', prevProps) !== slug
    if (topicChanged || (topicName && slugChanged)) fetchTopic()
    if (networkSlug && networkSlug !== prevProps.routeParams.networkSlug) fetchNetwork()
  }

  getFeedProps () {
    const { routeParams, querystringParams } = this.props
    const { slug, networkSlug } = routeParams

    var subject
    if (slug) {
      subject = 'community'
    } else if (networkSlug) {
      subject = 'network'
    } else {
      subject = 'all-communities'
    }

    return {
      subject,
      routeParams,
      querystringParams,
      topic: get('id', this.props.topic),
      ...pick([
        'postTypeFilter',
        'sortBy',
        'changeSort',
        'changeTab',
        'selectedPostId'
      ], this.props)
    }
  }

  render () {
    const {
      routeParams, topic, community, currentUser,
      communityTopic, currentUserHasMemberships,
      goToCreateCommunity, membershipsPending
    } = this.props
    const { topicName } = routeParams

    if (topicName && !topic) return <Loading />
    if (community && topicName && !communityTopic) return <Loading />
    if (!currentUser) return <Loading />
    if (membershipsPending) return <Loading />

    return <React.Fragment>
      {currentUserHasMemberships && <MapExplorer {...this.getFeedProps()} />}
      {!membershipsPending && !currentUserHasMemberships && <CreateCommunityPrompt
        goToCreateCommunity={goToCreateCommunity}
      />}
      {membershipsPending && <Loading />}
    </React.Fragment>
  }
}

export function CreateCommunityPrompt ({ goToCreateCommunity }) {
  return <div styleName='create-community-prompt'>
    <p>There's no posts yet, try starting a community!</p>
    <Button
      styleName='button'
      label='Create a Community'
      onClick={goToCreateCommunity}
    />
    <div style={bgImageStyle('/assets/hey-axolotl.png')} styleName='sidebar-image' />
  </div>
}