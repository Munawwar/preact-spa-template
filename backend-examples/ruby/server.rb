require 'sinatra'
require 'json'
require_relative 'preact-iso-url-pattern'

set :port, ENV['PORT'] || 5173
set :public_folder, File.join(Dir.pwd, 'dist')

root = File.expand_path('../..', __dir__)
client_side_managed_routes = JSON.parse(File.read(File.join(root, 'dist', 'routes.json')))
vite_prod_manifest = JSON.parse(File.read(File.join(root, 'dist', '.vite', 'manifest.json')))

get '/*' do
  template = File.read(File.join(root, 'dist', 'index.html'))

  matching_route = client_side_managed_routes.find do |route|
    preact_iso_url_pattern_match(request.path, route['path'])
  end

  title = matching_route&.dig('title')
  entry_file_name = matching_route&.dig('Component')
  manifest_entry = vite_prod_manifest[entry_file_name] || {}

  preload_js = (manifest_entry['imports']&.dup || [])
    .concat([manifest_entry['file']])
    .compact
    .reject { |file| file.end_with?('.html') }
    .map { |file| "/public/#{file}" }

  preload_css = (manifest_entry['css']&.dup || [])
    .map { |file| "/public/#{file}" }

  head_content = [
    title ? "<title>#{title}</title>" : nil,
    *preload_js.map { |js| %(<link rel="modulepreload" crossorigin href="#{js}">) },
    *preload_css.map { |css| %(<link rel="stylesheet" crossorigin href="#{css}">) }
  ].compact.join("\n")

  html = template.sub('<!-- ssr-head-placeholder -->', head_content)

  content_type 'text/html'
  html
end
