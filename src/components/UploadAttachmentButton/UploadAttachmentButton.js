import React from 'react'
import Icon from 'components/Icon'
import './UploadAttachmentButton.scss'

export default function UploadAttachmentButton ({
  uploadAttachment,
  loading,
  className,
  children,
  disable
}) {
  const iconName = loading ? 'Clock' : 'AddImage'
  const onClick = loading || disable ? () => {} : uploadAttachment

  if (children) return <div onClick={onClick} className={className}>{children}</div>
  return <div styleName='button' onClick={onClick} className={className}>
    <Icon name={iconName} styleName='icon' />
  </div>
}