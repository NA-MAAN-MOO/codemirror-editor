import CodeMirror from '@uiw/react-codemirror';
import { pythonLanguage } from '@codemirror/lang-python';

const pyLang = `# Press Ctrl-Space in here...`;

export default function App() {
  return <CodeMirror value={pyLang} height="200px" extensions={[pythonLanguage]} />;
}
