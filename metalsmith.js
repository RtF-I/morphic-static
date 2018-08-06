const Metalsmith = require('metalsmith'),
	  metadata = require('metalsmith-metadata'),
	  markdown = require('metalsmith-markdown'),
	  layouts = require('metalsmith-layouts'),
	  inplace = require('metalsmith-in-place'),
	  permalinks = require('metalsmith-permalinks'),
	  collections = require('metalsmith-collections'),
	  assets = require('metalsmith-assets'),
	  path = require('metalsmith-path'),
	  autotoc = require('metalsmith-autotoc');

module.exports = Metalsmith(__dirname)
	.use(metadata({
		site: 'site.json'	
	}))
	.clean(true)
	.source('./contents')
	.destination('./build')
	.use(collections({
		qss: {
			pattern: 'help/qss/**/*',
			metadata: {
				name: 'The QuickSetStrip',
				description: 'All information about the QuickSet Strip'
			}
		}
	}))
	.use(function(pages, metalsmith, done) {
		const metadata = metalsmith.metadata();
		console.log(metadata);
		done();
	})
	.use(inplace({
		engine: 'nunjucks',
		engineOptions: {
			cache: false
		}
	}))
	.use(markdown())
	.use(autotoc({
		selector: 'h2, h3, h4'
	}))
	.use(layouts({
		engine: 'nunjucks',
		engineOptions: {
			cache: false
		},
		pattern: '**/*',
		directory: 'layouts',
		default: 'layout.njk'
	}))
	.use(permalinks({
		relative: false
	}))
	.use(path({
		baseDirectory: '/'
	}))
	.use(assets({
		source: './assets',
		destination: ''
	}));