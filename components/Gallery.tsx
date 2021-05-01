import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import gsap from 'gsap'
import Swipe from 'react-easy-swipe'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import clsx from 'clsx'
import { IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'

interface State {
  currentSlideIndex: number
  fgImageLoaded: boolean
  nextSlideIndex: number
  direction: 'prev' | 'next'
  status: 'exiting' | 'exited' | 'entering' | 'entered' | 'loading'
}
const initialState: State = {
  currentSlideIndex: 0,
  fgImageLoaded: false,
  nextSlideIndex: 0,
  direction: 'next',
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
      state.fgImageLoaded = false
    },
    slideEntering(state: State) {
      state.status = 'entering'
    },
    slideEntered(state: State) {
      state.status = 'entered'
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
  arrowLeft: {
    left: 0,
    justifyContent: 'flex-start',
  },
  arrowRight: {
    right: 0,
    justifyContent: 'flex-end',
  },
  arrowIcon: {
    width: '20px!important',
    height: '20px!important',
    [theme.breakpoints.up('md')]: {
      width: '40px!important',
      height: '40px!important',
    },
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    filter: 'blur(6px)',
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
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
    width: 'calc(100vw - 50px)',
    height: `calc(100vh - ${theme.spacing(6)}px - ${
      theme.mixins.toolbar.minHeight
    }px)`,
    position: 'relative',
    zIndex: 3,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100vw - 100px)',
      height: `calc(100vh - ${theme.spacing(10)}px - ${
        theme.mixins.toolbar.minHeight
      }px)`,
    },
    // backgroundColor: '#f00',
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    slide: {
      height: `calc(100vh - ${theme.spacing(2)}px - ${
        theme.mixins.toolbar.minHeight
      }px)`,
      marginTop: 0,
    },
  },
  slideImage: {
    border: `5px solid #fff`,
    position: 'absolute',
    maxHeight: '100%',
    maxWidth: '100%',
    boxShadow:
      '0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22)',
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
  folderName: string
  gallery: GalleryType
  slideIndex: string[]
}

export const Gallery = ({ folderName, gallery, slideIndex }: Props) => {
  const classes = useStyles()
  const router = useRouter()
  const slideIndexParam = slideIndex ? parseInt(slideIndex[0], 10) : 1
  const { reducer } = gallerySlice
  const {
    slideEntered,
    slideEntering,
    slideExited,
    slideExiting,
    slideLoading,
    fgImageLoadComplete,
  } = gallerySlice.actions

  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentSlideIndex: slideIndexParam - 1 ?? 0,
  })
  const { currentSlideIndex, fgImageLoaded, direction, status } = state
  const { images } = gallery

  const bgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const bgImageEl = bgImageWrapperRef.current?.firstChild
    ?.childNodes[0] as HTMLImageElement

  const fgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const fgImageRef: React.RefObject<HTMLImageElement> = React.useRef()

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
            duration: 0.2,
          }
        )
        break
      }
      case 'exited': {
        dispatch(slideLoading())
        if (folderName) {
          router.push(
            `/gallery/${folderName}/${currentSlideIndex + 1}`,
            undefined,
            {
              shallow: true,
            }
          )
        }
        break
      }
      case 'loading': {
        if (fgImageLoaded) {
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
            duration: 0.2,
            onComplete() {
              dispatch(slideEntered())
            },
          }
        )
        gsap.fromTo(
          bgImageWrapperRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 }
        )
      }
    }
  }, [
    bgImageEl,
    fgImageLoaded,
    direction,
    fgImageRef,
    status,
    slideExited,
    slideLoading,
    slideEntering,
    slideEntered,
    currentSlideIndex,
    folderName,
    router,
  ])

  return (
    <Swipe onSwipeLeft={() => nextSlide()} onSwipeRight={() => previousSlide()}>
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
        <div
          className={classes.bgImage}
          style={{
            backgroundImage: `url(${images[currentSlideIndex]})`,
          }}
        />
      </div>
      <div className={classes.mask} />
      <div className={classes.track}>
        <div className={classes.slide} ref={fgImageWrapperRef}>
          <img
            src={images[currentSlideIndex]}
            className={classes.slideImage}
            ref={fgImageRef}
            onLoad={() => dispatch(fgImageLoadComplete())}
          />
        </div>
      </div>
    </Swipe>
  )
}
