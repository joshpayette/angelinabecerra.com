import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import gsap from 'gsap'
import Swipe from 'react-easy-swipe'
import {
  ChevronLeft,
  ChevronRight,
  PhotoAlbum as PhotoAlbumIcon,
} from '@material-ui/icons'
import clsx from 'clsx'
import { Button, Grid, IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useReduceMotion } from 'hooks/use-reduced-motion'
import { GalleryView } from './GalleryView'

/**
 * Shape of the parsed JSON data for a config.json
 */
export interface GalleryConfig {
  images: {
    filename: string
    backgroundPosition?:
      | 'left top'
      | 'left center'
      | 'left bottom'
      | 'right top'
      | 'right center'
      | 'right bottom'
      | 'center top'
      | 'center center'
      | 'center bottom'
  }[]
}

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
    initializeCurrentSlide(
      state: State,
      action: PayloadAction<{ slideIndex: number }>
    ) {
      state.currentSlideIndex = action.payload.slideIndex
    },
    goToSlide(state: State, action: PayloadAction<{ slideIndex: number }>) {
      state.nextSlideIndex = action.payload.slideIndex
      state.status = 'exiting'
    },
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
  actionsWrapper: {
    position: 'absolute',
    width: 'calc(100vw - 50px)',
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%)',
    zIndex: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      width: 'calc(100vw - 100px)',
    },
    // backgroundColor: '#0f0',
  },
  arrow: {
    display: 'flex',
    alignItems: 'center',
  },
  arrowLeft: {
    left: 0,
    justifyContent: 'flex-start',
  },
  arrowRight: {
    right: 0,
    justifyContent: 'flex-end',
  },
  arrowLeftWrapper: {
    justifyContent: 'flex-end',
  },
  arrowRightWrapper: {
    justifyContent: 'flex-start',
  },
  arrowIcon: {
    width: '40px!important',
    height: '40px!important',
  },
  backgroundWrapper: {
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
    marginTop: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100vw - 100px)',
      height: `calc(100vh - ${theme.spacing(10)}px - ${
        theme.mixins.toolbar.minHeight
      }px)`,
    },
    // backgroundColor: '#f00',
  },
  slideImage: {
    border: `5px solid #fff`,
    position: 'absolute',
    maxHeight: '100%',
    maxWidth: '100%',
    boxShadow:
      '0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22)',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    slide: {
      height: `calc(100vh - ${theme.spacing(6)}px - ${
        theme.mixins.toolbar.minHeight
      }px)`,
      marginTop: 0,
    },
    actionsWrapper: {
      position: 'absolute',
      left: 0,
      top: `calc(50% + 35px)`,
      width: 'auto',
      transform: 'translateY(-50%)',
      flexDirection: 'column',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    arrow: {
      margin: 0,
    },
    arrowLeftWrapper: {
      justifyContent: 'center',
    },
    arrowRightWrapper: {
      justifyContent: 'center',
    },
  },
}))

interface Props {
  folderName: string
  galleryName: string
  gallery: GalleryConfig
  slideIndex: string[]
}

