// Run program: go run preact-iso-url-pattern.go

package main

import (
	// "fmt"
	"regexp"
	"strings"
)

func preactIsoUrlPatternMatch(urlStr, route string) bool {
	url := filterEmpty(strings.Split(urlStr, "/"))
	routeParts := filterEmpty(strings.Split(route, "/"))

	for i := 0; i < max(len(url), len(routeParts)); i++ {
		var m, param, flag string
		if i < len(routeParts) {
			re := regexp.MustCompile(`^(:?)(.*?)([+*?]?)$`)
			matches := re.FindStringSubmatch(routeParts[i])
			if len(matches) > 3 {
				m, param, flag = matches[1], matches[2], matches[3]
			}
		}

		var val string
		if i < len(url) {
			val = url[i]
		}

		// segment match:
		if m == "" && param == val {
			continue
		}

		// /foo/* match
		if m == "" && val != "" && flag == "*" {
			break
		}

		// segment mismatch / missing required field:
		if m == "" || (val == "" && flag != "?" && flag != "*") {
			return false
		}

		rest := flag == "+" || flag == "*"

		if rest {
			break
		}
	}

	return true
}

func filterEmpty(s []string) []string {
	var result []string
	for _, str := range s {
		if str != "" {
			result = append(result, str)
		}
	}
	return result
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// Example usage:
// func main() {
// 	fmt.Println(preactIsoUrlPatternMatch("/foo/bar", "/foo/:param"))
// 	fmt.Println(preactIsoUrlPatternMatch("/foo/bar/baz", "/foo/*"))
// 	fmt.Println(preactIsoUrlPatternMatch("/foo", "/foo/:param?"))
// 	fmt.Println(preactIsoUrlPatternMatch("/foo/bar", "/bar/:param"))
// 	fmt.Println(preactIsoUrlPatternMatch("/users/test%40example.com/posts", "/users/:userId/posts"))
// }
