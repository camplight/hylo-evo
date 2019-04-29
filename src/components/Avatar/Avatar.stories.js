import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Avatar from 'components/Avatar'

storiesOf('Avatar', module)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('Show', () =>
    <Avatar avatarUrl='https://avatars3.githubusercontent.com/u/5264862?s=40&v=4' url='anything' />
  )
