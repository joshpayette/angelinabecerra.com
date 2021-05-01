import { GetStaticPropsContext } from 'next'
import * as React from 'react'
import fs from 'fs'
import { Gallery } from 'components/Gallery'

/**
 * Shape of the parsed JSON data for an order.json
 */
interface OrderConfig {
  images: string[]
}

export async function getStaticPaths() {
  const folders = [
    'event-photography',
    'fine-art',
    'photo-275-portfolio',
    'portrait-and-fashion',
    'pride-and-hope',
    'protest-and-unrest',
  ]

  const paths = folders
    .map((folder) => {
      const imageCount =
        fs.readdirSync(`./public/galleries/${folder}`)?.length ?? 0
      /** Add path for no slideIndex */
      const paths = [{ params: { folderName: folder, slideIndex: [] } }]
      /** Add path for each index */
      for (let i = 0; i < imageCount - 1; i++) {
        const slideIndex = [(i + 1).toString()]
        paths.push({
          params: { folderName: folder, slideIndex },
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
  const orderConfigPath = `./public/galleries/${folderName}/order.json`
  let imageList: string[] = []

  if (fs.existsSync(orderConfigPath)) {
    const orderConfig: OrderConfig = JSON.parse(
      fs.readFileSync(orderConfigPath, 'utf8')
    )
    imageList = orderConfig.images
  } else {
    imageList = fs.readdirSync(`./public/galleries/${folderName}`)
  }
  return {
    props: {
      folderName,
      imageList: imageList.map((image) => `/galleries/${folderName}/${image}`),
      slideIndex: slideIndex ?? null,
    },
  }
}

interface Props {
  folderName: string
  imageList: string[]
  slideIndex: string[]
}

export default function GalleryPage({
  folderName,
  imageList,
  slideIndex,
}: Props) {
  return (
    <Gallery
      folderName={folderName}
      gallery={{ images: imageList }}
      slideIndex={slideIndex}
    />
  )
}
