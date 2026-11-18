import { useState } from 'react';
import ImageViewer from '@/components/ImageViewer';
import { publicFileUrl } from '@/utils/fileUrl';
import ImagePlaceholder from './ImagePlaceholder';

/**
 * 상세 본문 첨부 이미지 목록 + 크게 보기
 * - imgs: [{ atchFileSn }]
 * - 못 불러온 이미지는 그 자리에 회색 자리를 두고 누를 수 없게 한다. 크게 보기에서는 뺀다
 * - 번호(「첨부 이미지 N」)는 보이는 사진끼리 다시 매긴다
 */
export default function AttachedImages({ imgs, className = '' }) {
  const [failed, setFailed] = useState(() => new Set());
  const [viewerIndex, setViewerIndex] = useState(null);

  if (imgs.length === 0) return null;

  const good = imgs.filter(({ atchFileSn }) => !failed.has(atchFileSn));
  const markFailed = (sn) => setFailed((prev) => new Set(prev).add(sn));

  return (
    <>
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        {imgs.map(({ atchFileSn }) => {
          if (failed.has(atchFileSn)) {
            return (
              <ImagePlaceholder
                key={atchFileSn}
                className="aspect-[4/3] w-[min(100%,480px)] rounded-[10px]"
              />
            );
          }
          const number = good.findIndex((img) => img.atchFileSn === atchFileSn);
          return (
            <button
              key={atchFileSn}
              type="button"
              aria-label={`첨부 이미지 ${number + 1} 크게 보기`}
              onClick={() => setViewerIndex(number)}
              className="max-w-full cursor-zoom-in"
            >
              <img
                src={publicFileUrl(atchFileSn)}
                alt={`첨부 이미지 ${number + 1}`}
                onError={() => markFailed(atchFileSn)}
                className="h-auto max-h-[min(640px,75vh)] w-auto max-w-full rounded-[10px] object-contain"
              />
            </button>
          );
        })}
      </div>
      {viewerIndex !== null && good[viewerIndex] && (
        <ImageViewer
          images={good.map(({ atchFileSn }, index) => ({
            key: atchFileSn,
            src: publicFileUrl(atchFileSn),
            name: `첨부 이미지 ${index + 1}`,
          }))}
          index={viewerIndex}
          onChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}
