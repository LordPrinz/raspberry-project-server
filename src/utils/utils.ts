type CallbackFunction<T> = (error: Error | null, result?: T) => void;

export const promisify = <T>(originalFunction: (...args: any[]) => void): ((...args: any[]) => Promise<T>) => {
  return (...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      const callback: CallbackFunction<T> = (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as T);
        }
      };

      originalFunction.apply(null, [...args, callback]);
    });
  };
};
