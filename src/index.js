import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Popup } from '../lib/react/Popup';

function main() {
  const rootNode = document.getElementById('app');
  rootNode.style.position = 'relative';

  render(<App/>, rootNode);

  function App() {
    const [anchorNode, setAnchorNode] = useState(null);
    const [img, setImg] = useState(null);
    useEffect(() => {
      const id = setTimeout(() => {
        setImg('https://picsum.photos/100/100?grayscale');
      }, 1000);
      return () => clearTimeout(id);
    }, [setImg]);

    return (
      <div>
        <button
          style={{position: 'fixed', bottom: 0}}
          ref={(node) => setAnchorNode(node)}
        >
          Popup
        </button>
        {anchorNode ? (
          <Popup anchorNode={anchorNode} resizable={true} parentNode={rootNode}>
            <div>
              Hello World!
              <div>{img ? <img alt="pic" src={img}/> : null}</div>
            </div>
          </Popup>
        ) : null}
      </div>
    );
  }
}

main();