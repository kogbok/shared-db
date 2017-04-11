var gutil = require('gulp-util');
var exec = require('child_process').exec;

module.exports = {
  create_project: function() {
    return {
      declaration: 'true',
      module: "commonjs",
      moduleResolution: "node",
      sourceMap: 'true',
      target: 'es2015',

      to_string: function() {
        var parameters = '';
        for (var o in this) {
          if(typeof this[o] === 'string')
            parameters += '--' + o + ' ' + this[o] + ' ';
          else if (o != 'to_string')
            console.log("typesctipy create_project::to_string error when parsing option : " + o);
        }
        return parameters;
      }
    };
  },

  build_project: function (options, done) {
    var  command = 'tsc ' + options.to_string();
    console.log('typescript cmd: ' + command);

    exec(command, function (err, stdout, stderr) {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      done(err);
    });
  }
};
