param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Repair-Text {
  param([string]$Text)

  $enc1252 = [System.Text.Encoding]::GetEncoding(1252)
  $utf8 = [System.Text.Encoding]::UTF8
  $mojibakePattern = '\u00C3|\u00C2|\u00E2|\u00EF|\uFFFD'
  $parts = [regex]::Split($Text, "(\r?\n)")
  $result = New-Object System.Text.StringBuilder

  for ($partIndex = 0; $partIndex -lt $parts.Length; $partIndex++) {
    $part = $parts[$partIndex]

    if ($part -match "^\r?\n$") {
      [void]$result.Append($part)
      continue
    }

    $current = $part
    $best = $current
    $bestScore = ([regex]::Matches($best, $mojibakePattern)).Count

    for ($i = 0; $i -lt 4; $i++) {
      $next = $utf8.GetString($enc1252.GetBytes($current))
      $score = ([regex]::Matches($next, $mojibakePattern)).Count

      if ($score -lt $bestScore) {
        $best = $next
        $bestScore = $score
      }

      if ($next -eq $current) {
        break
      }

      $current = $next
    }

    [void]$result.Append($best)
  }

  return $result.ToString()
}

function Convert-ToSlug {
  param([string]$Text)

  $normalized = $Text.Normalize([Text.NormalizationForm]::FormD)
  $builder = New-Object System.Text.StringBuilder

  foreach ($char in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($char) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($char)
    }
  }

  $ascii = $builder.ToString().Normalize([Text.NormalizationForm]::FormC).ToLowerInvariant()
  $ascii = $ascii -replace "[^a-z0-9]+", "-"
  $ascii = $ascii.Trim("-")

  if ([string]::IsNullOrWhiteSpace($ascii)) {
    return "no-especificado"
  }

  return $ascii
}

function New-OrderedMap {
  return [ordered]@{}
}

function Get-ListItems {
  param([string]$SectionText)

  if ([string]::IsNullOrWhiteSpace($SectionText)) {
    return @()
  }

  return @(
    [regex]::Matches($SectionText, "(?m)^\s*-\s+(.*)$") |
      ForEach-Object { $_.Groups[1].Value.Trim() } |
      Where-Object { $_ }
  )
}

function Get-NumberedItems {
  param([string]$SectionText)

  if ([string]::IsNullOrWhiteSpace($SectionText)) {
    return @()
  }

  return @(
    [regex]::Matches($SectionText, "(?m)^\s*\d+\.\s+(.*)$") |
      ForEach-Object { $_.Groups[1].Value.Trim() } |
      Where-Object { $_ }
  )
}

function Get-Section {
  param(
    [string]$Text,
    [string]$HeadingPattern,
    [string[]]$NextHeadingPatterns
  )

  $nextPattern = if ($NextHeadingPatterns.Count) {
    "(?:" + ($NextHeadingPatterns -join "|") + ")"
  } else {
    ".^"
  }
  $pattern = "(?ms)^######\s+$HeadingPattern\s*\r?\n(.*?)(?=^######\s+$nextPattern\s*$|\z)"
  $match = [regex]::Match($Text, $pattern)

  if (-not $match.Success) {
    return ""
  }

  return $match.Groups[1].Value.Trim()
}

function Get-Paragraphs {
  param([string]$Text)

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return @()
  }

  return @(
    ($Text -split "\r?\n\s*\r?\n") |
      ForEach-Object { ($_ -replace "\r?\n", " ").Trim() } |
      Where-Object { $_ }
  )
}

function Parse-AreaTable {
  param([string]$SectionText)

  $rows = @()
  $lines = $SectionText -split "\r?\n"

  foreach ($line in $lines) {
    if (-not $line.Trim().StartsWith("|")) {
      continue
    }

    if ($line -match "^\|\s*-+\s*\|") {
      continue
    }

    $cells = @(
      ($line.Trim() -replace "^\|", "" -replace "\|$", "") -split "\|" |
        ForEach-Object { $_.Trim() }
    )

    if ($cells.Count -lt 4) {
      continue
    }

    if ($cells[0] -match "^.?rea$") {
      continue
    }

    $signalText = $cells[2]
    $signalLabel = if ($signalText -match "\b(ROJO|AMARILLO|VERDE|GRIS)\b") { $Matches[1] } else { "NO ESPECIFICADO" }

    $row = New-OrderedMap
    $row.area = $cells[0]
    $row.teacher = $cells[1]
    $row.signal = $signalLabel
    $row.signalText = $signalText
    $row.status = $cells[3]
    $rows += [pscustomobject]$row
  }

  return @($rows)
}

