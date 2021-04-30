import { GetStaticPropsContext } from 'next'
import * as React from 'react'
import fs from 'fs'
import { Gallery } from 'components/Gallery'

export async function getStaticPaths() {
  return {
    paths: [{ params: { folderName: 'event-photography' } }],
    fallback: false,
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { folderName } = params
  const imageList = fs.readdirSync(`./public/galleries/${folderName}`)

  return {
    props: {
      imageList: imageList.map((image) => `/galleries/${folderName}/${image}`),
    },
  }
}

interface Props {
  imageList: string[]
}

export default function GalleryPage({ imageList }: Props) {
  return <Gallery gallery={{ images: imageList }} />
}
