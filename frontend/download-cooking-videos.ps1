# Download Free Cooking Videos
Write-Host "🎬 Downloading cooking videos..." -ForegroundColor Cyan

$videosDir = "src/assets/videos"
New-Item -ItemType Directory -Path $videosDir -Force | Out-Null

$videos = @{
    "cooking-food.mp4" = "https://cdn.coverr.co/videos/coverr-cooking-vegetables-in-a-pan-9456/1080p.mp4"
    "chef-cooking.mp4" = "https://cdn.coverr.co/videos/coverr-chef-preparing-food-1729/1080p.mp4"
    "food-prep.mp4" = "https://cdn.coverr.co/videos/coverr-close-up-of-food-being-prepared-9455/1080p.mp4"
}

foreach ($video in $videos.GetEnumerator()) {
    Write-Host "Downloading $($video.Key)..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $video.Value -OutFile (Join-Path $videosDir $video.Key) -ErrorAction Stop
        Write-Host "  ✓ Downloaded!" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Done! Videos saved to: $videosDir" -ForegroundColor Green
Write-Host ""
Write-Host "📝 To use a video, update home.component.html:" -ForegroundColor Cyan
Write-Host "   <source src='assets/videos/cooking-food.mp4' type='video/mp4'>" -ForegroundColor White
Write-Host ""
Write-Host "🌐 For Nigerian-specific videos, visit:" -ForegroundColor Cyan
Write-Host "   https://www.pexels.com/search/videos/nigerian%20food/" -ForegroundColor White
