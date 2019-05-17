function factory(key, label, value) {
  return { key, label, value };
}

module.exports = function config(options) {
  return {
    path: factory('path', 'path', ''),
    author: factory('author', 'author', options.author || ''),
    scripts: factory('scripts', 'npm build process', ''),
    description: factory('description', 'description', options.description || ''),
    license: factory('license', 'legal stuff', options.license || 'GNU'),
    version: factory('version', 'version', options.version || '0.1.0'),
    main: factory('main', 'entry point', options['entry point'] || 'index.js'),
    keywords: factory('keywords', 'search terms or keywords', options.keywords || []),
    repository: factory('repository', 'git', {}),
  };
};
