const Metalsmith = require('metalsmith'),
	  metadata = require('metalsmith-metadata'),
	  markdown = require('metalsmith-markdownit'),
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
	.use(clearCollections(['qss']))
	.use(collections({
		qss: {
			pattern: 'help/qss/**/*',
			metadata: {
				name: 'The QuickSetStrip',
				description: 'All information about the QuickSet Strip'
			}
		}
	}))
	// .use(function(pages, metalsmith, done) {
	// 	const metadata = metalsmith.metadata();
	// 	console.log(metadata);
	// 	done();
	// })
	.use(autotoc({
		selector: 'h2, h3, h4, h5, h6'
	}))
	.use(inplace({
		engine: 'nunjucks',
		pattern: 'contents/**/*',
		suppressNoFilesError: true,
		engineOptions: {
			cache: false
		}
	}))
	.use(markdown({
		typographer: true,
		html: true
	}))
	.use(layouts({
			engine: 'nunjucks',
			engineOptions: {
				cache: false
			},
			pattern: '**/*',
			directory: 'layouts',
			default: 'page.njk'
		}))
	.use(path({
		baseDirectory: '/'
	}))
	.use(permalinks({
		relative: false
	}))
	.use(assets({
		source: './assets',
		destination: ''
	}));


function clearCollections(collectionNames) {
	return function(files, metalsmith, done) {
		let metadata = metalsmith.metadata();

		for (let collection of collectionNames) {
			if (collection in metadata) {
				metadata[collection] = [];
			}
		}

		metalsmith.metadata(metadata);
		done();
	}
}
