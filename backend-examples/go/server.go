package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"runtime"
)

type Route struct {
	Path      string `json:"path"`
	Title     string `json:"title"`
	Component string `json:"Component"`
}

func main() {
	// Get the current file's directory
	_, filename, _, _ := runtime.Caller(0)
	root := filepath.Dir(filepath.Dir(filepath.Dir(filename)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "5173"
	}

	// Read routes
	routesFile, err := ioutil.ReadFile(filepath.Join(root, "dist", "routes.json"))
	if err != nil {
		log.Fatal(err)
	}
	var clientSideManagedRoutes []Route
	json.Unmarshal(routesFile, &clientSideManagedRoutes)

	// Read manifest
	manifestFile, err := ioutil.ReadFile(filepath.Join(root, "dist", ".vite", "manifest.json"))
	if err != nil {
		log.Fatal(err)
	}
	var viteProdManifest map[string]interface{}
	json.Unmarshal(manifestFile, &viteProdManifest)

	// Serve static files
	fs := http.FileServer(http.Dir(filepath.Join(root, "dist")))
	http.Handle("/public/", http.StripPrefix("/public/", fs))

	// Main handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		template, err := ioutil.ReadFile(filepath.Join(root, "dist", "index.html"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var matchingRoute Route
		for _, route := range clientSideManagedRoutes {
			if preactIsoUrlPatternMatch(r.URL.Path, route.Path) {
				matchingRoute = route
				break
			}
		}

		manifestEntry, ok := viteProdManifest[matchingRoute.Component].(map[string]interface{})
		if !ok {
			manifestEntry = make(map[string]interface{})
		}

		preloadJS := []string{}
		if imports, ok := manifestEntry["imports"].([]interface{}); ok {
			for _, imp := range imports {
				if s, ok := imp.(string); ok && !strings.HasSuffix(s, ".html") {
					preloadJS = append(preloadJS, fmt.Sprintf("/public/%s", s))
				}
			}
		}
		if file, ok := manifestEntry["file"].(string); ok {
			preloadJS = append(preloadJS, fmt.Sprintf("/public/%s", file))
		}

		preloadCSS := []string{}
		if css, ok := manifestEntry["css"].([]interface{}); ok {
			for _, c := range css {
				if s, ok := c.(string); ok {
					preloadCSS = append(preloadCSS, fmt.Sprintf("/public/%s", s))
				}
			}
		}

		headContent := []string{}
		if matchingRoute.Title != "" {
			headContent = append(headContent, fmt.Sprintf("<title>%s</title>", matchingRoute.Title))
		}
		for _, js := range preloadJS {
			headContent = append(headContent, fmt.Sprintf(`<link rel="modulepreload" crossorigin href="%s">`, js))
		}
		for _, css := range preloadCSS {
			headContent = append(headContent, fmt.Sprintf(`<link rel="stylesheet" crossorigin href="%s" as="style">`, css))
		}

		html := strings.Replace(string(template), "<!-- ssr-head-placeholder -->", strings.Join(headContent, "\n"), 1)

		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(html))
	})

	log.Printf("Listening on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
