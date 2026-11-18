import { ChevronRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/nm_logo.svg';
import logoWhite from '@/assets/logo-white.svg';
import useMediaQuery from '@/hooks/useMediaQuery';
import { PATHS } from '@/routes/paths';
import { LANDING_NAV } from './landingData';

const scrollToSection = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function LandingHeader({ loginTo, onHome }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 메뉴로 섹션을 옮기는 동안에는 헤더를 숨기지 않는다. 숨기면 섹션 위 80px에 앞 섹션 끝이 보인다
  const isNavScrolling = useRef(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      if (isNavScrolling.current) {
        last = y;
        return;
      }
      if (y < 10) {
        setIsHidden(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < 5) return;
      setIsHidden(y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLight = isScrolled || (isHovered && isDesktop);
  const closeMenu = () => setIsMenuOpen(false);
  const goTo = (id) => {
    closeMenu();
    isNavScrolling.current = true;
    setIsHidden(false);
    // 스크롤이 끝나거나(scrollend) 사람이 직접 스크롤하면 다시 숨김을 켠다.
    // 멀리 가는 부드러운 스크롤은 시간이 길어 타이머로 풀지 않는다
    const events = ['scrollend', 'wheel', 'touchstart', 'keydown'];
    const release = () => {
      isNavScrolling.current = false;
      events.forEach((e) => window.removeEventListener(e, release));
    };
    events.forEach((e) =>
      window.addEventListener(e, release, { passive: true }),
    );
    scrollToSection(id);
  };

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 z-[100] w-full transition-transform duration-300 ease-in-out ${
          isHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-0 transition-[background-color,box-shadow] duration-300 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
              : 'bg-white/0'
          }`}
        />
        <div className="relative z-10 mx-auto flex h-16 max-w-[1700px] items-center justify-between px-6 md:h-20 md:px-12">
          <Link
            to={PATHS.HOME}
            aria-label="pawever 홈"
            onClick={(e) => {
              // 랜딩 안에서는 주소 이동 대신 맨 위 히어로로 올리고 슬라이드를 처음부터 다시 보인다
              e.preventDefault();
              goTo('home');
              onHome?.();
            }}
          >
            <img
              src={isLight || isMenuOpen ? logo : logoWhite}
              alt="pawever"
              className="h-8 w-[88px] object-contain md:h-11 md:w-[122px]"
            />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 max-md:hidden md:flex lg:gap-16">
            {LANDING_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                className={`text-[15px] font-medium transition-colors duration-300 lg:text-[17px] ${
                  isLight
                    ? 'text-black hover:text-brand-600'
                    : 'text-white hover:text-[#5cd1d6]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={loginTo}
              className={`rounded-full border px-4 py-1.5 text-[12px] font-semibold transition-all duration-300 md:px-6 md:py-2 md:text-[14px] ${
                isLight || isMenuOpen
                  ? 'border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-brand-600'
              }`}
            >
              로그인
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMenuOpen}
              className={`p-2 transition-colors duration-300 hover:text-brand-600 md:hidden ${
                isLight || isMenuOpen ? 'text-black' : 'text-white'
              }`}
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        inert={!isMenuOpen}
        className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
      />
      <aside
        inert={!isMenuOpen}
        className={`fixed top-0 right-0 z-[120] flex h-full w-3/4 max-w-80 flex-col justify-between bg-white p-6 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-line-soft pb-6">
            <span className="font-bold text-brand-600">pawever 메뉴</span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="메뉴 닫기"
              className="rounded-lg p-1.5 text-subtle hover:bg-surface-2"
            >
              <X className="size-[22px]" />
            </button>
          </div>
          <nav className="mt-4 flex flex-col divide-y divide-line-soft">
            {LANDING_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                className="flex items-center justify-between px-2 py-4 text-left text-[15px] font-medium text-ink-2 transition-colors hover:text-brand-600"
              >
                {item.name}
                <ChevronRight className="size-4 text-line-strong" />
              </button>
            ))}
          </nav>
        </div>
        <div className="border-t border-line-soft pt-6">
          <Link
            to={loginTo}
            onClick={closeMenu}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-brand-900"
          >
            로그인 페이지로 이동
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
