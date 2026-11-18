import { Link } from 'react-router-dom';

/** 1차 메뉴 호버 카드(SCR-COM-006), items: [{ label, to }] */
export default function GnbDropdown({ items, onNavigate }) {
  return (
    <ul
      className="absolute left-0 top-[58px] z-40 w-[180px] rounded-card border border-line bg-white p-1.5 shadow-depth-md"
      role="menu"
      data-menu="gnb"
    >
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            role="menuitem"
            onClick={onNavigate}
            className="block rounded-md px-3 py-[9px] text-base leading-6 text-ink-2 hover:bg-surface-3 focus-visible:bg-surface-3"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
