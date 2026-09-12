import { Directory, File, Paths } from 'expo-file-system';

const AUDIO_ROOT_NAME = 'offline-audio';

const getReciterDirectory = (reciterId: string): Directory => {
  const directory = new Directory(Paths.document, AUDIO_ROOT_NAME, reciterId);
  if (!directory.exists) {
    directory.create({ intermediates: true });
  }
  return directory;
};

const getLocalFile = (reciterId: string, surahId: number): File => {
  const paddedId = surahId.toString().padStart(3, '0');
  return new File(getReciterDirectory(reciterId), `surah-${paddedId}.mp3`);
};

export const isSurahDownloaded = (
  reciterId: string,
  surahId: number,
): boolean => getLocalFile(reciterId, surahId).exists;

/** Returns the local file URI if downloaded, otherwise null. */
export const getLocalSurahUri = (
  reciterId: string,
  surahId: number,
): string | null => {
  const file = getLocalFile(reciterId, surahId);
  return file.exists ? file.uri : null;
};

export const downloadSurah = async (
  reciterId: string,
  surahId: number,
  remoteUrl: string,
  onProgress?: (fraction: number) => void,
): Promise<string> => {
  const destination = getLocalFile(reciterId, surahId);

  const downloaded = await File.downloadFileAsync(remoteUrl, destination, {
    idempotent: true,
    onProgress: ({ bytesWritten, totalBytes }) => {
      if (totalBytes > 0) {
        onProgress?.(bytesWritten / totalBytes);
      }
    },
  });

  return downloaded.uri;
};

export const deleteDownloadedSurah = (
  reciterId: string,
  surahId: number,
): void => {
  const file = getLocalFile(reciterId, surahId);
  if (file.exists) {
    file.delete();
  }
};