function Parse-Dimensions {
  param([string]$SectionText)

  if ([string]::IsNullOrWhiteSpace($SectionText)) {
    return @()
  }

  $pattern = '(?ms)^\*\*(.+?):\*\*\s*\[Nivel:\s*(.+?)\]\s*[^\p{L}\p{N}\r\n]{1,4}\s*(.*?)(?=^\*\*.+?:\*\*|\z)'
  $matches = [regex]::Matches($SectionText, $pattern)
  $results = @()

  foreach ($match in $matches) {
    $item = New-OrderedMap
    $item.name = $match.Groups[1].Value.Trim()
    $item.level = $match.Groups[2].Value.Trim()
    $item.summary = ($match.Groups[3].Value -replace "\r?\n", " ").Trim()
    $results += [pscustomobject]$item
  }

  return @($results)
}

function Parse-StudentBlock {
  param(
    [string]$Title,
    [string]$Body,
    [string]$SourceFile
  )

  $student = New-OrderedMap
  $student.id = Convert-ToSlug $Title
  $student.name = $Title.Trim()
  $student.grade = if ($Body -match "(?m)^\*\*Grado:\*\*\s*(.+)$") { $Matches[1].Trim() } else { "NO ESPECIFICADO" }
  $student.period = if ($Body -match "(?m)^\*\*Per.*?:\*\*\s*(.+)$") { $Matches[1].Trim() } else { "NO ESPECIFICADO" }

  $globalSection = Get-Section -Text $Body -HeadingPattern "Sem[^\r\n]*Global" -NextHeadingPatterns @("Sem[^\r\n]*por[^\r\n]*rea")
  $globalSignal = if ($globalSection -match "\b(ROJO|AMARILLO|VERDE|GRIS)\b") { $Matches[1] } else { "NO ESPECIFICADO" }

  $areaSection = Get-Section -Text $Body -HeadingPattern "Sem[^\r\n]*por[^\r\n]*rea" -NextHeadingPatterns @("Real[^\r\n]*General")
  $feedbackSection = Get-Section -Text $Body -HeadingPattern "Real[^\r\n]*General" -NextHeadingPatterns @("Dimensiones[^\r\n]*")
  $dimensionsSection = Get-Section -Text $Body -HeadingPattern "Dimensiones[^\r\n]*" -NextHeadingPatterns @("Se[^\r\n]*Tempranas[^\r\n]*Riesgo")
  $signalsSection = Get-Section -Text $Body -HeadingPattern "Se[^\r\n]*Tempranas[^\r\n]*Riesgo" -NextHeadingPatterns @("H[^\r\n]*bitos[^\r\n]*Patrones[^\r\n]*Comportamiento")
  $habitsSection = Get-Section -Text $Body -HeadingPattern "H[^\r\n]*bitos[^\r\n]*Patrones[^\r\n]*Comportamiento" -NextHeadingPatterns @("Recomendaciones[^\r\n]*")
  $recommendationsSection = Get-Section -Text $Body -HeadingPattern "Recomendaciones[^\r\n]*" -NextHeadingPatterns @()

  $parsedAreas = @(
    Parse-AreaTable $areaSection |
      Where-Object { $_ -and $_.PSObject -and $_.PSObject.Properties["signal"] }
  )

  $student.globalSignal = [pscustomobject]([ordered]@{
    label = $globalSignal
    summary = ($globalSection -replace "\r?\n", " ").Trim()
  })
  $student.areaSignals = $parsedAreas
  $student.feedbackParagraphs = Get-Paragraphs $feedbackSection
  $student.dimensions = Parse-Dimensions $dimensionsSection
  $student.earlyRiskSignals = Get-ListItems $signalsSection
  $student.behaviorPatterns = Get-ListItems $habitsSection
  $student.recommendations = Get-NumberedItems $recommendationsSection

  $colorCounts = [ordered]@{
    VERDE = 0
    AMARILLO = 0
    ROJO = 0
    GRIS = 0
  }

  foreach ($area in $student.areaSignals) {
    if ($colorCounts.Contains($area.signal)) {
      $colorCounts[$area.signal] += 1
    }
  }

  $student.derived = [pscustomobject]([ordered]@{
    areaColorCounts = [pscustomobject]$colorCounts
    grayAreas = $colorCounts["GRIS"]
    criticalAreas = $colorCounts["ROJO"]
    areasWithEvidence = @($parsedAreas | Where-Object { $_.signal -ne "GRIS" }).Count
  })
  $student.source = [pscustomobject]([ordered]@{
    file = $SourceFile
    heading = $Title
  })

  return [pscustomobject]$student
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$inputRoot = Join-Path $repoRoot "Informes Estudiantiles"
$outputRoot = Join-Path $repoRoot "Portal estudiantes"
$outputData = Join-Path $outputRoot "data\reports.json"

$markdownFiles = @(
  Get-ChildItem -Path $inputRoot -Recurse -File -Filter *.md | Sort-Object FullName
)

$ignoredFiles = @(
  Get-ChildItem -Path $inputRoot -Recurse -File |
    Where-Object { $_.Extension -ne ".md" } |
    Sort-Object FullName |
    ForEach-Object {
      [pscustomobject]([ordered]@{
        path = $_.FullName.Replace("$repoRoot\", "")
        reason = "Extensión no Markdown"
      })
    }
)

$documentTitle = "NO ESPECIFICADO"
$documentPeriod = "NO ESPECIFICADO"
$institution = "NO ESPECIFICADO"
$globalObservations = @()
$students = @()

foreach ($file in $markdownFiles) {
  $relativePath = $file.FullName.Replace("$repoRoot\", "")
  $raw = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  $text = Repair-Text $raw

  if ($text -match "(?m)^####\s+(.+)$") {
    $documentTitle = $Matches[1].Trim()
  }

  if ($text -match "(?m)^\*\*Per.*?:\*\*\s*(.+)$") {
    $documentPeriod = $Matches[1].Trim()
  }

  if ($text -match "(?m)^\*\*Inst.*?:\*\*\s*(.+)$") {
    $institution = $Matches[1].Trim()
  }

  $observationsMatch = [regex]::Match(
    $text,
    "(?ms)^#####\s+Observaciones Generales\s*\r?\n(.*?)(?=^---\s*$)"
  )

  if ($observationsMatch.Success) {
    $globalObservations = Get-ListItems $observationsMatch.Groups[1].Value
  }

  $blockMatches = [regex]::Matches(
    $text,
    "(?ms)^#####\s+(.+?)\s*\r?\n(.*?)(?=^---\s*$)"
  )

  foreach ($block in $blockMatches) {
    $title = $block.Groups[1].Value.Trim()

    if ($title -match "Observaciones Generales|.?NDICE DE ESTUDIANTES") {
      continue
    }

    $students += Parse-StudentBlock -Title $title -Body $block.Groups[2].Value.Trim() -SourceFile $relativePath
  }
}

$globalSignalCounts = [ordered]@{
  VERDE = 0
  AMARILLO = 0
  ROJO = 0
  GRIS = 0
}

$areaSignalTotals = [ordered]@{
  VERDE = 0
  AMARILLO = 0
  ROJO = 0
  GRIS = 0
}

$dimensionLevelTotals = @{}
$criticalAreas = @{}

foreach ($student in $students) {
  if ($globalSignalCounts.Contains($student.globalSignal.label)) {
    $globalSignalCounts[$student.globalSignal.label] += 1
  }

  foreach ($area in $student.areaSignals) {
    if ($areaSignalTotals.Contains($area.signal)) {
      $areaSignalTotals[$area.signal] += 1
    }

    if ($area.signal -in @("ROJO", "AMARILLO")) {
      if (-not $criticalAreas.Contains($area.area)) {
        $criticalAreas[$area.area] = [ordered]@{ total = 0; ROJO = 0; AMARILLO = 0 }
      }
      $criticalAreas[$area.area].total += 1
      $criticalAreas[$area.area][$area.signal] += 1
    }
  }

  foreach ($dimension in $student.dimensions) {
    if (-not $dimensionLevelTotals.ContainsKey($dimension.name)) {
      $dimensionLevelTotals[$dimension.name] = @{}
    }

    if (-not $dimensionLevelTotals[$dimension.name].ContainsKey($dimension.level)) {
      $dimensionLevelTotals[$dimension.name][$dimension.level] = 0
    }

    $dimensionLevelTotals[$dimension.name][$dimension.level] += 1
  }
}

$criticalAreasList = @(
  $criticalAreas.GetEnumerator() |
    Sort-Object { $_.Value.total } -Descending |
    ForEach-Object {
      [pscustomobject]([ordered]@{
        area = $_.Key
        total = $_.Value.total
        red = $_.Value.ROJO
        yellow = $_.Value.AMARILLO
      })
    }
)

$payload = [ordered]@{
  generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
  source = [ordered]@{
    inputDirectory = "Informes Estudiantiles"
    outputDirectory = "Portal estudiantes"
    markdownFiles = @($markdownFiles | ForEach-Object { $_.FullName.Replace("$repoRoot\", "") })
    ignoredFiles = $ignoredFiles
  }
  document = [ordered]@{
    title = $documentTitle
    period = $documentPeriod
    institution = $institution
    observations = $globalObservations
  }
  derived = [ordered]@{
    totalStudents = $students.Count
    globalSignalCounts = [pscustomobject]$globalSignalCounts
    areaSignalTotals = [pscustomobject]$areaSignalTotals
    criticalAreas = $criticalAreasList
    dimensionLevelTotals = $dimensionLevelTotals
  }
  students = $students
}

$null = New-Item -Path (Split-Path $outputData -Parent) -ItemType Directory -Force
$json = $payload | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($outputData, $json, [System.Text.UTF8Encoding]::new($false))
Write-Host "Generated $outputData"
