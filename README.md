grunt-gapreload
===============

A Grunt tasks for the Cordova/PhoneGap [GapReload][GapReload] plugin.

## Installation

1. Install the [Grunt][Grunt] CLI: `$ npm install -g grunt-cli` (you may need to use `sudo`).
2. Install the [Apache Cordova][Cordova] 3 CLI: `$ npm install -g cordova` (you may need to use `sudo`).
3. `cd` into your project's root directory.
4. Create a *package.json* (for example using `$ npm init`).
5. Execute `$ npm install grunt-gapreload --save-dev`.
6. [Create][Cordova CLI] a Cordova project: `$ cordova create <path> <id> <name>`.
7. Add the platforms you need : `$ cd <path> && cordova platforms add <platforms>`.

## Tasks

*grunt-gapreload* comes with a bunch of useful *gapreload-* prefixed tasks. Execute `$ grunt --help` to know more about them.

## Setup

### Minimal

Then the only thing you really need to do is to create a file named *Gruntfile.js* (alongside your *package.json*) whose content will be something like this:

```javascript
module.exports = function (grunt) {
  grunt.initConfig({
    watch: {
      gapreload: {
        files: [
          'cordova/merges/**/*',
          'cordova/www/**/*'
        ],
        tasks: 'gapreload-prepare',
        options: { livereload: true }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gapreload');
};
```

### Full

#### Global

You can configure the task by adding some options to your `grunt.initConfig` call like so (default values):

```javascript
gapreload: {
  options: {
    // "cordova working directory", where the Cordova project is located
    cwd: 'cordova',
    // some platforms names to delegate to the Cordova `prepare` command
    // can be an array of names or a string containing a single name
    // a falsy value mean (or an empty array) means all installed
    platforms: undefined,
    // see the GapReload Cordova/PhoneGap plugin documentation
    // for more informations about the variables below
    SERVER_HOST: undefined,
    SERVER_PORT: 8000,
    LIVERELOAD_HOST: undefined,
    LIVERELOAD_PORT: 35729
  }
}
```

#### Per task

Some *grunt-gapreload* exposed tasks accept parameters:

| Task              | Parameters                 | Default value            |
|-------------------|----------------------------|--------------------------|
| gapreload-add     | [:\<GapReload variable>]*  | See above, same order    |
| gapreload-serve   | [:\<SERVER_PORT>]          | 8000                     |
| gapreload-prepare | [:\<platform name>]*       | undefined, all installed |
| gapreload         | [:\<GapReload variable>]*  | See above, same order    |

For example: `$ grunt gapreload-add:192.168.0.10:8888 gapreload-prepare:ios:android`.

Parameters are accessed in the following order: **Per task > `gapreload.options[name]` > default value**. The only exeption to this rule is the `LIVERELOAD_PORT` variable which can also get its value from `watch.gapreload.options.livereload` (see the [grunt-contrib-watch][grunt-contrib-watch] documentation for more informations).

## Usage

1. `cd` into your Cordova app folder previously created using the `cordova create` command.
2. Execute for example `$ grunt gapreload-add:192.168.0.10` once so that the plugin is installed.
3. Follow GapReload usage instructions in your terminal window and you will be good to go.

## Notes

- Installing *grunt-gapreload* will also install *grunt*, *grunt-contrib-watch*, *[grunt-concurrent][grunt-concurrent]* and *[grunt-exec][grunt-exec]* as *[peerDependencies][peerDependencies]*.
- The watch target for *grunt-gapreload* **have to be named** *gapreload*.
- The *grunt-gapreload* task **have to be loaded after** calling `grunt.initConfig`.


[GapReload]: https://github.com/fingerproof/cordova-plugin-gapreload
[Grunt]: http://gruntjs.com
[Cordova]: http://cordova.apache.org
[Cordova CLI]: http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch
[grunt-concurrent]: https://github.com/sindresorhus/grunt-concurrent
[grunt-exec]: https://github.com/jharding/grunt-exec
[peerDependencies]: blog.nodejs.org/2013/02/07/peer-dependencies/
