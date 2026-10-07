# Download Nigerian Food Videos for Hero Background
# Run this from the frontend directory

Write-Host "🎬 Downloading Nigerian Food Videos..." -ForegroundColor Cyan
Write-Host ""

$videosDir = "src/assets/videos"

# Create directory if it doesn't exist
if (!(Test-Path $videosDir)) {
    New-Item -ItemType Directory -Path $videosDir -Force | Out-Null
}

# Free stock video URLs (These are example URLs - you'll need to get actual Pexels download links)
# To get videos:
# 1. Go to https://www.pexels.com/search/videos/nigerian%20food/
# 2. Click on a video you like
# 3. Click "Download" and copy the MP4 link
# 4. Replace the URLs below with actual download links

Write-Host "📌 IMPORTANT: You need to manually download videos from Pexels" -ForegroundColor Yellow
Write-Host ""
Write-Host "Here's how:" -ForegroundColor White
Write-Host "1. Visit: https://www.pexels.com/search/videos/nigerian%20food/" -ForegroundColor Gray
Write-Host "2. Find videos showing:" -ForegroundColor Gray
Write-Host "   - Jollof rice cooking" -ForegroundColor Gray
Write-Host "   - Nigerian food preparation" -ForegroundColor Gray
Write-Host "   - Colorful West African dishes" -ForegroundColor Gray
Write-Host "   - Steam rising from food" -ForegroundColor Gray
Write-Host "3. Click on a video you like" -ForegroundColor Gray
Write-Host "4. Click the 'Free Download' button" -ForegroundColor Gray
Write-Host "5. Right-click the download and select 'Copy link address'" -ForegroundColor Gray
Write-Host "6. Use this PowerShell command:" -ForegroundColor Gray
Write-Host ""
Write-Host "   Invoke-WebRequest -Uri 'PASTE_LINK_HERE' -OutFile '$videosDir/nigerian-food.mp4'" -ForegroundColor Green
Write-Host ""

# Alternative: Download food-related videos from free sources
Write-Host "🔄 Attempting to download general cooking videos..." -ForegroundColor Cyan
Write-Host ""

# Try some free video hosting platforms with food content
$videos = @{
    "cooking-1.mp4" = "https://cdn.coverr.co/videos/coverr-cooking-vegetables-in-a-pan-9456/1080p.mp4"
    "cooking-2.mp4" = "https://cdn.coverr.co/videos/coverr-chef-preparing-food-1729/1080p.mp4"
    "cooking-3.mp4" = "https://cdn.coverr.co/videos/coverr-close-up-of-food-being-prepared-9455/1080p.mp4"
}

$downloaded = 0
foreach ($video in $videos.GetEnumerator()) {
    $filename = $video.Key
    $url = $video.Value
    $filepath = Join-Path $videosDir $filename
    
    Write-Host "Downloading $filename..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath -ErrorAction Stop
        Write-Host "  ✓ Success!" -ForegroundColor Green
        $downloaded++
    }
    catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Downloaded $downloaded cooking videos to $videosDir" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check the videos in: $videosDir" -ForegroundColor White
Write-Host "2. Choose which video you want to use" -ForegroundColor White
Write-Host "3. Update home.component.html with:" -ForegroundColor White
Write-Host ""
Write-Host "   <source src='assets/videos/cooking-1.mp4' type='video/mp4'>" -ForegroundColor Green
Write-Host ""
Write-Host "4. Or download specific Nigerian food videos from Pexels!" -ForegroundColor White
Write-Host ""

# Open Pexels in browser
Write-Host "Would you like to open Pexels Nigerian food videos page? (Y/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process "https://www.pexels.com/search/videos/nigerian%20food/"
    Write-Host "Opening browser..." -ForegroundColor Green
}

Write-Host ""
Write-Host "🎬 Done! Happy video hunting!" -ForegroundColor Cyan