export const Gallery = ({
  folderName,
  galleryName,
  gallery,
  slideIndex,
}: Props) => {
  const classes = useStyles()
  const router = useRouter()
  const prefersReducedMotion = useReduceMotion()

  const [galleryDialogOpen, setGalleryDialogOpen] = React.useState(false)
  const closeGalleryDialog = () => setGalleryDialogOpen(false)

  const slideIndexParam = slideIndex ? parseInt(slideIndex[0], 10) : 1
  const { images } = gallery

  const { reducer } = gallerySlice
  const {
    goToSlide,
    initializeCurrentSlide,
    slideEntered,
    slideEntering,
    slideExited,
    slideExiting,
    slideLoading,
    fgImageLoadComplete,
  } = gallerySlice.actions

  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    currentSlideIndex: slideIndexParam - 1,
  })
  const { currentSlideIndex, fgImageLoaded, direction, status } = state

  const bgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const bgImageEl = bgImageWrapperRef.current?.firstChild
    ?.childNodes[0] as HTMLImageElement

  const fgImageWrapperRef: React.RefObject<HTMLButtonElement> = React.useRef()
  const fgImageRef: React.RefObject<HTMLImageElement> = React.useRef()
  /**
   * Kicks off the previous slide transition
   */
  const previousSlide = React.useCallback(() => {
    if (status !== 'entered') {
      return
    }
    dispatch(slideExiting({ direction: 'prev', galleryLength: images.length }))
  }, [images.length, slideExiting, status])
  /**
   * Kicks off the next slide transition
   */
  const nextSlide = React.useCallback(() => {
    if (status !== 'entered') {
      return
    }
    dispatch(slideExiting({ direction: 'next', galleryLength: images.length }))
  }, [images.length, slideExiting, status])
  /**
   * Handles an image clicked in the GalleryView component
   */
  const onGridListTileClick = (slideIndex: number) => {
    if (slideIndex === currentSlideIndex) {
      setGalleryDialogOpen(false)
      return
    }
    dispatch(goToSlide({ slideIndex }))
  }
  /**
   * Initialize current slide based on prop
   */
  React.useEffect(() => {
    if (!slideIndexParam) {
      return
    }
    dispatch(initializeCurrentSlide({ slideIndex: slideIndexParam - 1 }))
  }, [slideIndexParam, initializeCurrentSlide])
  /**
   * Event listeners
   */
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const handleArrowKeyPressed = (event: KeyboardEvent) => {
      if (status !== 'entered') {
        return
      }
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
  }, [nextSlide, previousSlide, status])

  /**
   * Manage lifecycle states and animations
   */
  React.useEffect(() => {
    if (!fgImageWrapperRef.current || !bgImageWrapperRef.current) {
      return
    }
    switch (status) {
      case 'exiting': {
        /**
         * Transitions set to opacity if user prefers reduced motion.
         */
        prefersReducedMotion
          ? gsap.fromTo(
              fgImageWrapperRef.current,
              { opacity: 1 },
              {
                opacity: 0,
                duration: 0.2,
                onComplete() {
                  dispatch(slideExited())
                },
              }
            )
          : gsap.fromTo(
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
        } else {
          router.push(`/${currentSlideIndex + 1}`, undefined, { shallow: true })
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
        /**
         * Transitions set to opacity if user prefers reduced motion.
         */
        prefersReducedMotion
          ? gsap.fromTo(
              fgImageWrapperRef.current,
              {
                opacity: 0,
              },
              {
                opacity: 1,
                duration: 0.2,
                onComplete() {
                  dispatch(slideEntered())
                },
              }
            )
          : gsap.fromTo(
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
    currentSlideIndex,
    folderName,
    fgImageLoaded,
    direction,
    fgImageRef,
    prefersReducedMotion,
    router,
    status,
    slideExited,
    slideLoading,
    slideEntering,
    slideEntered,
  ])

  return (
    <React.Fragment>
      <GalleryView
        galleryName={galleryName}
        images={images}
        open={galleryDialogOpen}
        onClose={closeGalleryDialog}
        onTileClick={onGridListTileClick}
      />
      <Swipe
        onSwipeLeft={() => nextSlide()}
        onSwipeRight={() => previousSlide()}
      >
        <div className={classes.backgroundWrapper} ref={bgImageWrapperRef}>
          <div
            className={classes.bgImage}
            style={{
              backgroundImage: `url(${images[currentSlideIndex].filename})`,
            }}
          />
        </div>
        <div className={classes.mask} />
        <div className={classes.track}>
          <Button
            variant="text"
            className={classes.slide}
            ref={fgImageWrapperRef}
            style={{ backgroundColor: 'transparent', cursor: 'default' }}
          >
            <img
              src={images[currentSlideIndex].filename}
              className={classes.slideImage}
              ref={fgImageRef}
              onLoad={() => dispatch(fgImageLoadComplete())}
              onClick={() => nextSlide()}
            />
          </Button>
        </div>
        <Grid container className={classes.actionsWrapper}>
          <Grid item container xs className={classes.arrowLeftWrapper}>
            <IconButton
              onClick={() => previousSlide()}
              className={clsx(
                classes.arrow,
                classes.arrowLeft,
                classes.iconButton
              )}
              edge="start"
            >
              <ChevronLeft className={classes.arrowIcon} />
            </IconButton>
          </Grid>
          <Grid item container justify="center" xs>
            <IconButton onClick={() => setGalleryDialogOpen(true)}>
              <PhotoAlbumIcon />
            </IconButton>
          </Grid>
          <Grid item container xs className={classes.arrowRightWrapper}>
            <IconButton
              onClick={() => nextSlide()}
              className={clsx(
                classes.arrow,
                classes.arrowRight,
                classes.iconButton
              )}
              edge="end"
            >
              <ChevronRight className={classes.arrowIcon} />
            </IconButton>
          </Grid>
        </Grid>
      </Swipe>
    </React.Fragment>
  )
}
