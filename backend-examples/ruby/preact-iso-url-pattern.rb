# Run program: ruby preact-iso-url-pattern.rb

def preact_iso_url_pattern_match(url, route)
  url = url.split('/').reject(&:empty?)
  route = (route || '').split('/').reject(&:empty?)

  (0...[url.length, route.length].max).each do |i|
    m, param, flag = route[i]&.match(/^(:?)(.*?)([+*?]?)$/)&.captures || ['', '', '']
    val = url[i]

    # segment match:
    next if m.empty? && param == val

    # /foo/* match
    break if m.empty? && val && flag == '*'

    # segment mismatch / missing required field:
    return false if m.empty? || (!val && flag != '?' && flag != '*')

    rest = flag == '+' || flag == '*'

    break if rest
  end

  true
end

# Example usage:
# puts preact_iso_url_pattern_match("/foo/bar", "/foo/:param")
# puts preact_iso_url_pattern_match("/foo/bar/baz", "/foo/*")
# puts preact_iso_url_pattern_match("/foo", "/foo/:param?")
# puts preact_iso_url_pattern_match("/foo/bar", "/bar/:param")
# puts preact_iso_url_pattern_match('/users/test%40example.com/posts', '/users/:userId/posts')