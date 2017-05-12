import { connect } from 'react-redux'

import getQueryParam from 'store/selectors/getQueryParam'

import {
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchRecentContacts,
  fetchPeople,
  contactsSelector,
  findOrCreateThread,
  matchesSelector,
  participantsSelector,
  recentContactsSelector,
  setAutocomplete
} from './PeopleSelector.store'
import changeQueryParam from 'store/actions/changeQueryParam'

export function getParticipantSearch (props, participantsFromStore) {
  const participants = getQueryParam('participants', null, props)
  if (participants) {
    return participants
      .split(',')
      .filter(p => !participantsFromStore.find(participant => p === participant))
  }
  return null
}

export function mapStateToProps (state, props) {
  const participants = participantsSelector(state, props)
  return {
    autocomplete: state.autocomplete,
    contacts: contactsSelector(state),
    matches: matchesSelector(state),
    participants,
    participantSearch: getParticipantSearch(props, participants),
    recentContacts: recentContactsSelector(state)
  }
}

export const mapDispatchToProps = {
  addParticipant,
  removeParticipant,
  changeQueryParam,
  fetchContacts,
  fetchRecentContacts,
  fetchPeople,
  setAutocomplete,
  findOrCreateThread
}

export default connect(mapStateToProps, mapDispatchToProps)
