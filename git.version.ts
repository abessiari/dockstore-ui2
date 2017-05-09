import fs = require('fs');
import { Observable } from 'rxjs';

let exec = require('child_process').exec;

const revision = new Observable<string>(s => {
  exec('git rev-parse --short HEAD',
    function (error: Error, stdout: Buffer, stderr: Buffer) {
      if (error !== null) {
        console.log('git error: ' + error + stderr);
      }
      s.next(stdout.toString().trim());
      s.complete();
    });
});

const tag = new Observable<string>(s => {
  exec('git describe --tag',
    function (error: Error, stdout: Buffer, stderr: Buffer) {
      if (error !== null) {
        console.log('git error: ' + error + stderr);
      }
      s.next(stdout.toString().trim());
      s.complete();
    });
});

Observable
  .combineLatest(revision, tag)
  .subscribe(([revision, tag]) => {
    console.log(`tag: '${tag}', version: '${process.env.npm_package_version}', revision: '${revision}'`);

    const content = '// this file is automatically generated by git.version.ts script\n' +
      `export const versions = {tag: '${tag}', version: '${process.env.npm_package_version}', revision: '${revision}'};`;

    fs.writeFileSync(
      'src/app/footer/versions.ts',
      content,
      {encoding: 'utf8'}
    );
  });
