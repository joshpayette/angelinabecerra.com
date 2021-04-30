import { Gallery } from 'components/Gallery'
import * as React from 'react'

const imageList = [
  '/galleries/protest-and-unrest/1.JPG',
  '/galleries/protest-and-unrest/4.JPG',
  '/galleries/protest-and-unrest/2.JPG',
  '/galleries/protest-and-unrest/3.JPG',
  '/galleries/protest-and-unrest/7.JPG',
  '/galleries/protest-and-unrest/6.JPG',
  '/galleries/protest-and-unrest/5.JPG',
  '/galleries/protest-and-unrest/8.JPG',
  '/galleries/pride-and-hope/5.JPG',
  '/galleries/pride-and-hope/1.JPG',
  '/galleries/pride-and-hope/10.JPG',
  '/galleries/pride-and-hope/8.JPG',
  '/galleries/pride-and-hope/7.JPG',
  '/galleries/pride-and-hope/6.JPG',
  '/galleries/pride-and-hope/2.JPG',
  '/galleries/pride-and-hope/12.JPG',
  '/galleries/pride-and-hope/26.JPG',
  '/galleries/pride-and-hope/25.JPG',
  '/galleries/protest-and-unrest/21.JPG',
  '/galleries/pride-and-hope/28.JPG',
  '/galleries/pride-and-hope/31.JPG',
  '/galleries/pride-and-hope/35.JPG',
  '/galleries/pride-and-hope/32.JPG',
  '/galleries/pride-and-hope/34.JPG',
  '/galleries/pride-and-hope/33.JPG',
  '/galleries/protest-and-unrest/44.jpg',
  '/galleries/protest-and-unrest/40.jpg',
  '/galleries/pride-and-hope/36.JPG',
]

export default function HomePage() {
  return <Gallery gallery={{ images: imageList }} />
}
