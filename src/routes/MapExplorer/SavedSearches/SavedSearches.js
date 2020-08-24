import React, { useState } from 'react'

import { currentFilters, formatParams, formatParamPreview, generateViewParams } from 'util/searchParams'
import Icon from 'components/Icon'
import { info } from 'util/assets'
import styles from './SavedSearches.scss'
import ReactTooltip from 'react-tooltip'

function SavedSearches (props) {
  let {
    deleteSearch,
    filters,
    saveSearch,
    searches,
    toggle,
    viewSavedSearch
  } = props

  const [name, setName] = useState('')
  const triangleStyle = { right: 100 }

  const canSave = name.length

  return (
    <div styleName='container'>
      <span styleName='triangle' style={triangleStyle}>&nbsp;</span>
      <div styleName='innerContainer'>
        <div styleName='title'>
          <span>
          <h2>Save this view</h2>
          Get updates about this map view</span>
          <Icon name="Ex" styleName='close' onClick={toggle}/>
        </div>

        <div styleName='searchName'>
          <div styleName='searchBox'>
              <input
              type='text'
              onChange={e => setName(e.target.value)}
              placeholder='Name this view'
              value={name}
            />
            <span styleName={`save ${canSave ? '' :  'disabled'}`} onClick={canSave ? () => saveSearch(name) : undefined}>Save</span>
          </div>
          <div styleName='filters'><img src={info} />&nbsp;&nbsp;{currentFilters(filters)} </div>
        </div>
        
        <div styleName='savedViews'>
          <h2>Saved Views</h2>
          {searches.map((search, index) => {
            return (<SavedSearch key={index} search={search} deleteSearch={deleteSearch} viewSavedSearch={viewSavedSearch}/>)
          })}
        </div>
      </div>
    </div>
  )
}

const SavedSearch = ({ deleteSearch, viewSavedSearch, search }) => {
  const { name, count } = search;
  
  const { boundingBox, featureTypes, mapPath, networkSlug, searchText, slug, subject, topics } = generateViewParams(search)

  return (
    <div styleName='search'>
      <div styleName='row'>
        <div styleName='saved-name'>{name} {count && <span styleName='count'>{count}</span>} </div>
        <div styleName='actions'>
          <Icon name='Trash' styleName='delete' onClick={() => deleteSearch(search.id)}/>
          <div styleName='view' onClick={() => {
            viewSavedSearch({ boundingBox, featureTypes, networkSlug, search: searchText, slug, subject, topics }, mapPath)}
          }>View</div>
        </div>
      </div>
      <div styleName='row filters' data-tip={formatParams(search)} data-for='params'>
      <img src={info} /><span styleName='saved-filters'>
        <span>{formatParamPreview(search)}</span>
        <ReactTooltip place='right'
        id='params'
        effect='solid'
        multiline
        delayShow={200}
        styleName='params' />
        </span>
      </div>
    </div>
  )
}

export default SavedSearches
