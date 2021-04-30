import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Image from 'next/image'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import gsap from 'gsap'
import Swipe from 'react-easy-swipe'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import clsx from 'clsx'
import { IconButton } from '@material-ui/core'

interface State {
  currentSlideIndex: number
  bgImageLoaded: boolean
  fgImageLoaded: boolean
  nextSlideIndex: number
  direction: 'prev' | 'next'
  status: 'exiting' | 'exited' | 'entering' | 'entered' | 'loading'
}
const initialState: State = {
  currentSlideIndex: 0,
  bgImageLoaded: false,
  fgImageLoaded: false,
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
      state.direction = action.payload.direction
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
      state.bgImageLoaded = false
      state.fgImageLoaded = false
    },
    slideEntering(state: State) {
      state.status = 'entering'
    },
    slideEntered(state: State) {
      state.status = 'entered'
    },
    bgImageLoadComplete(state) {
      state.bgImageLoaded = true
    },
    fgImageLoadComplete(state) {
      state.fgImageLoaded = true
    },
  },
})

const useStyles = makeStyles((theme) => ({
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 5,
  },
  arrowLeft: {
    left: 0,
  },
  arrowRight: {
    right: 0,
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    opacity: 0.2,
    zIndex: 1,
    filter: 'blur(6px)',
  },
  slide: {
    width: 'calc(100vw - 80px)',
    height: `calc(100vh - ${theme.spacing(6)}px - ${
      theme.mixins.toolbar.minHeight
    }px)`,
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing(2),
    // backgroundColor: '#f00',
  },
  slideImage: {
    filter: `
      drop-shadow(0 -5px 0 #fff)
      drop-shadow(0 5px 0 #fff)
      drop-shadow(-5px 0 0 #fff)
      drop-shadow(5px 0 0 #fff)`,
  },
  loading: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
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
    bgImageLoadComplete,
    fgImageLoadComplete,
  } = gallerySlice.actions

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {
    currentSlideIndex,
    bgImageLoaded,
    fgImageLoaded,
    direction,
    status,
  } = state
  const { images } = gallery

  const bgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const bgImageEl = bgImageWrapperRef.current?.firstChild
    ?.childNodes[0] as HTMLImageElement

  const fgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const fgImageEl = fgImageWrapperRef.current?.firstChild
    ?.childNodes[0] as HTMLImageElement

  /**
   * Remove overflow from next/image wrapper div
   * Necessary to get the white border around image to show
   */
  React.useEffect(() => {
    const fgImageWrapperEl = fgImageWrapperRef.current
      ?.firstChild as HTMLDivElement
    if (fgImageWrapperEl) {
      fgImageWrapperEl.style.cssText = fgImageWrapperEl.style.cssText.replace(
        'overflow: hidden',
        ''
      )
    }
  }, [])

  const previousSlide = React.useCallback(() => {
    dispatch(slideExiting({ direction: 'prev', galleryLength: images.length }))
  }, [images.length, slideExiting])
  const nextSlide = React.useCallback(() => {
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
          x: direction === 'prev' ? '100vw' : '-100vw',
          onComplete() {
            dispatch(slideExited())
          },
        })
        gsap.to(bgImageEl, { opacity: 0, duration: 1 })
        break
      }
      case 'exited': {
        dispatch(slideLoading())
        break
      }
      case 'loading': {
        if (bgImageLoaded && fgImageLoaded) {
          dispatch(slideEntering())
        }
        break
      }
      case 'entering': {
        gsap.fromTo(
          fgImageEl,
          {
            x: direction === 'prev' ? '-100vw' : '100vw',
          },
          {
            x: 0,
            duration: 0.4,
            onComplete() {
              dispatch(slideEntered())
            },
          }
        )
        gsap.fromTo(bgImageEl, { opacity: 0 }, { opacity: 1, duration: 1 })
      }
    }
  }, [
    bgImageEl,
    bgImageLoaded,
    fgImageLoaded,
    direction,
    fgImageEl,
    status,
    slideExited,
    slideLoading,
    slideEntering,
    slideEntered,
  ])

  return (
    <React.Fragment>
      {status === 'loading' && (
        <div className={classes.loading}>
          <img src="/loading.svg" alt="Loading..." />
        </div>
      )}
      <IconButton
        onClick={() => previousSlide()}
        className={clsx(classes.arrow, classes.arrowLeft)}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={() => previousSlide()}
        className={clsx(classes.arrow, classes.arrowRight)}
      >
        <ChevronRight />
      </IconButton>
      <div className={classes.background} ref={bgImageWrapperRef}>
        <Image
          src={images[currentSlideIndex]}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          onLoad={() => dispatch(bgImageLoadComplete())}
          quality="10"
        />
      </div>
      <Swipe
        onSwipeLeft={() => nextSlide()}
        onSwipeRight={() => previousSlide()}
      >
        <div className={classes.track}>
          <div className={classes.slide} ref={fgImageWrapperRef}>
            <Image
              src={images[currentSlideIndex]}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              quality="100"
              className={classes.slideImage}
              onLoad={() => dispatch(fgImageLoadComplete())}
              priority
            />
          </div>
        </div>
      </Swipe>
    </React.Fragment>
  )
}
