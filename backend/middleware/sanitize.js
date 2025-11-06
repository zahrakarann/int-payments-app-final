// Deep sanitization middleware for req.body, req.query and req.params.
// Removes any keys starting with '$' and any keys containing '.' to prevent NoSQL injection.
// Also exports escapeRegex to safely build RegExp from user input.

function deepSanitize(obj) {
  if (!obj || typeof obj !== 'object') return;

  // Arrays: sanitize each item
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object') deepSanitize(obj[i]);
    }
    return;
  }

  // Objects: iterate keys
  for (const key of Object.keys(obj)) {
    // Remove dangerous keys
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }

    const val = obj[key];
    // If nested object/array, sanitize recursively
    if (val && typeof val === 'object') {
      deepSanitize(val);
    } else {
      // Optionally: trim strings (avoid accidental leading/trailing whitespace)
      if (typeof val === 'string') {
        obj[key] = val.trim();
      }
    }
  }
}

function sanitizeMiddleware(req, res, next) {
  try {
    deepSanitize(req.body);
    deepSanitize(req.query);
    deepSanitize(req.params);
  } catch (err) {
    // Log but don't crash
    console.error('Sanitize middleware error:', err);
  }
  next();
}

// Escape user input for safe use in RegExp (e.g. searching)
// Example use: new RegExp(escapeRegex(q), 'i')
function escapeRegex(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  sanitizeMiddleware,
  escapeRegex,
};
