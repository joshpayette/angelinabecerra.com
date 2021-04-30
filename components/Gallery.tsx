import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Image from 'next/image'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import gsap from 'gsap'

interface State {
  currentSlideIndex: number
  nextSlideIndex: number
  direction: 'prev' | 'next'
  status: 'exiting' | 'exited' | 'entering' | 'entered' | 'loading'
}
const initialState: State = {
  currentSlideIndex: 0,
  nextSlideIndex: null,
  direction: null,
  status: 'entered',
}
const gallerySlice = createSlice({
  name: 'gallerySlice',
  initialState,
  reducers: {
    slideExiting(
      state: State,
      action: PayloadAction<{
        direction: 'prev' | 'next'
        galleryLength: number
      }>
    ) {
      state.status = 'exiting'
      switch (action.payload.direction) {
        case 'prev':
          if (state.currentSlideIndex === 0) {
            state.nextSlideIndex = action.payload.galleryLength - 1
            return
          }
          state.nextSlideIndex = state.currentSlideIndex - 1
          break
        case 'next':
          if (state.currentSlideIndex === action.payload.galleryLength - 1) {
            state.nextSlideIndex = 0
            return
          }
          state.nextSlideIndex = state.currentSlideIndex + 1
          break
      }
    },
    slideExited(state: State) {
      state.status = 'exited'
      state.currentSlideIndex = state.nextSlideIndex
      state.nextSlideIndex = null
    },
    slideLoading(state: State) {
      state.status = 'loading'
    },
    slideEntering(state: State) {
      state.status = 'entering'
    },
    slideEntered(state: State) {
      state.status = 'entered'
    },
  },
})

const useStyles = makeStyles((theme) => ({
  bgWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    opacity: 0.2,
    zIndex: 1,
    filter: 'blur(6px)',
  },
  fgWrapper: {
    width: '100%',
    height: `calc(100% - ${theme.spacing(1)}px)`,
    position: 'relative',
    zIndex: 2,
  },
}))

export interface GalleryType {
  images: string[]
}

interface Props {
  gallery: GalleryType
}

export const Gallery = ({ gallery }: Props) => {
  const classes = useStyles()

  const { reducer } = gallerySlice
  const {
    slideEntered,
    slideEntering,
    slideExited,
    slideExiting,
    slideLoading,
  } = gallerySlice.actions
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const { currentSlideIndex, nextSlideIndex, direction, status } = state
  const { images } = gallery

  const bgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const bgImageEl = bgImageWrapperRef.current?.firstChild
    ?.childNodes[0] as HTMLImageElement
  const fgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const fgImageEl = fgImageWrapperRef.current?.firstChild
    ?.childNodes[0] as HTMLImageElement

  const previousSlide = React.useCallback(() => {
    console.info('dispatch previousSlide')
    dispatch(slideExiting({ direction: 'prev', galleryLength: images.length }))
  }, [images.length, slideExiting])

  const nextSlide = React.useCallback(() => {
    console.info('dispatch nextSlide')
    dispatch(slideExiting({ direction: 'next', galleryLength: images.length }))
  }, [images.length, slideExiting])

  /**
   * Event listeners
   */
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const handleArrowKeyPressed = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          previousSlide()
          break
        case 'ArrowRight':
          nextSlide()
          break
        default:
          return
      }
    }
    window.addEventListener('keydown', handleArrowKeyPressed)
    process.env.NODE_ENV === 'production' &&
      window.addEventListener('contextmenu', (e) => e.preventDefault())
    return () => {
      window.removeEventListener('keydown', handleArrowKeyPressed)
      process.env.NODE_ENV === 'production' &&
        window.removeEventListener('contextmenu', (e) => e.preventDefault())
    }
  }, [nextSlide, previousSlide])

  /**
   * Manage animation states
   */
  React.useEffect(() => {
    if (!fgImageEl) {
      console.info('exiting useEffect, no fgImageEl found.')
      return
    }
    switch (status) {
      case 'exiting': {
        gsap.to(fgImageEl, {
          x: direction === 'prev' ? '-100vw' : '100vw',
          onComplete() {
            dispatch(slideExited())
          },
        })
        break
      }
    }
  }, [direction, fgImageEl, status, slideExited])

  return (
    <React.Fragment>
      <div className={classes.bgWrapper} ref={bgImageWrapperRef}>
        <Image
          src={images[currentSlideIndex]}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality="10"
        />
      </div>
      <div className={classes.fgWrapper} ref={fgImageWrapperRef}>
        <Image
          src={images[currentSlideIndex]}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          quality="100"
          priority
        />
      </div>
    </React.Fragment>
  )
}
