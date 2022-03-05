import {
  CameraAlt as CameraIcon,
  Photo as PhotoIcon,
  ContactMail as ContactIcon,
} from '@material-ui/icons'
import * as React from 'react'
import { SiteLinkType } from 'types'
import { Home as HomeIcon } from '@material-ui/icons'

export const siteLinks: SiteLinkType[] = [
  {
    icon: <HomeIcon />,
    label: 'Home',
    path: '/',
  },
  {
    icon: <CameraIcon />,
    label: 'About',
    path: '/about',
  },
  {
    icon: <PhotoIcon />,
    label: 'Portfolio',
    childLinks: [
      {
        label: 'Event Photography',
        path: '/gallery/event-photography',
      },
      {
        label: 'Fine Art',
        path: '/gallery/fine-art',
      },
      {
        label: 'Portrait & Fashion',
        path: '/gallery/portrait-and-fashion',
      },
      {
        label: 'Pride & Hope',
        path: '/gallery/pride-and-hope',
      },
      {
        label: 'Protest & Unrest',
        path: '/gallery/protest-and-unrest',
      },
    ],
  },
  {
    icon: <ContactIcon />,
    label: 'Contact',
    path: '/contact',
  },
]
