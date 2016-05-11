
# DATASETS
RISIS datasets portal

## Quick Start

###Installation

You should have installed [NodeJS](https://nodejs.org/), [npm](https://github.com/npm/npm), [bower](http://bower.io/) and [Webpack](https://webpack.github.io/) on your system as prerequisite, then:

Clone the repository: `git clone https://github.com/ali1k/ld-r.git`

and simply run `./install` script

###Configuration
Fill in general settings for your application at `configs/general.js`.

Fill in appropriate values for server port, URLs of your SPARQL endpoint and DBpedia lookup service at `configs/server.js`.

Fll in appropriate settings for your UI reactors at `configs/reactor.js`.

Fill in appropriate settings for the faceted browser at `configs/facets.js`.

###Run in Production Mode

`npm run build`

check server at `localhost:5001`

###Development Mode

`npm run dev`

check server at `localhost:3000`

## Documentation

Check out http://ld-r.org for detailed documentation.
