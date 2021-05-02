# AngelinaBecerra.com Readme

## Adding new images

1. Copy folder of images to `public/galleries`.
1. Add folder to `getStaticPaths` in `pages/gallery/[folderName].tsx`.

## Gallery Configuration

By default, the build script will order the pictures based on the filename. However, you can override this behavior by specifying a gallery configuration . Include a file named `config.json` in an image folder to give the script some additional information.

**Sample `gallery.json`**

```typescript
{
  "images": [
    { "filename": "1.JPG" },
    { "filename": "3.JPG" },
    { "filename": "7.JPG", backgroundPosition: 'top center' },
    { "filename": "2.JPG" },
    { "filename": "8.JPG" },
    { "filename": "12.JPG" },
  ]
}
```

### Options

- `filename`
- `backgroundPosition` - _Optional_ - The CSS background position for the image. This is used in the gallery view for the image thumbnail.
