# 🖼️ How to Add Food Images

## Quick Guide

### Method 1: Add Images Manually (Easiest)

1. **Get your food image** (JPG, PNG, or WEBP)
   
2. **Rename it** to match the food name (lowercase, use hyphens):
   ```
   jollof-rice.jpg
   fried-chicken.png
   egusi-soup.jpg
   ```

3. **Copy to:** `backend/public/images/`

4. **Update database** using one of these methods:

   **Option A: Update via SQL**
   ```sql
   UPDATE food_items 
   SET imageUrl = '/images/jollof-rice.jpg' 
   WHERE name = 'Jollof Rice & Chicken';
   ```

   **Option B: Update via seed file** (recommended)
   - Edit `backend/src/prisma/seed.ts`
   - Change the imageUrl for that food item
   - Run: `npm run prisma:seed`

5. **Images are now served at:**
   ```
   http://localhost:3000/images/jollof-rice.jpg
   ```

---

### Method 2: Download Images from Internet

Use PowerShell to download images:

```powershell
cd backend/public/images

# Download a single image
Invoke-WebRequest -Uri "https://example.com/food.jpg" -OutFile "jollof-rice.jpg"

# Download multiple images
$images = @{
    "jollof-rice.jpg" = "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800"
    "fried-chicken.jpg" = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800"
}

foreach ($img in $images.GetEnumerator()) {
    Invoke-WebRequest -Uri $img.Value -OutFile $img.Key
    Write-Host "Downloaded: $($img.Key)"
}
```

---

### Method 3: Using the API (Future - requires implementation)

Once you build an admin panel, you can:

```bash
POST /api/admin/foods/:id/upload-image
Content-Type: multipart/form-data

{
  "image": [file upload]
}
```

---

## 📝 Image Naming Convention

**Format:** `lowercase-with-hyphens.extension`

**Examples:**
```
✅ jollof-rice.jpg
✅ grilled-chicken-full.png
✅ pounded-yam.webp
✅ coca-cola.jpg

❌ Jollof Rice.jpg (spaces, capitals)
❌ JollofRice.JPG (camelCase, all caps extension)
```

---

## 🎨 Image Specifications

### Recommended:
- **Format:** JPG (smaller) or PNG (better quality)
- **Size:** 800x600 pixels or 1200x900 pixels
- **Aspect Ratio:** 4:3 or 16:9
- **File Size:** Keep under 500KB each
- **Optimization:** Use TinyPNG or similar before uploading

### Minimum:
- At least 400x300 pixels
- Maximum 2MB file size

---

## 🗂️ Current Structure

```
backend/
├── public/
│   └── images/
│       ├── jollof-rice.jpg
│       ├── fried-chicken.jpg
│       ├── egusi-soup.jpg
│       └── ... (all food images)
└── src/
    └── prisma/
        └── seed.ts  (contains image URLs)
```

---

## 🔄 Update Seed File

Edit `backend/src/prisma/seed.ts`:

```typescript
{
  name: 'Jollof Rice & Chicken',
  description: 'Delicious Nigerian jollof rice with grilled chicken',
  price: 4500,
  imageUrl: '/images/jollof-rice.jpg',  // ← Change this
  categoryId: riceCategory.id,
  isAvailable: true
}
```

Then run:
```bash
cd backend
npm run prisma:seed
```

---

## 🌐 Image URLs

Images are accessible at:

**Local:**
```
http://localhost:3000/images/jollof-rice.jpg
```

**In Database:**
```
/images/jollof-rice.jpg
```

**In Frontend:**
The frontend automatically prepends the API URL, so just store:
```typescript
imageUrl: '/images/jollof-rice.jpg'
```

---

## 🔧 Where Images Are Used

1. **Database** - `food_items.imageUrl` column
2. **Backend** - Served from `backend/public/images/`
3. **API Response** - Returns full or relative URL
4. **Frontend** - Displays in food cards

---

## 📦 Example: Add 5 Food Images

```powershell
# Navigate to images folder
cd C:\Users\BrandOne-Developer\Desktop\Takeoute\backend\public\images

# Download sample images
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800" -OutFile "jollof-rice.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800" -OutFile "fried-chicken.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800" -OutFile "egusi-soup.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1604329755944-1ee7caa5a5f4?w=800" -OutFile "pounded-yam.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800" -OutFile "coca-cola.jpg"
```

---

## 💡 Tips

1. **Use consistent naming** - Makes it easier to manage
2. **Optimize images** - Smaller files = faster loading
3. **Use descriptive names** - Easy to identify
4. **Keep backups** - Save original high-res versions
5. **Test locally first** - Make sure images load before deploying

---

## 🚀 For Production

When deploying to production, consider:

1. **CDN (Content Delivery Network)**
   - Upload to Cloudinary, AWS S3, or Firebase Storage
   - Update imageUrl in database to CDN URL
   - Much faster global delivery

2. **Image Optimization**
   - Use WebP format for modern browsers
   - Implement responsive images (different sizes)
   - Add lazy loading

3. **Caching**
   - Set proper cache headers
   - Use image CDN features

---

## ❓ Troubleshooting

**Images not showing?**

1. Check file exists:
   ```powershell
   Get-ChildItem backend/public/images
   ```

2. Check URL in database:
   ```sql
   SELECT name, imageUrl FROM food_items;
   ```

3. Test direct access:
   ```
   http://localhost:3000/images/your-image.jpg
   ```

4. Check backend logs for errors

5. Restart backend server:
   ```bash
   cd backend
   npm run dev
   ```

---

## 📸 Free Image Resources

- **Unsplash** - https://unsplash.com (Free, high quality)
- **Pexels** - https://pexels.com (Free stock photos)
- **Pixabay** - https://pixabay.com (Free images)
- **Foodiesfeed** - https://foodiesfeed.com (Food-specific)

**How to download:**
1. Find image you like
2. Click download
3. Choose size (1280px or similar)
4. Rename and save to `backend/public/images/`

---

Need help adding images? Just drop your food images into `backend/public/images/` and update the seed file! 🎉
