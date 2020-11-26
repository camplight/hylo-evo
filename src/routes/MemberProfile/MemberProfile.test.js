import { shallow } from 'enzyme'
import React from 'react'
import denormalized from './MemberProfile.test.json'
import MemberProfile, { SocialButtons } from './MemberProfile'

describe('MemberProfile', () => {
  const defaultTestProps = {
    routeParams: { personId: '1' },
    currentUser: denormalized.data.currentUser,
    person: denormalized.data.person,
    fetchPerson: jest.fn()
  }

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(<MemberProfile {...defaultTestProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays an error if one is present', () => {
    const props = {
      ...defaultTestProps,
      error: 'WOMBAT-TYPE INVALID'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('Error')).toBe(true)
  })

  it('displays bio on the Overview tab', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Overview',
      person: {
        ...defaultTestProps.person,
        bio: 'WOMBATS'
      }
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('WOMBATS')).toBe(true)
  })

  it('does not display bio on other tabs', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Upvotes',
      bio: 'WOMBATS',
      votes: []
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.contains('WOMBATS')).toBe(false)
  })

  it('renders RecentActivity on Overview', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Overview'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('RecentActivity')).toBe(true)
  })

  it('renders MemberPosts on Posts', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Posts'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('MemberPosts')).toBe(true)
  })

  it('renders MemberComments on Comments', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Comments'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('MemberComments')).toBe(true)
  })

  it('renders MemberVotes on Upvotes', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Upvotes'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('MemberVotes')).toBe(true)
  })
})
