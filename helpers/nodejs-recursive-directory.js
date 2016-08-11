/**
 * Goes through the given directory to return all files and folders recursively
 * @author Ash Blue ash@blueashes.com
 * @example getFilesRecursive('./folder/sub-folder');
 * @requires Must include the file system module native to NodeJS, ex. var fs = require('fs');
 * @param {string} folder Folder location to search through
 * @returns {object} Nested tree of the found files
 */
var fs = require('fs');

var directoryHelper = {

    getFilesRecursive: function  (folder) {
        var fileContents = fs.readdirSync(folder),
            fileTree = [],
            stats,
            _this = this;

        fileContents.forEach(function (fileName) {
            stats = fs.lstatSync(folder + '/' + fileName);

            if (stats.isDirectory()) {
                fileTree.push({
                    name: fileName,
                    children: _this.getFilesRecursive(folder + '/' + fileName)
                });
            } else {
                fileTree.push({
                    name: fileName
                });
            }
        });

        return fileTree;
    },

    getRequirePathsRecursive: function (fileTree, parentFolders) {
        var filePaths = [],
            parentPath = '',
            parentFolders = parentFolders || [],
            _this = this;

        fileTree.forEach(function (file) {

            if (!file.children) {

                if (parentFolders.length > 0) {

                    parentFolders.forEach(function (parentFolder) {
                        parentPath += parentFolder + '/';
                    });

                    filePaths.push((parentPath + file.name).slice(0, -3));

                } else {
                    filePaths.push(file.name.slice(0, -3));
                }

            }
            else {

                parentFolders.push(file.name);
                var children = _this.getRequirePathsRecursive(file.children, parentFolders);
                filePaths = filePaths.concat(children);
                parentFolders = [];

            }

        });

        return filePaths;
    }
}








module.exports = directoryHelper;


