<?php
// Run program: php preact-iso-url-pattern.php

function preactIsoUrlPatternMatch($url, $route) {
    $url = array_filter(explode('/', $url));
    $route = array_filter(explode('/', $route ?? ''));

    for ($i = 0; $i < max(count($url), count($route)); $i++) {
        preg_match('/^(:?)(.*?)([+*?]?)$/', $route[$i] ?? '', $matches);
        $m = $matches[1] ?? '';
        $param = $matches[2] ?? '';
        $flag = $matches[3] ?? '';
        $val = $url[$i] ?? null;

        // segment match:
        if (!$m && $param == $val) continue;

        // /foo/* match
        if (!$m && $val && $flag == '*') {
            break;
        }

        // segment mismatch / missing required field:
        if (!$m || (!$val && $flag != '?' && $flag != '*')) return false;

        $rest = $flag == '+' || $flag == '*';

        if ($rest) break;
    }

    return true;
}

// Example usage:
// var_dump(preactIsoUrlPatternMatch("/foo/bar", "/foo/:param"));
// var_dump(preactIsoUrlPatternMatch("/foo/bar/baz", "/foo/*"));
// var_dump(preactIsoUrlPatternMatch("/foo", "/foo/:param?"));
// var_dump(preactIsoUrlPatternMatch("/foo/bar", "/bar/:param"));
// var_dump(preactIsoUrlPatternMatch('/users/test%40example.com/posts', '/users/:userId/posts'));
?>