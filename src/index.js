import React from 'react';
import { render } from "react-dom";

function main() {
  const rootNode = document.getElementById('app');
  render(<div>Hello World!</div>, rootNode);
}

main();
