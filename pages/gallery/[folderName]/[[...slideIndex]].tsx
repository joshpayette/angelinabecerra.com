import { GetStaticPropsContext } from 'next'
import * as React from 'react'
import fs from 'fs'
import { Gallery } from 'components/gallery'
import { GalleryConfig } from 'components/gallery/Gallery'

const galleries = [
  { folder: 'event-photography', name: 'Event Photography' },
  { folder: 'fine-art', name: 'Fine Art' },
  { folder: 'photo-275-portfolio', name: 'Photo 275 Portfolio' },
  { folder: 'portrait-and-fashion', name: 'Portrait & Fashion' },
  { folder: 'pride-and-hope', name: 'Pride & Hope' },
  { folder: 'protest-and-unrest', name: 'Protest & Unrest' },
]

export async function getStaticPaths() {
  const paths = galleries
    .map((gallery) => {
      if (!gallery.name) {
        console.info('gallery error', gallery)
      }
      const imageCount =
        fs.readdirSync(`./public/galleries/${gallery.folder}`)?.length ?? 0
      /** Add path for no slideIndex */
      const paths = [
        {
          params: {
            folderName: gallery.folder,
            slideIndex: [],
          },
        },
      ]
      /** Add path for each index */
      for (let i = 0; i < imageCount - 1; i++) {
        const slideIndex = [(i + 1).toString()]
        paths.push({
          params: {
            folderName: gallery.folder,
            slideIndex,
          },
        })
      }
      return paths
    })
    .flat()

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { folderName, slideIndex } = params
  const galleryConfigPath = `./public/galleries/${folderName}/config.json`
  let imageList: GalleryConfig['images'] = []

  if (fs.existsSync(galleryConfigPath)) {
    const galleryConfig: GalleryConfig = JSON.parse(
      fs.readFileSync(galleryConfigPath, 'utf8')
    )
    imageList = galleryConfig.images
  } else {
    imageList = fs
      .readdirSync(`./public/galleries/${folderName}`)
      .map((row) => {
        return {
          filename: row,
        }
      })
  }
  return {
    props: {
      folderName,
      imageList: imageList.map((image) => {
        return {
          ...image,
          filename: `/galleries/${folderName}/${image.filename}`,
        }
      }),
      slideIndex: slideIndex ?? null,
    },
  }
}

interface Props {
  folderName: string
  imageList: GalleryConfig['images']
  slideIndex: string[]
}

export default function GalleryPage({
  folderName,
  imageList,
  slideIndex,
}: Props) {
  const galleryName = galleries.find((gallery) => gallery.folder === folderName)
    .name
  return (
    <Gallery
      folderName={folderName}
      galleryName={galleryName}
      gallery={{ images: imageList }}
      slideIndex={slideIndex}
    />
  )
}
