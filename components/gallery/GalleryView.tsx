import * as React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  GridList,
  GridListTile,
  Hidden,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import { DialogTitle } from './DialogTitle'
import Image from "next/legacy/image"
import { TouchApp as TouchAppIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  dialogActionsTextWrapper: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  touchAppIcon: {
    marginRight: theme.spacing(1),
  },
}))

interface Props {
  galleryName: string
  galleryScrollPosition: number
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
  open: boolean
  onClose({ scrollPosition }: { scrollPosition: number }): void
  onTileClick({
    slideIndex,
    scrollPosition,
  }: {
    slideIndex: number
    scrollPosition: number
  }): void
}

export const GalleryView = ({
  galleryName,
  galleryScrollPosition,
  images,
  open,
  onClose,
  onTileClick,
}: Props) => {
  const classes = useStyles()
  const theme = useTheme()
  const gridListRef: React.Ref<HTMLUListElement> = React.useRef()
  const [scrollPosition, setScrollPosition] = React.useState(
    galleryScrollPosition
  )

  React.useEffect(() => {
    if (!gridListRef.current) {
      return
    }
    gridListRef.current.scrollTo({ left: 0, top: galleryScrollPosition })
  }, [galleryScrollPosition])

  const handleScroll = (e: any) => {
    setScrollPosition(e.target.scrollTop)
  }

  /**
   * Used for GridList to determine column count and size
   */
  const screenXs = useMediaQuery(theme.breakpoints.only('xs'))
  const screenSm = useMediaQuery(theme.breakpoints.only('sm'))
  const screenMd = useMediaQuery(theme.breakpoints.only('md'))

  const getGridListDimensions = () => {
    if (screenXs) {
      return {
        cols: 1,
        cellHeight: 250,
      }
    }
    if (screenSm) {
      return {
        cols: 2,
        cellHeight: 500,
      }
    }
    if (screenMd) {
      return {
        cols: 3,
        cellHeight: 500,
      }
    }

    return {
      cols: 4,
      cellHeight: 500,
    }
  }

  const gridListDimensions = getGridListDimensions()

  return (
    <Dialog
      fullScreen
      open={true}
      onClick={() => onClose({ scrollPosition })}
      onClose={onClose}
      style={{ display: open ? 'block' : 'none' }}
    >
      <DialogTitle onClose={() => onClose({ scrollPosition })}>
        {galleryName ? `${galleryName} Images` : 'Gallery Images'}
        <Typography
          variant="body2"
          component="div"
          color="inherit"
          className={classes.dialogSubtitle}
        >
          Photos by Angelina Becerra &copy;{new Date().getFullYear()}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <GridList
          cellHeight={gridListDimensions.cellHeight}
          cols={gridListDimensions.cols}
          className={classes.gridList}
          onScroll={handleScroll}
          ref={gridListRef}
        >
          {images.map((image, index) => (
            <GridListTile
              key={image.filename}
              cols={1}
              onClick={() => onTileClick({ slideIndex: index, scrollPosition })}
              component="button"
              className={classes.gridListTile}
            >
              <Image
                src={image.filename}
                alt={`Gallery image #${index}`}
                layout="fill"
                objectFit="cover"
                objectPosition={image.backgroundPosition ?? 'center center'}
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
            </Typography>
          </div>
        </Hidden>
        <Button variant="text" color="inherit" type="button">
          Close Gallery View
        </Button>
      </DialogActions>
    </Dialog>
  )
}
