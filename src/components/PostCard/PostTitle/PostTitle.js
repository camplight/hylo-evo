import React from 'react'
import Highlight from 'components/Highlight'
import cx from 'classnames'
import './PostTitle.scss'

export default function PostTitle ({
  title,
  constrained,
  highlightProps,
  locationObject,
  location
}) {
  // Formatting location to display in stream view
  let generalLocation = location || ''

  if (locationObject) {
    if (locationObject.addressNumber !== null && locationObject.addressNumber !== '') {
      generalLocation = `${locationObject.addressNumber} ${locationObject.addressStreet}, ${locationObject.city}, ${locationObject.region}`
    } else {
      generalLocation = `${locationObject.city}, ${locationObject.region}`
    }
  }

  return <Highlight {...highlightProps}>
    <React.Fragment>
      <div styleName={cx('title', { constrained })} className='hdr-headline'>{title}</div>
      {location && <div styleName={cx('headerLocation', { constrained })}><span styleName='locationIcon'><img src='/location-pin-stream.svg' /></span>{generalLocation}</div>}
    </React.Fragment>
  </Highlight>
}
