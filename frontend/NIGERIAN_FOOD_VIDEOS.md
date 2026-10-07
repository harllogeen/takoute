# 🍚 Getting Nigerian Food Videos

## Quick Method (5 minutes)

### Step 1: Go to Pexels
Open: **https://www.pexels.com/search/videos/nigerian%20food/**

### Step 2: Search for Good Videos
Try these searches:
- "nigerian food"
- "jollof rice"
- "african cuisine"
- "cooking rice"
- "west african food"

### Step 3: Download a Video

1. Click on a video you like
2. Click the **"Free Download"** button
3. Choose **"Full HD (1920x1080)"** or **"HD (1280x720)"**
4. Video will download to your Downloads folder

### Step 4: Move Video to Project

Using File Explorer:
1. Find the video in your **Downloads** folder
2. Rename it to: `nigerian-food.mp4`
3. Move it to: `C:\Users\BrandOne-Developer\Desktop\Takeoute\frontend\src\assets\videos\`

OR using PowerShell:
```powershell
cd frontend
Move-Item "$env:USERPROFILE\Downloads\pexels-*.mp4" "src\assets\videos\nigerian-food.mp4"
```

### Step 5: Update Code

Edit `frontend/src/app/components/home/home.component.html`:

Change from:
```html
<source src="https://cdn.coverr.co/videos/coverr-delicious-food-being-prepared-9920/1080p.mp4" type="video/mp4">
```

To:
```html
<source src="assets/videos/nigerian-food.mp4" type="video/mp4">
```

### Step 6: Refresh Browser
Press **Ctrl + Shift + R** - Your video is live! 🎉

---

## Recommended Videos from Pexels

Search for these and pick what you like:

### Best Options:
1. **Jollof rice being stirred** - Shows the cooking process
2. **Nigerian chef preparing food** - Professional kitchen vibes
3. **Colorful West African dishes** - Multiple dishes in frame
4. **Steam rising from rice** - Looks appetizing
5. **Food being plated** - Restaurant quality

### What to Look For:
- ✅ Good lighting (bright, appetizing)
- ✅ Motion (stirring, steam, pouring)
- ✅ Close-up shots
- ✅ Colorful (red tomatoes, orange peppers, golden rice)
- ✅ Professional quality

### What to Avoid:
- ❌ Too dark or dim
- ❌ Shaky camera
- ❌ Text overlays
- ❌ Static/no movement
- ❌ Poor quality

---

## Alternative Sources

### Coverr (Free, No Sign-Up)
https://coverr.co/search?q=food+cooking
- Direct MP4 downloads
- Good quality
- Already integrated in your app

### Pixabay
https://pixabay.com/videos/search/african%20food/
- Free stock videos
- No attribution required

### Mixkit
https://mixkit.co/free-stock-video/food/
- Professional quality
- Easy download

---

## Quick PowerShell Script

Run this to download some backup cooking videos:

```powershell
cd frontend
.\download-nigerian-food-videos.ps1
```

This will:
1. Download 3 cooking videos to src/assets/videos/
2. Open Pexels in your browser
3. Guide you through manual download

---

## Video Specs

**Perfect Settings:**
- Resolution: 1920x1080 (Full HD)
- Format: MP4
- Duration: 10-30 seconds
- File size: 2-5 MB
- Frame rate: 24-30 fps

**Acceptable:**
- Resolution: 1280x720 (HD)
- File size: up to 10 MB

---

## Troubleshooting

**Video not showing?**
1. Check file path: `frontend/src/assets/videos/nigerian-food.mp4`
2. Check file name matches HTML exactly
3. Clear browser cache (Ctrl + Shift + R)
4. Check video file isn't corrupted (try playing it)

**Video too large?**
Compress with this PowerShell (requires FFmpeg):
```powershell
ffmpeg -i src\assets\videos\nigerian-food.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset fast src\assets\videos\nigerian-food-compressed.mp4
```

**Need multiple videos?**
Add more sources in HTML:
```html
<source src="assets/videos/jollof-rice.mp4" type="video/mp4">
<source src="assets/videos/ofada-rice.mp4" type="video/mp4">
<source src="https://cdn.coverr.co/videos/.../1080p.mp4" type="video/mp4">
```
Browser will use first available video.

---

## 🎬 Ready to Go!

Your hero section is already set up. Just drop in your Nigerian food video and refresh! 

**Current video is from Coverr.co - it works but generic.**  
**Get a Nigerian-specific video for authentic vibes!** 🇳🇬🍚
