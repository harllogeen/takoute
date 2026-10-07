# 📌 How to Download Video from Pinterest

## Pinterest Link: https://pin.it/5n2kiNjGM

Since Pinterest doesn't provide direct download links, here are **3 easy methods**:

---

## Method 1: Pinterest Downloader Website (Easiest - 1 minute)

### Step 1: Copy Your Pinterest URL
```
https://pin.it/5n2kiNjGM
```

### Step 2: Use a Pinterest Video Downloader
Go to one of these free websites:
- **SavePin**: https://www.savepin.app/
- **PinDown**: https://pindown.online/
- **Pinterest Downloader**: https://pinterestvideodownloader.com/

### Step 3: Download
1. Paste your Pinterest URL
2. Click "Download"
3. Choose quality (1080p recommended)
4. Save as: `nigerian-food.mp4`

### Step 4: Move to Project
```powershell
Move-Item "$env:USERPROFILE\Downloads\nigerian-food.mp4" "C:\Users\BrandOne-Developer\Desktop\Takeoute\frontend\src\assets\videos\nigerian-food.mp4"
```

---

## Method 2: Browser Extension (Chrome/Edge)

### Install Extension:
- **Video DownloadHelper** (Firefox/Chrome)
- **Pinterest Video Downloader** (Chrome)

### Steps:
1. Install extension
2. Go to: https://pin.it/5n2kiNjGM
3. Click extension icon
4. Click "Download"
5. Save as `nigerian-food.mp4`

---

## Method 3: Screen Recording (Backup method)

If download sites don't work:

### Windows (Built-in):
1. Press `Win + G` (Game Bar)
2. Click Record button
3. Open Pinterest video in browser
4. Play video in full screen
5. Stop recording
6. Video saved to: `Videos\Captures`

### Trim if needed:
- Use Windows Photos app "Trim" feature
- Or use online editor: https://clideo.com/trim-video

---

## After Downloading

### 1. Verify File Location
```powershell
Test-Path "C:\Users\BrandOne-Developer\Desktop\Takeoute\frontend\src\assets\videos\nigerian-food.mp4"
```
Should return: `True`

### 2. Update Component
File is already configured! Just make sure the video file exists at:
```
frontend/src/assets/videos/nigerian-food.mp4
```

The HTML already has:
```html
<source src="assets/videos/nigerian-food.mp4" type="video/mp4">
```

### 3. Refresh Browser
Press `Ctrl + Shift + R` - Your Pinterest video will play!

---

## Quick PowerShell Commands

### Check if video exists:
```powershell
cd C:\Users\BrandOne-Developer\Desktop\Takeoute\frontend
Get-ChildItem src\assets\videos\*.mp4
```

### Get video info:
```powershell
Get-Item src\assets\videos\nigerian-food.mp4 | Select-Object Name, Length
```

### Compress if too large (requires FFmpeg):
```powershell
ffmpeg -i src\assets\videos\nigerian-food.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 src\assets\videos\nigerian-food-compressed.mp4
```

---

## Troubleshooting

### Video not showing after download?
1. **Check filename**: Must be exactly `nigerian-food.mp4`
2. **Check path**: Must be in `frontend/src/assets/videos/`
3. **Clear cache**: Press `Ctrl + Shift + R` in browser
4. **Check video plays**: Open file directly in VLC or Windows Media Player

### File too large?
If video is over 10MB:
- Use online compressor: https://www.freeconvert.com/video-compressor
- Or use FFmpeg command above
- Target size: 3-5MB

### Alternative videos available?
If Pinterest video doesn't work, use:
- Pexels: https://www.pexels.com/search/videos/jollof%20rice/
- Pixabay: https://pixabay.com/videos/search/african%20food/
- Coverr: Already configured as fallback!

---

## What Happens When Video is Added?

✅ **Hero section** will show your Pinterest video
✅ **Loops continuously** 
✅ **Muted autoplay** (no sound)
✅ **Dark overlay** so text is readable
✅ **Mobile responsive** 
✅ **Falls back** to Coverr video if missing

---

## Need Help?

If you have issues:
1. Make sure video file downloaded completely
2. Check it's MP4 format
3. Try playing it outside the app first
4. Check filename and location match exactly

**The app is ready - just drop in your video!** 🎬
