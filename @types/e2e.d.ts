interface Window {
  screenshot(): PromiseLike<any>
}

declare namespace jasmine {
  interface AsyncMatchers<T, U> {
    toMatchImageSnapshot(options?: Object): PromiseLike<void>
  }
}