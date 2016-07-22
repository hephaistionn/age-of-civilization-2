const replace = require('gulp-replace');

module.exports = function(gulp) {

    /**
     * prepare obj
     */
    gulp.task('packageOBJ', function() {

        const regexCleanObj = /^(m|u|#|s).*$/mg;
        const regexEmptyLine = /^\s*$/gm;

        return gulp.src('./assets/obj/**/*.obj')
            .pipe(replace(regexCleanObj, ''))
            .pipe(replace(regexEmptyLine, ''))
            .pipe(gulp.dest('./assets/obj/',{overwrite: true}));
    });

};
