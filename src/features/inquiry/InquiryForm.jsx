import { flushSync } from 'react-dom';
import { PROFANITY_MESSAGE, hasProfanity } from '@/utils/profanity';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import AutoTextarea from '@/components/AutoTextarea';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import ConfirmModal from '@/components/ConfirmModal';
import DropdownSelect from '@/components/DropdownSelect';
import FieldError, { Required } from '@/components/FieldError';
import { INPUT, LABEL } from '@/components/formStyles';
import ImageAttach, { MAX_IMAGES } from '@/components/ImageAttach';
import { PATHS } from '@/routes/paths';
import { INQUIRY_TYPE_PIXEL_CHARACTER } from './api';
import { useInquiryImageUrls } from './queries';

const TITLE_MAX = 50;
const BODY_MAX = 2000;

/** 서버가 준 첨부 [{ atchFileSn, sortSeq, orgnlFileNm }]를 ImageAttach 항목으로: 이미지 주소는 렌더 시 채움 */
const toAttachItems = (imgs = []) =>
  imgs.map(({ atchFileSn, orgnlFileNm }, index) => ({
    id: `file-${atchFileSn}`,
    atchFileSn,
    name: orgnlFileNm || `첨부 이미지 ${index + 1}`,
    url: null,
  }));

/**
 * 문의 작성·수정 공용 폼
 * - 입력한 것이 있으면(처음 값과 다르면) 목록·취소로 나갈 때 확인 모달, 새로고침·닫기는 브라우저 확인창
 * - 고객센터 사이드 메뉴 이동은 틀의 onLeave가 이 확인으로 연결. 앱이 BrowserRouter라 헤더(GNB) 링크 이동은 차단 불가
 * - initial: { inqryTypeCd, inqryTtl, inqryCn, imgs }. 수정은 서버 상세 응답을 그대로 전달
 * - types: 문의 유형 공통코드 [{ comCd, comCdNm }]
 * - errorMessage·fieldErrors: 서버 오류의 message와 입력값 검증 오류 fields([{ field, message }])
 * - characterLinked: 캐릭터 화면에서 넘겨받은 캐릭터가 있음. 유형이 픽셀 캐릭터면 서버가 캐릭터 이미지를 첫 첨부로 붙이므로 사용자 첨부는 1장 적게
 * - characterImage: 자동 첨부될 캐릭터 이미지 주소(못 받으면 null). characterLinked이고 유형이 픽셀 캐릭터일 때 「이미지 추가」 칸 오른쪽에 삭제 불가 칸으로 보임(못 받으면 자리 표시)
 * - onSubmit({ inqryTypeCd, inqryTtl, inqryCn, images(새 File들), keepAtchFileSns(남길 기존 첨부) })
 */
