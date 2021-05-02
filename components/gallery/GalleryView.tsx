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
import Image from 'next/image'
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
  onClose(): void
  onTileClick(slideIndex: number): void
}

export const GalleryView = ({
  galleryName,
  images,
  open,
  onClose,
  onTileClick,
}: Props) => {
  const classes = useStyles()
  const theme = useTheme()

  /**
   * Used for GridList to determine column count and size
   */
  const screenXs = useMediaQuery(theme.breakpoints.only('xs'))
  const screenSm = useMediaQuery(theme.breakpoints.only('sm'))
  const screenMd = useMediaQuery(theme.breakpoints.only('md'))
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

  return (
    <Dialog fullScreen open={open} onClick={onClose} onClose={onClose}>
      <DialogTitle onClose={onClose}>
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
              onClick={() => onTileClick(index)}
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
  )
}
