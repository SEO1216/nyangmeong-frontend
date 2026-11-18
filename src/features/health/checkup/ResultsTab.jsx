import { useState } from 'react';
import { FILTER_CHIP, FILTER_CHIP_ON } from '@/components/buttonStyles';
import { ATTACHMENT_IMAGE, INSPECTION_KINDS } from './checkupTypes';
import BloodResultList from './BloodResultList';
import EtcResultList from './EtcResultList';
import ImagingResultList from './ImagingResultList';

/**
 * [검사 결과 탭]
 * - 혈액검사 · 영상검사 · 기타검사 칩과 종류별 건수, 처음 열면 혈액검사 선택 (FN-HLT-005-02)
 * - 영상검사 건수는 첨부 자료의 "영상 사진" 건수와 같음
 */
export default function ResultsTab({ detail, onGoAttachments }) {
  const [kind, setKind] = useState('blood');
  const { checkup, bloodInspections, etcInspections } = detail;
  const imagingAttachments = detail.attachments.filter(
    (attachment) => attachment.atchTypeCd === ATTACHMENT_IMAGE,
  );
  const counts = {
    blood: bloodInspections.length,
    img: imagingAttachments.length,
    etc: etcInspections.length,
  };

  return (
    <div className="p-4 min-[760px]:p-5">
      <div
        role="group"
        aria-label="검사 종류"
        className="mb-5 flex flex-wrap gap-2"
      >
        {INSPECTION_KINDS.map((item) => {
          const isSelected = item.key === kind;
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={isSelected}
              className={isSelected ? FILTER_CHIP_ON : FILTER_CHIP}
              onClick={() => setKind(item.key)}
            >
              {item.nm} {counts[item.key]}
            </button>
          );
        })}
      </div>

      {kind === 'blood' && (
        <BloodResultList checkup={checkup} items={bloodInspections} />
      )}
      {kind === 'img' && (
        <ImagingResultList
          petSn={checkup.petSn}
          attachments={imagingAttachments}
          onGoAttachments={onGoAttachments}
        />
      )}
      {kind === 'etc' && (
        <EtcResultList
          petSn={checkup.petSn}
          ckupRcdSn={checkup.ckupRcdSn}
          etcInspections={etcInspections}
        />
      )}
    </div>
  );
}
