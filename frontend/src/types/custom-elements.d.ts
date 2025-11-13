declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      poster?: string;
      'ios-src'?: string;
      'camera-controls'?: boolean;
      autoplay?: boolean;
      ar?: boolean;
      exposure?: string | number;
      [key: string]: unknown;
    };
  }
}


