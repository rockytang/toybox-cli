#!/usr/bin/env node

/*
 * toybox-cli
 * https://github.com/garrettjoecox/toybox-cli
 *
 * Copyright (c) 2015, Garrett Cox
 * Licensed under the MIT license.
 */

/**
 * Module dependencies.
 */

var program = require('commander'),
    updateNotifier = require('update-notifier'),
    Insight = require('insight'),
    _ = require('underscore'),
    banner = require('../lib/banner.js'),
    Api = require('..'),
    api = new Api('access_token'),
    path = require('path'),
    debug = require('../lib/debugger.js'),
    pkg = require('../package.json'),
    gulp = require('gulp'),
    fs = require('fs'),
    gulpGulp = require('gulp-gulp'),
    ginstall = require('gulp-install'),
    sequence = require('gulp-sequence'),
    shell = require('gulp-shell'),
    inquirer = require('inquirer')

require('colors');

if(process.argv.length === 2){
    console.log("Thanks for using Toybox! (By Garrett Cox)".grey);
    console.log("Run 'toybox init' to get started!".grey);
}

program
    .command('init')
    .action(function(){
        inquirer.prompt([{type:'input',name:'username',message:'Enter Github username!'},{type:'input',name:'date',message:'When did you start @ HR? (2015-02, 2014-12, etc)'}], function(answers){
            gulp.task('copy', copy())
            gulp.task('clone', clone(answers.username, answers.date)).start();
        })
    })

program
    .command('start')
    .action(function(){
        if(fs.existsSync(process.cwd()+'/gulpfile.js')){
            gulp.task('runGulpFile', runGulp()).start();
        }else{
            console.log("You're not in a Toybox!".bold.red);
            console.log("run 'Toybox new'".grey);
        }
    });


function runGulp(){
    return function(){
        return gulp.src(process.cwd()+'/gulpfile.js')
            .pipe(gulpGulp());
    }
}

function clone(username, date){
    return shell.task([
        'git clone https://github.com/' + username + '/' + date + '-toy-problems.git toybox/toy-problems-repo'
    ]);
}

function copy(){
    return function(){
        var toybox = path.join(__dirname, '../lib/ToyBox/**/*');
        return gulp.src(toybox)
            .pipe(gulp.dest(process.cwd()+'/toybox'))
            .pipe(ginstall());
    }
}



program.parse(process.argv);