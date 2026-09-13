const ARCHIVE_DETAILS_RE =
  /^https?:\/\/(?:www\.)?archive\.org\/details\/([^/?#]+)/i;

const AUDIO_EXTENSION_RE = /\.(mp3|m4a|wav|ogg|flac|aac)$/i;

interface ArchiveOrgFile {
  name: string;
  source?: string;
}

interface ArchiveOrgMetadata {
  files?: ArchiveOrgFile[];
}

/**
 * archive.org item pages (`/details/{id}`) are HTML, not audio — the actual
 * file lives at `/download/{id}/{filename}`. Given the item id, look up its
 * metadata and return the direct file URL for its audio file, if any.
 */
async function findArchiveOrgDirectUrl(
  identifier: string,
): Promise<string | null> {
  let metadata: ArchiveOrgMetadata;
  try {
    const res = await fetch(
      `https://archive.org/metadata/${encodeURIComponent(identifier)}`,
    );
    if (!res.ok) return null;
    metadata = await res.json();
  } catch {
    return null;
  }

  const files = metadata.files ?? [];
  const audioFile =
    files.find((f) => f.source === 'original' && AUDIO_EXTENSION_RE.test(f.name)) ??
    files.find((f) => AUDIO_EXTENSION_RE.test(f.name));

  if (!audioFile) return null;

  return `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(audioFile.name)}`;
}

/**
 * Resolves a user-pasted audio URL into one that will actually play:
 * - Auto-converts an archive.org item page link into its direct file link.
 * - Confirms the final URL actually serves audio, not a webpage, catching
 *   the same "pasted the page link instead of the file link" mistake for
 *   any host, not just archive.org.
 */
export async function resolveAudioUrl(
  rawUrl: string,
): Promise<{ url: string } | { error: string }> {
  let url = rawUrl;

  const detailsMatch = rawUrl.match(ARCHIVE_DETAILS_RE);
  if (detailsMatch) {
    const directUrl = await findArchiveOrgDirectUrl(detailsMatch[1]);
    if (!directUrl) {
      return {
        error:
          'That looks like an archive.org item page, not a direct file link, and no audio file could be found inside it. Open the item, click the file under "Download options", and paste that link instead.',
      };
    }
    url = directUrl;
  }

  try {
    let res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) {
      // Some hosts reject HEAD; a ranged GET is a lightweight fallback.
      res = await fetch(url, { headers: { Range: 'bytes=0-0' } });
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (!res.ok) {
      return { error: `Couldn't fetch that URL (status ${res.status}).` };
    }
    if (contentType.toLowerCase().startsWith('text/')) {
      return {
        error: `That URL points to a webpage (${contentType}), not an audio file. Make sure it's a direct link to the mp3.`,
      };
    }
  } catch {
    return {
      error: 'Could not reach that URL to verify it. Double-check the link.',
    };
  }

  return { url };
}
