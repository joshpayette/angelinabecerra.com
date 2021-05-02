import * as React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import gsap from 'gsap'
import Swipe from 'react-easy-swipe'
import {
  ChevronLeft,
  ChevronRight,
  Close as CloseIcon,
  PhotoAlbum as PhotoAlbumIcon,
} from '@material-ui/icons'
import clsx from 'clsx'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Grid,
  GridList,
  GridListTile,
  IconButton,
  DialogTitleProps,
  Typography,
  useMediaQuery,
  Hidden,
} from '@material-ui/core'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { TouchApp as TouchAppIcon } from '@material-ui/icons'

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
  arrowLeftWrapper: {
    justifyContent: 'flex-end',
  },
  arrowRightWrapper: {
    justifyContent: 'flex-start',
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
    width: '40px!important',
    height: '40px!important',
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
  dialogActionsTextWrapper: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dialogRoot: {
    margin: 0,
    padding: theme.spacing(2),
  },
  dialogCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogSubtitle: {
    color: theme.palette.grey[400],
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  gridListTile: {
    border: 0,
    padding: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
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
  touchAppIcon: {
    marginRight: theme.spacing(1),
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

export interface GalleryType {
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

interface Props {
  folderName: string
  galleryName: string
  gallery: GalleryType
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

  const [galleryDialogOpen, setGalleryDialogOpen] = React.useState(false)
  const closeGalleryDialog = () => setGalleryDialogOpen(false)
  const theme = useTheme()
  /**
   * Used for GridList to determine column count and size
   */
  const screenXs = useMediaQuery(theme.breakpoints.only('xs'))
  const screenSm = useMediaQuery(theme.breakpoints.only('sm'))
  const screenMd = useMediaQuery(theme.breakpoints.only('md'))
  const screenLg = useMediaQuery(theme.breakpoints.up('lg'))
  const getGridListCols = () => {
    if (screenXs) {
      return 1
    }
    if (screenSm) {
      return 2
    }
    if (screenMd) {
      return 3
    }
    return 4
  }

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

  const fgImageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const fgImageRef: React.RefObject<HTMLImageElement> = React.useRef()

  const previousSlide = React.useCallback(() => {
    dispatch(slideExiting({ direction: 'prev', galleryLength: images.length }))
  }, [images.length, slideExiting])

  const nextSlide = React.useCallback(() => {
    dispatch(slideExiting({ direction: 'next', galleryLength: images.length }))
  }, [images.length, slideExiting])

  const onGridListTileClick = (slideIndex: number) => {
    dispatch(goToSlide({ slideIndex }))
  }

  /**
   * Initialize current slide based on passed prop
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
    <React.Fragment>
      <Dialog
        fullScreen
        open={galleryDialogOpen}
        onClick={closeGalleryDialog}
        onClose={closeGalleryDialog}
      >
        <DialogTitle onClose={closeGalleryDialog}>
          {galleryName ? `${galleryName} Images` : 'Gallery Images'}
          <Typography
            variant="body2"
            component="div"
            color="inherit"
            className={classes.dialogSubtitle}
          >
            Photos by Angelina Becerra, &copy;{new Date().getFullYear()}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <GridList
            cellHeight={500}
            className={classes.gridList}
            cols={getGridListCols()}
          >
            {images.map((image, index) => (
              <GridListTile
                key={image.filename}
                cols={1}
                onClick={() => onGridListTileClick(index)}
                component="button"
                className={classes.gridListTile}
              >
                <Image
                  src={image.filename}
                  alt={`Gallery image #${index}`}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </GridListTile>
            ))}
          </GridList>
        </DialogContent>
        <DialogActions>
          <Hidden smUp>
            <div className={classes.dialogActionsTextWrapper}>
              <TouchAppIcon className={classes.touchAppIcon} />
              <Typography variant="body2" component="div" color="inherit">
                Click to go to slide
                <br />
                Scroll for more images
              </Typography>
            </div>
          </Hidden>
          <Button variant="text" color="inherit" type="button">
            Close Gallery View
          </Button>
        </DialogActions>
      </Dialog>
      <Swipe
        onSwipeLeft={() => nextSlide()}
        onSwipeRight={() => previousSlide()}
      >
        <div className={classes.background} ref={bgImageWrapperRef}>
          <div
            className={classes.bgImage}
            style={{
              backgroundImage: `url(${images[currentSlideIndex].filename})`,
            }}
          />
        </div>
        <div className={classes.mask} />
        <div className={classes.track}>
          <div className={classes.slide} ref={fgImageWrapperRef}>
            <img
              src={images[currentSlideIndex].filename}
              className={classes.slideImage}
              ref={fgImageRef}
              onLoad={() => dispatch(fgImageLoadComplete())}
            />
          </div>
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

const DialogTitle = (props: DialogTitleProps & { onClose(): void }) => {
  const classes = useStyles()
  const { children, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.dialogRoot} {...other}>
      <Typography variant="body1" component="div">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.dialogCloseButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
}
