//server
const fs = require("fs");
const path = require("path");
const file_utils = require("./file_utils");
const WordStatistics = require("./core/WordStatistics");

const FileUtils = require("./core/FileUtils");
const SourceCodeTokenizer = require("./core/SourceCodeTokenizer");

const CONFIG = require("./config");
const TARGET_DIRECTORY = CONFIG.target_directories[CONFIG.using_directory_index];
const IGNORE_LIST = CONFIG.ignore_file_group[CONFIG.using_ignore_group];

const all_statics = new WordStatistics("all");
const dirs_statics = {};
const files_static = {};

const file_list = FileUtils.traceDirectory(TARGET_DIRECTORY, IGNORE_LIST);
let prev_dir = null;
let prev_file = null;
file_list.map(item => {
  console.log(item.path);
  if (prev_dir !== item.dir) prev_dir = item.dir;
  if (prev_file !== item.file) prev_file = item.file;
  const tokens = SourceCodeTokenizer.tokenize(item);
  tokens.map(item => {
    if (dirs_statics[prev_dir] === undefined)
      dirs_statics[prev_dir] = new WordStatistics(prev_dir);
    if (files_static[prev_file] === undefined)
      files_static[prev_file] = new WordStatistics(prev_file);
    all_statics.addWord(item);
    dirs_statics[prev_dir].addWord(item);
    files_static[prev_file].addWord(item);
  });
  console.log(files_static[prev_file]);
});
