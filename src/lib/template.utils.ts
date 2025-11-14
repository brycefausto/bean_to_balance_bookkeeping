import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';

export const compileTemplate = async (template: string, payload: any) => {
  const source = fs.readFileSync(
    path.join('src', 'lib', 'htmlTemplates', template),
    'utf8',
  );
  
  return ejs.compile(source, { async: false })(payload);
};
