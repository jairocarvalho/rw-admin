import Compressor from "compressorjs";

/**
 *  https://www.npmjs.com/package/compressorjs
 *  https://fengyuanchen.github.io/compressorjs/
 */
export const compressImage = (file: File | Blob, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth: 1080,
      success(result) {
        const blobToFile = new File([result], result?.name, {
          type: result.type,
        });

        resolve(blobToFile);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
