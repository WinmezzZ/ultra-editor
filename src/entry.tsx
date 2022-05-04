import ReactDOM from 'react-dom';
import Editor from './editor';
import './entry.css';

const App = () => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}> Ultra Editor</h2>
      <Editor />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
