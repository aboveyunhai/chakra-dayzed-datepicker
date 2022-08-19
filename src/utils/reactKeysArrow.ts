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