export default function InquiryForm({
  initial,
  types,
  mode,
  cancelTo,
  hideCancel = false,
  isPending,
  errorMessage,
  fieldErrors,
  characterLinked = false,
  characterImage = null,
  onSubmit,
}) {
  const navigate = useNavigate();
  const { leaveRef } = useOutletContext() ?? {};
  const [type, setType] = useState(initial.inqryTypeCd);
  const [title, setTitle] = useState(initial.inqryTtl);
  const [body, setBody] = useState(initial.inqryCn);
  const [initialImages] = useState(() => toAttachItems(initial.imgs));
  const [images, setImages] = useState(initialImages);
  const existingUrls = useInquiryImageUrls(
    initial.otoInqrySn,
    initial.imgs ?? [],
  );
  const [errors, setErrors] = useState({});
  const [leaveTo, setLeaveTo] = useState(null);

  const isEdit = mode === 'edit';
  const hasCharacterImage =
    characterLinked && type === INQUIRY_TYPE_PIXEL_CHARACTER;
  const maxImages = hasCharacterImage ? MAX_IMAGES - 1 : MAX_IMAGES;
  const isDirty =
    type !== initial.inqryTypeCd ||
    title !== initial.inqryTtl ||
    body !== initial.inqryCn ||
    images.length !== initialImages.length ||
    images.some((image, i) => image.id !== initialImages[i]?.id);

  useEffect(() => {
    if (!isDirty) return undefined;
    const warn = (event) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  /** 목록으로·취소: 고친 것이 있으면 먼저 확인 */
  const handleLeave = (target) => {
    if (isDirty) setLeaveTo(target);
    else navigate(target);
  };

  /** 고객센터 틀의 사이드 메뉴·머리 이동도 같은 확인을 거치도록 설정 */
  useEffect(() => {
    if (!leaveRef) return undefined;
    leaveRef.current = handleLeave;
    return () => {
      leaveRef.current = null;
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = {};
    if (!type) nextErrors.type = '문의 유형을 골라 주세요';
    if (!title.trim()) nextErrors.title = '제목을 입력해 주세요';
    else if (hasProfanity(title)) nextErrors.title = PROFANITY_MESSAGE;
    if (!body.trim()) nextErrors.body = '내용을 입력해 주세요';
    else if (hasProfanity(body)) nextErrors.body = PROFANITY_MESSAGE;
    if (images.length > maxImages)
      nextErrors.images = `캐릭터 오류 문의는 이미지를 최대 ${maxImages}장까지 올릴 수 있어요`;
    /** 오류 표시(aria-invalid)가 화면에 반영된 뒤에 첫 빠진 항목을 찾도록 바로 반영한다 */
    flushSync(() => setErrors(nextErrors));
    if (Object.keys(nextErrors).length > 0) {
      /** 빠진 항목 중 첫 번째로 이동 */
      form
        .querySelector('[aria-invalid="true"], [data-invalid="true"]')
        ?.focus();
      return;
    }
    if (isPending) return;
    onSubmit({
      inqryTypeCd: type,
      inqryTtl: title.trim(),
      inqryCn: body.trim(),
      images: images.filter((image) => image.file).map((image) => image.file),
      keepAtchFileSns: images
        .filter((image) => !image.file)
        .map((image) => image.atchFileSn),
    });
  };

  const typeOptions = types.map(({ comCd, comCdNm }) => ({
    value: comCd,
    label: comCdNm,
  }));
  const serverFieldError = (field) =>
    fieldErrors?.find((item) => item.field === field)?.message;

  const clearError = (name) => setErrors((prev) => ({ ...prev, [name]: '' }));

  return (
    <section
      aria-labelledby="inquiry-form-title"
      className="rounded-[14px] border border-line bg-white px-9 pt-8 pb-7 max-[760px]:px-5 max-[760px]:pt-6 max-[760px]:pb-5"
    >
      <h2 id="inquiry-form-title" className="sr-only">
        {isEdit ? '문의 수정' : '새 문의 작성'}
      </h2>
      {!isEdit && (
        <p className="mb-6 text-sm font-medium text-ok">
          답변이 등록되면 알림으로 알려 드려요. 자주 묻는 내용은{' '}
          <Link
            to={PATHS.FAQS}
            className="font-bold underline underline-offset-[3px]"
          >
            자주 묻는 질문
          </Link>
          에서 바로 확인할 수 있어요.
        </p>
      )}
      <form
        id="inquiry-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-8 max-[760px]:gap-6"
      >
        <div className="flex flex-col gap-2">
          <span className={`${LABEL} text-base text-ink`}>
            문의 유형
            <Required />
          </span>
          <DropdownSelect
            label="문의 유형"
            invalid={Boolean(errors.type || serverFieldError('inqryTypeCd'))}
            placeholder="선택해 주세요"
            value={type}
            options={typeOptions}
            listMaxHeight={320}
            onChange={(value) => {
              setType(value);
              clearError('type');
            }}
            className="max-w-[320px] max-[760px]:max-w-none"
          />
          <FieldError>
            {errors.type || serverFieldError('inqryTypeCd')}
          </FieldError>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="inquiry-title"
            className={`${LABEL} text-base text-ink`}
          >
            제목
            <Required />
          </label>
          <div className="relative">
            <AutoTextarea
              id="inquiry-title"
              rows={1}
              value={title}
              maxLength={TITLE_MAX}
              placeholder="문의 제목을 입력해 주세요"
              aria-required="true"
              aria-invalid={Boolean(
                errors.title || serverFieldError('inqryTtl'),
              )}
              onChange={(event) => {
                /** 제목은 줄을 나눌 수 없다: 붙여 넣은 줄바꿈은 공백으로 */
                /** 한글 조합 중에는 maxLength를 넘겨 들어오므로 직접 자른다 */
                setTitle(
                  event.target.value
                    .replaceAll(/[\r\n]+/g, ' ')
                    .slice(0, TITLE_MAX),
                );
                clearError('title');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.preventDefault();
              }}
              className={`${INPUT} min-h-10 resize-none overflow-hidden py-2 leading-6`}
            />
            <span className="absolute top-full right-0 mt-1 text-xs text-subtle">
              {title.length} / {TITLE_MAX}
            </span>
          </div>
          <FieldError>
            {errors.title || serverFieldError('inqryTtl')}
          </FieldError>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="inquiry-body"
            className={`${LABEL} text-base text-ink`}
          >
            내용
            <Required />
          </label>
          {/** 글자 수(제목·내용 같음)는 높이를 차지하지 않고 칸 아래 오른쪽, 칸 사이 간격 안에 둔다. 오류 문구만 흐름에 있어 다른 칸과 간격이 같다 */}
          <div className="relative">
            <AutoTextarea
              id="inquiry-body"
              value={body}
              maxLength={BODY_MAX}
              placeholder="언제, 어떤 화면에서, 어떤 일이 있었는지 자세히 적어 주시면 더 빠르게 답변드릴 수 있어요"
              aria-required="true"
              aria-invalid={Boolean(errors.body || serverFieldError('inqryCn'))}
              onChange={(event) => {
                setBody(event.target.value.slice(0, BODY_MAX));
                clearError('body');
              }}
              className={`${INPUT} max-h-[600px] min-h-[200px] resize-y py-3 leading-[1.7]`}
            />
            <span className="absolute top-full right-0 mt-1 text-xs text-subtle">
              {body.length.toLocaleString()} / {BODY_MAX.toLocaleString()}
            </span>
          </div>
          <FieldError>{errors.body || serverFieldError('inqryCn')}</FieldError>
        </div>

        <ImageAttach
          images={images.map((image) =>
            image.atchFileSn
              ? { ...image, url: existingUrls[image.atchFileSn] ?? null }
              : image,
          )}
          onChange={(next) => {
            setImages(next);
            clearError('images');
          }}
          max={maxImages}
          fixedImage={
            hasCharacterImage
              ? { url: characterImage, name: '캐릭터 이미지' }
              : null
          }
          hint={
            hasCharacterImage
              ? '캐릭터 이미지가 자동으로 함께 접수돼요.'
              : '화면 캡처를 함께 올려 주시면 확인이 빨라요.'
          }
        />
        <FieldError>{errors.images}</FieldError>
      </form>

      {errorMessage && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <div className="mt-8 flex items-center justify-end gap-2 border-t border-line pt-6 max-[760px]:mt-6 max-[760px]:flex-wrap max-[760px]:pt-5">
        {!hideCancel && (
          <button
            type="button"
            onClick={() => handleLeave(cancelTo)}
            className={`${BTN_SECONDARY} min-w-[120px] max-[760px]:h-12 max-[760px]:min-w-0 max-[760px]:flex-1`}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          form="inquiry-form"
          disabled={isPending}
          className={`${BTN_PRIMARY} min-w-[120px] max-[760px]:h-12 max-[760px]:min-w-0 max-[760px]:flex-1`}
        >
          {isEdit ? '저장하기' : '등록하기'}
        </button>
      </div>

      {leaveTo && (
        <ConfirmModal
          title={
            isEdit
              ? '수정을 그만둘까요? 고친 내용은 저장되지 않고 원래 문의가 그대로 남아요'
              : '작성을 그만둘까요? 지금까지 쓴 내용은 저장되지 않아요'
          }
          confirmLabel="나가기"
          cancelLabel={isEdit ? '계속 수정' : '계속 쓰기'}
          onConfirm={() => navigate(leaveTo)}
          onCancel={() => setLeaveTo(null)}
        />
      )}
    </section>
  );
}
