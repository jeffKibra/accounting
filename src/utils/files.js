export const fileHandling = {
  //------------------------------------------------------------------------
  async downloadFile(fileBuffer, fileName) {
    // console.log({ fileBuffer });
    const blob = new Blob(
      [fileBuffer]
      // { type: "application/json" }
    );
    const url = await this._blobToDataURL(blob);

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
  },

  //------------------------------------------------------------------------\

  _blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        const url = e.target.result;
        // console.log({ url });
        resolve(url);
      };

      reader.onerror = e => {
        const error = e.target.error;
        console.error(error);
        reject(error);
      };

      reader.readAsDataURL(blob);
    });
  },
  //------------------------------------------------------------------------\
  /**
   *
   * @param {ArrayBuffer} arrayBuffer
   * @returns
   */
  async _readDataFromArrayBuffer(arrayBuffer) {
    if (!arrayBuffer) {
      throw new Error('ArrayBuffer not provided!');
    }

    const blob = new Blob([arrayBuffer]);
    const blobText = await blob.text();
    // console.log({ blobText });

    const dataFromFile = JSON.parse(blobText);
    return dataFromFile;
  },
  //------------------------------------------------------------------------
  /**
   *
   * @param {Record<string, unknown>} data
   * @param {string} zipFileName
   */
  async _createZipFile(data, zipFileName) {
    // console.log("creating zip file");
    // console.log({ data, zipFileName });

    const gzip = await this._convertDataToGzip(data, zipFileName);
    // console.log({ gzip });

    // console.log({ gzip });
    const gzipFile = new File(
      [gzip],
      zipFileName
      // { type: "application/json" }
    );
    // console.log({ gzipFile });

    return gzipFile;
  },
  //------------------------------------------------------------------------

  /**
   *
   * @param {File} file
   */
  async _readDataFromZipFile(file) {
    // console.log({ file });
    const fileBuffer = await this._createBufferFromFile(file);
    // console.log({ fileBuffer });
    const dataFromGzip = await this._readDataFromGzipBuffer(fileBuffer);
    // console.log({ dataFromGzip });

    return dataFromGzip;
  },
  //------------------------------------------------------------------------

  //------------------------------------------------------------------------

  async testRun(data) {
    const fileName = 'change1.json';
    // const data = await idb.getData();
    console.log({ data });
    const gzipFile = await this._createZipFile(data, fileName);
    console.log({ gzipFile });
    await this.downloadFile(gzipFile, `${fileName}.gz`);

    const dataFromZip = await this._readDataFromZipFile(gzipFile);
    console.log({ dataFromZip });
  },
  //------------------------------------------------------------------------
  /**
   *
   * @param {Record<string, unknown} data
   * @param {string} zipFileName
   * @returns
   */
  async _convertDataToGzip(data, zipFileName) {
    // await this.downloadFile(fileBuffer, "original.json");
    const fileBuffer = await this._createBufferFromData(data);
    // console.log({ fileBuffer });

    const gzipped = await this._compressData(fileBuffer, zipFileName);
    // console.log({ gzipped });
    // await this.downloadFile(gzipped, "gzipped.gz");

    return gzipped;

    // return dataFile;
  },

  //------------------------------------------------------------------------
  /**
   *
   * @param {Record<string, unknown>} data
   * @returns
   */
  async _createBufferFromData(data) {
    console.time('create buffer from data');
    const jsonString = JSON.stringify(data);

    const blob = new Blob([jsonString], { type: 'application/json' });
    // console.log({ blob });
    const bufferFromBlob = await blob.arrayBuffer();
    // console.log({ bufferFromBlob });

    const fileBuffer = new Uint8Array(bufferFromBlob);
    // console.log({ fileBuffer });
    console.timeEnd('create buffer from data');

    return fileBuffer;
  },
  //------------------------------------------------------------------------
  /**
   *
   * @param {File} file
   * @returns
   */
  async _createBufferFromFile(file) {
    console.time('create buffer from file');
    // console.log({ file });

    const arrayBuffer = await file.arrayBuffer();
    // console.log({ arrayBuffer });

    const fileBuffer = new Uint8Array(arrayBuffer);
    // console.log({ fileBuffer });
    // console.log({ fileBuffer });
    console.timeEnd('create buffer from file');

    return fileBuffer;
  },
  //------------------------------------------------------------------------

  //------------------------------------------------------------------------
  /**
   * readDataFromFileBuffer
   * @param {Uint8Array} gzipBuffer
   * @returns
   */
  async _readDataFromGzipBuffer(gzipBuffer) {
    //decompress zip
    const buffer = await this._unzipArchive(gzipBuffer);
    // console.log({ buffer });
    //convert buffer to data
    const data = await this._readDataFromArrayBuffer(buffer);
    // console.log({ data });

    return data;
  },
  //------------------------------------------------------------------------
  /**
   *
   * @param {Uint8Array} fileBuffer
   * @param {string} fileName
   * @returns
   */
  async _readDataFromFileBuffer(fileBuffer, fileName) {
    //initialize buffer to be current file buffer
    // await this.downloadFile(fileBuffer, fileName);
    let buffer = fileBuffer;
    const fileIsZip = this._checkIfFileIsZip(fileName);

    if (fileIsZip) {
      //decompress zip and assign returned buffer to buffer
      buffer = await this._unzipArchive(fileBuffer);
    }

    // console.log({ buffer });
    //convert buffer to data
    const data = await this._readDataFromArrayBuffer(buffer);
    // console.log({ data });

    return data;
  },
  //------------------------------------------------------------------------
  /**
   *
   * @param {Uint8Array} buffer
   * @param {string} zipFileName
   * @returns
   */
  // _compressData(buffer, zipFileName) {
  //     return new Promise((resolve, reject) => {
  //         try {
  //             if (!buffer) {
  //                 throw new Error("Invalid buffer value");
  //             }
  //             if (!zipFileName) {
  //                 throw new Error("Please provide a zip file name!");
  //             }

  //             const rootFileName = this._retrieveRootFileName(zipFileName);
  //             // console.log({ rootFileName });

  //             fflate.gzip(
  //                 buffer,
  //                 {
  //                     // GZIP-specific: the filename to use when decompressed
  //                     filename: rootFileName,
  //                     // GZIP-specific: the modification time. Can be a Date, date string,
  //                     // or Unix timestamp
  //                     mtime: new Date(),
  //                     level: 9, //max compression level
  //                 },
  //                 (error, compressedBuffer) => {
  //                     // console.log({ error, compressedBuffer });
  //                     if (error) throw error;

  //                     resolve(compressedBuffer);
  //                 }
  //             );
  //         } catch (error) {
  //             reject(error);
  //         }
  //     });
  // },
  //------------------------------------------------------------------------
  // /**
  //  *
  //  * @param {Uint8Array} compressedBuffer
  //  * @returns
  //  */
  // _unzipArchive(compressedBuffer) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       fflate.gunzip(compressedBuffer, {}, (error, buffer) => {
  //         // console.log({ error, buffer });

  //         if (error) {
  //           throw error;
  //         }

  //         resolve(buffer);
  //       });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // },

  //------------------------------------------------------------------------

  //------------------------------------------------------------------------

  //------------------------------------------------------------------------

  //------------------------------------------------------------------------

  //------------------------------------------------------------------------

  _former_createFileFromData(data, fileName) {
    this._progressCB('Generating File');
    return new Promise((resolve, reject) => {
      const backupsWorker = new Worker('js/chatBackups/worker.js');
      backupsWorker.postMessage({
        type: 'create_file_from_data',
        fileData: data,
        fileName,
      });

      backupsWorker.onerror = errorEvt => {
        console.log('worker error: ' + errorEvt);
        reject(errorEvt.message);
      };

      backupsWorker.onmessage = async e => {
        // console.log({ e });
        const data = e.data;
        // console.log({ data });
        const type = data?.type;

        try {
          if (type === 'create_file_from_data_success') {
            const file = data?.file;
            // console.log({ file });

            if (!file) {
              throw new Error('worker did not return a file');
            }
            resolve(file);
          } else {
            console.log('unexpected message from worker', data);
            resolve(null);
          }
        } catch (error) {
          console.error(error);
        }
      };
    });
  },
  //------------------------------------------------------------------------

  _former_readDataFromFileBuffer(fileBuffer) {
    this._progressCB('Reading data from file');
    return new Promise((resolve, reject) => {
      const backupsWorker = new Worker('js/chatBackups/worker.js');
      backupsWorker.postMessage({ type: 'read_data_from_file', fileBuffer });

      backupsWorker.onerror = errorEvt => {
        console.log('worker error: ' + errorEvt);
        reject(errorEvt.message);
      };

      backupsWorker.onmessage = async e => {
        // console.log({ e });
        const data = e.data;
        // console.log({ data });
        const type = data?.type;

        try {
          if (type === 'read_data_from_file_success') {
            const dataFromFile = data?.dataFromFile;
            // console.log("read data from file success", { dataFromFile });
            resolve(dataFromFile);
          } else {
            console.log('unexpected message from worker', data);
            resolve(null);
          }
        } catch (error) {
          console.error(error);
        }
      };
    });
  },

  //------------------------------------------------------------------------
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
