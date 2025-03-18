# Changelog

## 3.0.0 (2025-03-18)

### Breaking Changes
- Complete rewrite of the component using Lit 3.1
- Removed Polymer dependencies
- Simplified API and improved performance
- Removed outdated polyfills and dependencies

### Features
- Modern shadow DOM implementation
- Improved CSS custom properties for styling
- Better event handling
- Enhanced placeholder support
- Simplified demo page with interactive examples
- Added `debug` property for detailed logging to help with troubleshooting
- Added `disableWorker` property to control Ace editor worker scripts
- Improved worker script handling in development environments
- Added simple test page for easier debugging
- Enhanced documentation with new properties

### Migration
- The legacy Polymer implementation is still available as `ace-widget-old.js`
- The API remains largely the same, so most attributes and properties should work as before
- CSS styling now uses standard custom properties instead of Polymer mixins
