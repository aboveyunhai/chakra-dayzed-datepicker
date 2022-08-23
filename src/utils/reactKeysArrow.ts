// Based on: https://github.com/leon-good-life/arrow-keys-react
// re-implemented by @hexelon in https://github.com/hexelon/chakra-dayzed-datepicker/commit/4f44e565e3975f613b54304d1fdaeb97dd7dfa15

import type { KeyboardEvent } from 'react';

export interface ArrowKeysReactConfig {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
}

export class ArrowKeysReact {
  config: ArrowKeysReactConfig;

  constructor(config: ArrowKeysReactConfig) {
    this.config = config;
  }

  getEvents() {
    return {
      onKeyDown: (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            this.config.down && this.config.down();
            break;
          case 'ArrowLeft':
            this.config.left && this.config.left();
            break;
          case 'ArrowRight':
            this.config.right && this.config.right();
            break;
          case 'ArrowUp':
            this.config.up && this.config.up();
            break;
        }
      },
    };
  }
}
