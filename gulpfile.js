let gulp = require("gulp");
let ts_tasks = require('./scripts/typescript_tasks.js');
var jasmineNode = require('gulp-jasmine-node');

let module_build_path = '/build/compiled/modules/';
let sandbox_build_path = '/build/compiled/sandbox/';

require('app-module-path').addPath('.' + module_build_path);

function build_module(path_name, module_name, done) {
  let output_dir = __dirname + module_build_path + module_name; 
  let tsconfig_file_name = 'modules/' + path_name + '/' + 'tsconfig.json';

  let options = ts_tasks.create_project(); 
    options.project = tsconfig_file_name;
    options.outDir = output_dir;

  return ts_tasks.build_project(options, done);
}

function build_sandbox(sandbox_name, done) {
  let output_dir = __dirname + sandbox_build_path + sandbox_name; 
  let tsconfig_file_name = 'sandbox/' + sandbox_name + '/' + 'tsconfig.json';

  let options = ts_tasks.create_project(); 
    options.project = tsconfig_file_name;
    options.outDir = output_dir;

  return ts_tasks.build_project(options, done);
}

gulp.task('sdb_core', function (done) {
  return build_module('core', 'sdb_core', done);
});

gulp.task('sdb_client', ['sdb_core'], function (done) {
  return build_module('client', 'sdb_client', done);
});

gulp.task('sdb_store_memory_simple', ['sdb_core'], function (done) {
  return build_module('store/memory_simple', 'sdb_store_memory_simple', done);
});

gulp.task('sdb_shared_agent_memory_simple', ['sdb_core'], function (done) {
  return build_module('shared_agent/memory_simple', 'sdb_shared_agent_memory_simple', done);
});

gulp.task('making', ['sdb_client', 'sdb_store_memory_simple', 'sdb_shared_agent_memory_simple'], function (done) {
  return build_sandbox('making', done);
});

gulp.task('run_making', function () {
  return gulp.src(['build/compiled/sandbox/making/**/*.js']).pipe(jasmineNode({
    timeout: 10000
  }));
});

gulp.task('docs_deploy', function (done) {
  return gulp.src(['docs/build/html/**/*']).pipe(gulp.dest('website/content/docs'));
});