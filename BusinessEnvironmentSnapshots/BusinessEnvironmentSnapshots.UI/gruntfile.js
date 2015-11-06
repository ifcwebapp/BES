module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var destFolder = '../gh-pages';

    grunt.initConfig({
        less: {
            all: {
                files: {
                    "styles/root.css": "styles/root.less"
                },
                options: {
                    sourceMap: true,
                    sourceMapRootpath: '../../',
                    sourceMapURL: 'root.css.map'
                }
            }
        },
        watch: {
            'less': {
                files: ['styles/**/*.less'],
                tasks: ['less:all'],
                options: {
                    debounceDelay: 100
                }
            }
        }
    });
}