$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = (Resolve-Path "assets/images").Path

# 1. HTML template for Splash Icon (Transparent, Mark + Mbaala Wordmark)
$splashHtml = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 512px;
    height: 512px;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  svg { width: 240px; height: 240px; }
  .title {
    font-size: 54px;
    font-weight: 900;
    color: #0F4C3A;
    letter-spacing: -1.5px;
    margin-top: 20px;
  }
  .sub {
    font-size: 14px;
    font-weight: 800;
    color: #059669;
    letter-spacing: 4px;
    margin-top: 6px;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <svg viewBox="0 0 100 100" fill="none">
    <!-- Left Horn & Left Stem of M -->
    <path d="M 50 76 C 45 52 38 34 32 24 C 24 12 8 20 8 36 C 8 50 20 60 30 52 C 34 49 34 43 30 43 C 24 43 17 38 18 32 C 19 24 28 20 33 28 C 38 36 43 54 48 76 Z" fill="#0F4C3A"/>
    <!-- Right Horn & Right Stem of M -->
    <path d="M 50 76 C 55 52 62 34 68 24 C 76 12 92 20 92 36 C 92 50 80 60 70 52 C 66 49 66 43 70 43 C 76 43 83 38 82 32 C 81 24 72 20 67 28 C 62 36 57 54 52 76 Z" fill="#0F4C3A"/>
    <!-- Center Crown -->
    <path d="M 45 36 C 45 36 47 48 50 56 C 53 48 55 36 55 36 Z" fill="#0F4C3A"/>
    <!-- Vitality Node -->
    <circle cx="50" cy="62" r="3.5" fill="#10B981"/>
  </svg>
  <div class="title">Mbaala</div>
  <div class="sub">Livestock Health AI</div>
</body>
</html>
"@

# 2. HTML template for App Icon (1024x1024, Deep Emerald Background)
$iconHtml = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1024px;
    height: 1024px;
    background: #0F4C3A;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  svg { width: 620px; height: 620px; }
</style>
</head>
<body>
  <svg viewBox="0 0 100 100" fill="none">
    <!-- Left Horn -->
    <path d="M 50 76 C 45 52 38 34 32 24 C 24 12 8 20 8 36 C 8 50 20 60 30 52 C 34 49 34 43 30 43 C 24 43 17 38 18 32 C 19 24 28 20 33 28 C 38 36 43 54 48 76 Z" fill="#FFFFFF"/>
    <!-- Right Horn -->
    <path d="M 50 76 C 55 52 62 34 68 24 C 76 12 92 20 92 36 C 92 50 80 60 70 52 C 66 49 66 43 70 43 C 76 43 83 38 82 32 C 81 24 72 20 67 28 C 62 36 57 54 52 76 Z" fill="#FFFFFF"/>
    <!-- Center Crown -->
    <path d="M 45 36 C 45 36 47 48 50 56 C 53 48 55 36 55 36 Z" fill="#FFFFFF"/>
    <!-- Vitality Node -->
    <circle cx="50" cy="62" r="3.5" fill="#34D399"/>
  </svg>
</body>
</html>
"@

# 3. HTML for Android Adaptive Foreground
$adaptiveFgHtml = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 512px;
    height: 512px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg { width: 280px; height: 280px; }
</style>
</head>
<body>
  <svg viewBox="0 0 100 100" fill="none">
    <path d="M 50 76 C 45 52 38 34 32 24 C 24 12 8 20 8 36 C 8 50 20 60 30 52 C 34 49 34 43 30 43 C 24 43 17 38 18 32 C 19 24 28 20 33 28 C 38 36 43 54 48 76 Z" fill="#0F4C3A"/>
    <path d="M 50 76 C 55 52 62 34 68 24 C 76 12 92 20 92 36 C 92 50 80 60 70 52 C 66 49 66 43 70 43 C 76 43 83 38 82 32 C 81 24 72 20 67 28 C 62 36 57 54 52 76 Z" fill="#0F4C3A"/>
    <path d="M 45 36 C 45 36 47 48 50 56 C 53 48 55 36 55 36 Z" fill="#0F4C3A"/>
    <circle cx="50" cy="62" r="3.5" fill="#10B981"/>
  </svg>
</body>
</html>
"@

# Save temporary HTML files
$tmpSplash = "$env:TEMP\mbaala_splash.html"
$tmpIcon = "$env:TEMP\mbaala_icon.html"
$tmpAdaptive = "$env:TEMP\mbaala_adaptive.html"

[System.IO.File]::WriteAllText($tmpSplash, $splashHtml)
[System.IO.File]::WriteAllText($tmpIcon, $iconHtml)
[System.IO.File]::WriteAllText($tmpAdaptive, $adaptiveFgHtml)

# Render screenshots using headless Edge
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=512,512 --screenshot="$outDir\splash-icon.png" "file:///$tmpSplash"
& $edge --headless --disable-gpu --window-size=1024,1024 --screenshot="$outDir\icon.png" "file:///$tmpIcon"
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=512,512 --screenshot="$outDir\android-icon-foreground.png" "file:///$tmpAdaptive"
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=64,64 --screenshot="$outDir\favicon.png" "file:///$tmpSplash"

# Remove temp files
Remove-Item $tmpSplash, $tmpIcon, $tmpAdaptive -ErrorAction SilentlyContinue

Write-Host "Brand icons generated successfully into $outDir!"
