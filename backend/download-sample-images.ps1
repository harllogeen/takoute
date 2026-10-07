# Download Sample Food Images
# Run this script from the backend directory

Write-Host "🍽️ Downloading sample food images..." -ForegroundColor Cyan
Write-Host ""

$imagesDir = "public/images"
$images = @{
    "jollof-rice.jpg" = "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80"
    "fried-rice.jpg" = "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"
    "white-rice.jpg" = "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80"
    "coconut-rice.jpg" = "https://images.unsplash.com/photo-1645696329369-78bf65c71c3e?w=800&q=80"
    "grilled-chicken-full.jpg" = "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80"
    "grilled-chicken-half.jpg" = "https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=800&q=80"
    "fried-chicken.jpg" = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80"
    "pounded-yam.jpg" = "https://images.unsplash.com/photo-1604329755944-1ee7caa5a5f4?w=800&q=80"
    "eba.jpg" = "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80"
    "fried-turkey.jpg" = "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&q=80"
    "egusi-soup.jpg" = "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"
    "efo-riro.jpg" = "https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=800&q=80"
    "banga-soup.jpg" = "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"
    "coca-cola.jpg" = "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80"
    "sprite.jpg" = "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&q=80"
    "water.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    "chapman.jpg" = "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80"
    "small-chops.jpg" = "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80"
    "meat-pie.jpg" = "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80"
    "puff-puff.jpg" = "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80"
}

$total = $images.Count
$current = 0

foreach ($img in $images.GetEnumerator()) {
    $current++
    $filename = $img.Key
    $url = $img.Value
    $filepath = Join-Path $imagesDir $filename
    
    Write-Host "[$current/$total] Downloading $filename..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath -ErrorAction Stop
        Write-Host "  ✓ Success!" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Done! Downloaded $total images to $imagesDir" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/src/prisma/seed.ts to use local paths"
Write-Host "2. Run: npm run prisma:seed"
Write-Host "3. Restart backend: npm run dev"
Write-Host ""
