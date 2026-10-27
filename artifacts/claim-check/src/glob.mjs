// Minimal glob matcher for path-scope checks. Zero dependencies.
// Supports: ** (any depth), * (single segment), literal segments, leading '/' optional.
export function globToRegExp(glob) {
  const g = glob.replace(/^\/+/, "");
  let out = "";
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === "*") {
      if (g[i + 1] === "*") {
        // '**' -> any characters including '/'
        let j = i + 2;
        if (g[j] === "/") j++; // '**/' may match zero segments
        out += "(?:.*)";
        i = j - 1;
      } else {
        out += "[^/]*";
      }
    } else if (c === "?") out += "[^/]";
    else out += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp("^" + out + "$");
}

export function matchesGlob(path, glob) {
  return globToRegExp(glob).test(path.replace(/^\/+/, ""));
}

export function matchesAnyGlob(path, globs) {
  return globs.some((g) => matchesGlob(path, g));
}
