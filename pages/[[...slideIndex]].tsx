import { Gallery } from 'components/gallery'
import * as React from 'react'
import { useRouter } from 'next/router'
import { GalleryConfig } from 'components/gallery/Gallery'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    height: `calc(100% - ${theme.mixins.toolbar.minHeight}px - 20px)`,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    main: {
      width: '100%',
      height: `calc(100% - 75px)`,
    },
  },
}))

const imageList: GalleryConfig = {
  images: [
    { filename: '/galleries/protest-and-unrest/1.JPG' },
    { filename: '/galleries/protest-and-unrest/4.JPG' },
    { filename: '/galleries/protest-and-unrest/2.JPG' },
    { filename: '/galleries/protest-and-unrest/3.JPG' },
    { filename: '/galleries/protest-and-unrest/7.JPG' },
    {
      filename: '/galleries/protest-and-unrest/6.JPG',
      backgroundPosition: 'center bottom',
    },
    { filename: '/galleries/protest-and-unrest/5.JPG' },
    { filename: '/galleries/protest-and-unrest/8.JPG' },
    { filename: '/galleries/covid/1.jpg' },
    { filename: '/galleries/covid/10.jpg' },
    { filename: '/galleries/pride-and-hope/5.JPG' },
    { filename: '/galleries/pride-and-hope/1.JPG' },
    { filename: '/galleries/pride-and-hope/10.JPG' },
    { filename: '/galleries/pride-and-hope/8.JPG' },
    { filename: '/galleries/pride-and-hope/7.JPG' },
    { filename: '/galleries/pride-and-hope/6.JPG' },
    { filename: '/galleries/pride-and-hope/2.JPG' },
    { filename: '/galleries/pride-and-hope/12.JPG' },
    { filename: '/galleries/pride-and-hope/26.JPG' },
    { filename: '/galleries/pride-and-hope/25.JPG' },
    { filename: '/galleries/protest-and-unrest/21.JPG' },
    { filename: '/galleries/pride-and-hope/28.JPG' },
    { filename: '/galleries/pride-and-hope/31.JPG' },
    { filename: '/galleries/pride-and-hope/35.JPG' },
    { filename: '/galleries/pride-and-hope/32.JPG' },
    { filename: '/galleries/pride-and-hope/34.JPG' },
    { filename: '/galleries/pride-and-hope/33.JPG' },
    { filename: '/galleries/protest-and-unrest/44.jpg' },
    { filename: '/galleries/protest-and-unrest/40.jpg' },
    { filename: '/galleries/pride-and-hope/36.JPG' },
  ],
}

export default function HomePage() {
  const classes = useStyles()
  const router = useRouter()
  const { query } = router
  const slideIndexParam = query.slideIndex ?? null

  let slideIndex: string[]
  if (!slideIndexParam) {
    slideIndex = ['1']
  } else {
    slideIndex = Array.isArray(slideIndexParam)
      ? slideIndexParam
      : [slideIndexParam]
  }

  return (
    <main className={classes.main}>
      <Gallery
        folderName={null}
        galleryName="Main Portfolio"
        slideIndex={slideIndex}
        gallery={imageList}
      />
    </main>
  )
}
