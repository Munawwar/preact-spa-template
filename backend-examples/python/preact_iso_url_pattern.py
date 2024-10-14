# Run program: python3 preact-iso-url-pattern.py

def preact_iso_url_pattern_match(url, route):
    url = list(filter(None, url.split('/')))
    route = list(filter(None, (route or '').split('/')))

    for i in range(max(len(url), len(route))):
        m, param, flag = '', '', ''
        if i < len(route):
            parts = route[i].split(':')
            m = ':' if len(parts) > 1 else ''
            param = parts[-1]
            flag = ''
            if param and param[-1] in '+*?':
                flag = param[-1]
                param = param[:-1]

        val = url[i] if i < len(url) else None

        # segment match:
        if not m and param == val:
            continue

        # /foo/* match
        if not m and val and flag == '*':
            break

        # segment mismatch / missing required field:
        if not m or (not val and flag != '?' and flag != '*'):
            return False

        rest = flag in ('+', '*')

        if rest:
            break

    return True

# Example usage:
# print(preact_iso_url_pattern_match("/foo/bar", "/foo/:param"))
# print(preact_iso_url_pattern_match("/foo/bar/baz", "/foo/*"))
# print(preact_iso_url_pattern_match("/foo", "/foo/:param?"))
# print(preact_iso_url_pattern_match("/foo/bar", "/bar/:param"))
# print(preact_iso_url_pattern_match('/users/test%40example.com/posts', '/users/:userId/posts'))