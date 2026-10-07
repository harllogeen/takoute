# 🎥 How to Add Your Own Hero Video

## Option 1: Add Local Video File

1. **Create video folder:**
   ```
   frontend/src/assets/videos/
   ```

2. **Add your video file:**
   - Place your video: `frontend/src/assets/videos/ofada-rice.mp4`
   - Recommended format: MP4 (H.264 codec)
   - Recommended size: 1920x1080 or 1280x720
   - Keep file size under 5MB for fast loading

3. **Update the HTML:**
   Edit `frontend/src/app/components/home/home.component.html`:
   ```html
   <video autoplay muted loop playsinline class="hero-video">
     <source src="assets/videos/ofada-rice.mp4" type="video/mp4">
   </video>
   ```

## Option 2: Download Free Nigerian Food Videos

### Pexels (Best Quality)
1. Go to: https://www.pexels.com/search/videos/nigerian%20food/
2. Find a video you like
3. Click "Download" and choose quality (1080p recommended)
4. Rename to `nigerian-food.mp4`
5. Place in `frontend/src/assets/videos/`

### Suggested Search Terms:
- "nigerian food"
- "jollof rice"
- "african cuisine"
- "cooking rice"
- "food preparation"
- "restaurant kitchen"

### Recommended Videos:
- Cooking rice in a pot
- Chef preparing Nigerian dishes
- Fresh ingredients (tomatoes, peppers, rice)
- Steaming hot food being served

## Option 3: Optimize Video for Web

Use this PowerShell command to compress video:

```powershell
# Using FFmpeg (install from https://ffmpeg.org/)
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k output.mp4
```

This will:
- Resize to 720p (good quality, smaller size)
- Compress without losing much quality
- Make it web-optimized

## Video Specifications

**Recommended:**
- Resolution: 1920x1080 (Full HD) or 1280x720 (HD)
- Format: MP4 with H.264 codec
- Frame rate: 24-30 fps
- Duration: 10-30 seconds (looping video)
- File size: Under 5MB
- No audio (muted anyway for autoplay)

**Minimum:**
- Resolution: 1280x720
- Format: MP4
- File size: Under 10MB

## Current Setup

The hero currently uses free videos from Coverr.co:
```html
<source src="https://cdn.coverr.co/videos/coverr-delicious-food-being-prepared-9920/1080p.mp4" type="video/mp4">
```

## Tips

1. **Loop seamlessly** - Choose videos that look good when looped
2. **Avoid text in video** - Your hero title will overlay the video
3. **Good lighting** - Bright, appealing food shots work best
4. **Motion** - Slight motion (steam rising, stirring) adds life
5. **Focus on food** - Close-up shots of Nigerian dishes

## Fallback Image

If you want a fallback image when video doesn't load:

```html
<video autoplay muted loop playsinline class="hero-video" poster="assets/images/hero-fallback.jpg">
  <source src="assets/videos/ofada-rice.mp4" type="video/mp4">
</video>
```

## Multiple Videos (Randomize)

You can use JavaScript to randomize videos:

In `home.component.ts`:
```typescript
heroVideos = [
  'assets/videos/ofada-rice.mp4',
  'assets/videos/jollof-rice.mp4',
  'assets/videos/nigerian-food.mp4'
];

currentVideo = this.heroVideos[Math.floor(Math.random() * this.heroVideos.length)];
```

In `home.component.html`:
```html
<source [src]="currentVideo" type="video/mp4">
```

## Example: Download and Add Video

```powershell
# 1. Create folder
New-Item -ItemType Directory -Path "frontend\src\assets\videos" -Force

# 2. Download a video (example - you'll need to find the direct link)
Invoke-WebRequest -Uri "YOUR_VIDEO_URL.mp4" -OutFile "frontend\src\assets\videos\nigerian-food.mp4"

# 3. Video is ready to use!
```

---

**Your hero video will autoplay, loop, and be muted for the best user experience!** 🎬
