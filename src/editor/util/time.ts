let sleep = ( ms: number ): Promise<void> => {
  return new Promise<void>(( res: Function ) => {
    setTimeout(() => {
      res()
    }, ms);
  });
}

export { sleep };