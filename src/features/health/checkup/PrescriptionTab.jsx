import { useState } from 'react';
import Badge from '@/components/Badge';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { formatDate } from '@/utils/formatDate';
import EmptyResult from '@/components/EmptyResult';
import PrescriptionModal from './PrescriptionModal';
import { ADD_ROW, ROW_LINE, TEXT_BTN } from './checkupStyles';
import { DOSING } from './checkupTypes';

/**
 * [처방·투약 탭]
 * - 목록 행: 약품명(밑줄)·복용 기간·1일 복용 횟수·주기 체크·상태 뱃지·[수정] (FN-HLT-005-03)
 * - 약품명이나 [수정] → 이 검진의 약이 모두 채워진 처방·투약 수정 모달(누른 약만 펼침)
 * - [＋ 처방·투약 추가] → 빈 약 하나가 펼쳐진 처방·투약 추가 모달
 * - 처방약이 0건이면 빈 상태 안내 + [＋ 처방·투약 추가]
 */
export default function PrescriptionTab({ petSn, ckupRcdSn, prescriptions }) {
  /** 모달: null이면 닫힘, editSn이 null이면 추가 */
  const [modal, setModal] = useState(null);

  return (
    <Card title="처방·투약" sub="선택">
      {prescriptions.length === 0 ? (
        <EmptyResult
          isCompact
          icon={
            <Icon name="medication" className="text-[28px] text-line-strong" />
          }
          title="이 검진에서 받은 처방약이 없어요"
        />
      ) : (
        <ul>
          {prescriptions.map((prescription) => (
            <li
              key={prescription.prscSn}
              className={`flex items-center gap-3.5 py-3.5 ${ROW_LINE}`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-surface-2 text-ink-2">
                <Icon name="medication" />
              </span>
              <span className="min-w-0 flex-1">
                <button
                  type="button"
                  className="text-left text-lg font-semibold text-ink underline underline-offset-4 hover:text-brand-600"
                  onClick={() => setModal({ editSn: prescription.prscSn })}
                >
                  {prescription.mdcnNm}
                </button>
                <span className="block text-subtle tabular-nums">
                  {formatDate(prescription.mdcnBgngYmd)} ~{' '}
                  {formatDate(prescription.mdcnEndYmd)} · 1일{' '}
                  {prescription.dayMdcnNmtm}회 ·{' '}
                  {prescription.careRfltYn ? '주기 체크' : '주기 체크 안 함'}
                </span>
              </span>
              <Badge tone={prescription.prscSttsCd === DOSING ? 'ok' : 'gray'}>
                {prescription.prscSttsCd === DOSING ? '복용 중' : '종료'}
              </Badge>
              <button
                type="button"
                aria-label={`${prescription.mdcnNm} 수정`}
                className={`${TEXT_BTN} shrink-0`}
                onClick={() => setModal({ editSn: prescription.prscSn })}
              >
                수정
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className={`${BTN_SECONDARY} ${ADD_ROW} w-full`}
        onClick={() => setModal({ editSn: null })}
      >
        <Icon name="add" className="text-lg" />
        처방·투약 추가
      </button>
      {modal && (
        <PrescriptionModal
          petSn={petSn}
          ckupRcdSn={ckupRcdSn}
          prescriptions={prescriptions}
          editSn={modal.editSn}
          onClose={() => setModal(null)}
        />
      )}
    </Card>
  );
}
