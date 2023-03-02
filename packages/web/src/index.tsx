import { createRoot } from 'react-dom/client';
import { Root } from 'application';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<Root />);
