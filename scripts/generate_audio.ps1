$audioDir = "assets/audio/english"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
}

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$clips = @{
    "en_welcome.wav" = "Welcome to Mbaala. Tap your language to continue."
    "en_healthy.wav" = "Your animal has healthy blood. No medicine is needed today."
    "en_warning.wav" = "Your animal is getting weak. Check its food, isolate it, and monitor for worsening pale eyes."
    "en_danger.wav"  = "Your animal is very pale and weak inside. It has blood worms. Administer dewormer medicine today immediately."
}

foreach ($item in $clips.GetEnumerator()) {
    $filePath = Join-Path $audioDir $item.Key
    $synth.SetOutputToWaveFile($filePath)
    $synth.Speak($item.Value)
    Write-Host "Generated: $filePath"
}

$synth.Dispose()
Write-Host "All audio files generated successfully!"
