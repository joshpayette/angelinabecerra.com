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
  nextSlideIndex: 0,
  direction: 'next',
  status: 'loading',
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
    top: `calc((100vh - ${theme.mixins.toolbar.minHeight}px) / 2)`,
    transform: 'translateY(50%)',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    width: '40px!important',
    height: '40px!important',
  },
  arrowIcon: {
    width: '20px!important',
    height: '20px!important',
    [theme.breakpoints.up('md')]: {
      width: '40px!important',
      height: '40px!important',
    },
  },
  arrowLeft: {
    left: 0,
    justifyContent: 'flex-start',
  },
  arrowRight: {
    right: 0,
    justifyContent: 'flex-end',
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    filter: 'blur(6px)',
  },
  iconButton: {
    padding: 0,
    margin: theme.spacing(1),
  },
  mask: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  slide: {
    width: 'calc(100vw - 100px)',
    height: `calc(100vh - ${theme.spacing(12)}px - ${
      theme.mixins.toolbar.minHeight
    }px)`,
    position: 'relative',
    zIndex: 3,
    padding: theme.spacing(2),
    // backgroundColor: '#f00',
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    slide: {
      height: `calc(100vh - ${theme.spacing(6)}px - ${
        theme.mixins.toolbar.minHeight
      }px)`,
    },
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
    zIndex: 4,
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
    if (!fgImageWrapperRef.current || !bgImageWrapperRef.current) {
      return
    }
    switch (status) {
      case 'exiting': {
        gsap.fromTo(
          fgImageWrapperRef.current,
          { x: 0 },
          {
            x: direction === 'prev' ? '100vw' : '-100vw',
            duration: 0.2,
            onComplete() {
              dispatch(slideExited())
            },
          }
        )
        gsap.fromTo(
          bgImageWrapperRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 1,
          }
        )
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
          fgImageWrapperRef.current,
          {
            x: direction === 'prev' ? '-100vw' : '100vw',
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            onComplete() {
              dispatch(slideEntered())
            },
          }
        )
        gsap.fromTo(
          bgImageWrapperRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        )
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
    <Swipe onSwipeLeft={() => nextSlide()} onSwipeRight={() => previousSlide()}>
      {status === 'loading' && (
        <div className={classes.loading}>
          <img src="/loading.svg" alt="Loading..." />
        </div>
      )}
      <IconButton
        onClick={() => previousSlide()}
        className={clsx(classes.arrow, classes.arrowLeft, classes.iconButton)}
        edge="start"
      >
        <ChevronLeft className={classes.arrowIcon} />
      </IconButton>
      <IconButton
        onClick={() => nextSlide()}
        className={clsx(classes.arrow, classes.arrowRight, classes.iconButton)}
        edge="end"
      >
        <ChevronRight className={classes.arrowIcon} />
      </IconButton>
      <div className={classes.background} ref={bgImageWrapperRef}>
        <Image
          src={images[currentSlideIndex]}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          onLoad={() => dispatch(bgImageLoadComplete())}
          quality="5"
        />
      </div>
      <div className={classes.mask} />
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
          />
        </div>
      </div>
    </Swipe>
  )
}
