import { css, Global } from '@emotion/react';
import { DarkMode, Sun } from '@icon-park/react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider, Layout } from 'ultra-design';
import { useColorScheme } from 'winhooks';
import Editor from './editor';
import './entry.less';

const App = () => {
  const defaultColor = useColorScheme();
  const [color, setColor] = useState<'dark' | 'light'>(defaultColor);

  const onChangeColor = () => {
    setColor(c => (c === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ConfigProvider theme={{ mode: color }}>
      <Global
        styles={css`
          body {
            background-color: ${color == 'dark' ? '#000' : '#eee'};
          }
        `}
      ></Global>
      <Layout>
        <Layout.Header color="primary">
          <span> Ultra Editor</span>
          <span className="theme-switch" onClick={onChangeColor}>
            {color === 'dark' ? <Sun theme="outline" size="24" /> : <DarkMode theme="outline" size="24" />}
          </span>
        </Layout.Header>
        <Layout.Content>
          <Editor theme={color} />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
