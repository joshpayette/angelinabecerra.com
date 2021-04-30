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
  return {
    paths: [
      { params: { folderName: 'event-photography' } },
      { params: { folderName: 'fine-art' } },
      { params: { folderName: 'photo-275-portfolio' } },
      { params: { folderName: 'portrait-and-fashion' } },
      { params: { folderName: 'pride-and-hope' } },
      { params: { folderName: 'protest-and-unrest' } },
    ],
    fallback: false,
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { folderName } = params
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
