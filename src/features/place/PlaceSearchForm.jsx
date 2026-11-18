import { useState } from 'react';
import SearchInput from '@/components/SearchInput';

// Enter나 검색 버튼으로 검색한다. q나 category가 바뀌면 입력칸을 새 값으로 다시 채운다(key).
// onType은 치는 글자를 알린다('이 지도에서 다시 검색'이 입력칸 글자로 찾는다)
export default function PlaceSearchForm(props) {
  return <SearchField key={`${props.category}|${props.q}`} {...props} />;
}

function SearchField({ q, onSearch, onType, className = '' }) {
  const [value, setValue] = useState(q ?? '');

  const handleChange = (next) => {
    setValue(next);
    onType(next);
  };

  return (
    <SearchInput
      value={value}
      onChange={handleChange}
      onSubmit={() => onSearch(value)}
      placeholder="지역, 장소 이름, 키워드로 검색"
      className={className}
    />
  );
}
