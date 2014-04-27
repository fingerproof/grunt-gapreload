/*jshint node:true */

var register = require('register-grunt-sub-tasks');
var variables = register.unpack('SERVER LIVERELOAD', '$1_HOST $1_PORT');

function cordova(command, format) {
  command = 'cordova ' + command;
  function task(config, grunt) {
    function cmd() { return command + format(arguments, config, grunt); }
    return { cmd: cmd, cwd: config('cwd') || 'cordova' };
  }
  return { type: 'exec', task: task };
}

function add(format, _) {
  var url = 'https://github.com/fingerproof/cordova-plugin-gapreload';
  var command = 'plugin add ' + url;
  return cordova(command, function formatter(params, config, grunt) {
    return format(variables, function separator(key, index) {
      var value = params[index] || config(key);
      // `variables[3]` equals `"LIVERELOAD_PORT"`.
      if (key === variables[3] && !value) {
        var port = grunt.config('watch.gapreload.options.livereload');
        // According to the doc, this can be a boolean, a number
        // or an object containing a `port` key storing a number.
        if (_.isPlainObject(port)) { port = port.port; }
        if (_.isNumber(port)) { value = port; }
      }
      return value ? ' --variable ' + key + '="' + value + '"' : '';
    });
  });
}

function serve(format) {
  return cordova('serve', function formatter(params, config) {
    // `variables[1]` equals `"SERVER_PORT"`.
    return format.shell(params[0] || config(variables[1]));
  });
}

function watch() {
  var task = {
    // Sadly, grunt-concurrent is not designed to dynamically
    // pass arguments to the tasks it runs, maybe someday?
    tasks: ['gapreload-serve', 'watch:gapreload'],
    options: { logConcurrentOutput: true }
  };
  return { type: 'concurrent', task: task };
}

function remove() {
  function noop() { return ''; }
  return cordova('plugin remove pro.fing.cordova.gapreload', noop);
}

function prepare(format) {
  return cordova('prepare', function formatter(params, config) {
    return format.shell(params.length ? params : config('platforms'));
  });
}

function gapreload(format) {
  function task(config, grunt) {
    return function () {
      var params = format.grunt(arguments);
      // Pass `params` to gapreload-watch even if it won't handle them yet.
      var tasks = register.unpack('add watch', 'gapreload-$1' + params);
      grunt.task.run(tasks);
    };
  }
  return { type: 'grunt', task: task };
}

module.exports = register('gapreload', {
  'add: Installs the Cordova GapReload plugin if needed.': add,
  'serve: Executes `$ cordova serve <port>`.': serve,
  'watch: Runs \'<%= sup %>-serve\' and \'watch:<%= sup %>\'.': watch,
  'remove: Uninstalls the Cordova GapReload plugin.': remove,
  'prepare: Executes `$ cordova prepare <platforms>`.': prepare,
  '<%= sup %>: Runs \'<%= sup %>-add\' and \'<%= sup %>-watch\'.': gapreload
});
