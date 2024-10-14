<?php

require_once 'preact-iso-url-pattern.php';

$root = dirname(__DIR__, 2);
$port = getenv('PORT') ?: 5173;

$clientSideManagedRoutes = json_decode(file_get_contents("$root/dist/routes.json"), true);
$viteProdManifest = json_decode(file_get_contents("$root/dist/.vite/manifest.json"), true);

$requestUri = $_SERVER['REQUEST_URI'];
$publicUrlPath = '/public';

function ends_with($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }
    return (substr($haystack, -$length) === $needle);
}
    

if (strpos($requestUri, $publicUrlPath) === 0) {
    $filePath = $root . '/dist' . substr($requestUri, strlen($publicUrlPath));
    if (file_exists($filePath)) {
        $mimeType = mime_content_type($filePath);
        header("Content-Type: $mimeType");
        readfile($filePath);
        exit;
    }
}

$template = file_get_contents("$root/dist/index.html");

$matchingRoute = null;
foreach ($clientSideManagedRoutes as $route) {
    if (preactIsoUrlPatternMatch($requestUri, $route['path'])) {
        $matchingRoute = $route;
        break;
    }
}

$title = $matchingRoute['title'] ?? '';
$entryFileName = $matchingRoute['Component'] ?? '';
$manifestEntry = $viteProdManifest[$entryFileName] ?? [];

$preloadJS = array_merge($manifestEntry['imports'] ?? [], [$manifestEntry['file'] ?? null]);
$preloadJS = array_filter($preloadJS, function($file) {
    return $file && !ends_with($file, '.html');
});
$preloadJS = array_map(function($file) use ($publicUrlPath) {
    return "$publicUrlPath/$file";
}, $preloadJS);

$preloadCSS = array_map(function($file) use ($publicUrlPath) {
    return "$publicUrlPath/$file";
}, $manifestEntry['css'] ?? []);

$headContent = [];
if ($title) {
    $headContent[] = "<title>$title</title>";
}
foreach ($preloadJS as $js) {
    $headContent[] = "<link rel=\"modulepreload\" crossorigin href=\"$js\">";
}
foreach ($preloadCSS as $css) {
    $headContent[] = "<link rel=\"stylesheet\" crossorigin href=\"$css\" as=\"style\">";
}

$html = str_replace('<!-- ssr-head-placeholder -->', implode("\n", $headContent), $template);

header('Content-Type: text/html');
echo $html;
