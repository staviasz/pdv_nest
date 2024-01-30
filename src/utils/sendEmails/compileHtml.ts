import * as fs from 'fs/promises';
import handlebars from 'handlebars';
import { ContextHtmlEmail } from './types/email';

const compileTemplate = async (pathHtml: string, context: ContextHtmlEmail) => {
  const htmlString = (await fs.readFile(pathHtml, 'utf8')).toString();
  const compile = handlebars.compile(htmlString);
  return compile(context);
};

export default compileTemplate;
