# AngelinaBecerra.com Readme

## Adding new images

1. Copy folder of images to `public/galleries`.
1. Add folder to `getStaticPaths` in `pages/gallery/[folderName].tsx`.

### Specifying image order

By default, the build script will order the pictures based on the filename. However, you can override this behavior by specifying the order the images should be displayed. Include a file named `order.json` in an image folder to tell the script to use a specific order.

**Sample `order.json`**

```typescript
{
  "images": [
    "1.JPG",
    "6.JPG",
    "8.JPG",
    "12.jpg",
    "18.jpg",
    "20.jpg"
  ]
}
```
