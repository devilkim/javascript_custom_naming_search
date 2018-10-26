const fs = require('fs');
const path = require('path');
const wildcard = require('wildcard-regex');

class FileUtils {
  traceDirectory(targetDirectory, ignoreList) {
      const walkNextStepSync = (dir, fileList = []) => {
        fs.readdirSync(dir).forEach(file => {
            let isSkip = false;
            const fullPath = path.join(dir, file);
            ignoreList.map(item => {
              const regex = wildcard.wildcardRegExp(targetDirectory + item);
              if (regex.test(fullPath)) isSkip = true;
            });
            if (isSkip) return;
            try {
                fileList = walkNextStepSync(fullPath, fileList);
            } catch (err) {
                if (err.code === 'ENOTDIR' || err.code === 'EBUSY') {
                  const path = fullPath.substring(targetDirectory.length, fullPath.length);
                  const file_token = file.split(".");
                  fileList = [
                    ...fileList,
                    {
                      fullPath: fullPath,
                      path: path,
                      fullDir: dir,
                      dir: dir.substring(targetDirectory.length, dir.length),
                      file: file,
                      ext: file_token[file_token.length - 1],
                      parsedPath: path.replace(/\//gi, ".")
                    }
                  ];
                } else {
                  throw err;
                }
            }
        });
        return fileList;
      };
      return walkNextStepSync(targetDirectory);
  }
}

const instance = new FileUtils();
module.exports = instance;
