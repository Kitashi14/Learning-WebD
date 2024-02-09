import { SelectPicker } from "rsuite";

// level 2 filter search bar component
const SearchBar = (props) => {
  const selectOption = (e) => {
    props.selectOption(e==null ? "all":e);
  };


  return (
    <>
      <SelectPicker
        className="px-4"
        placement="topStart"
        label={props.label}
        data={props.data}
        onChange={selectOption}
        value={props.value}   // default value
      />
    </>
  );
};

export default SearchBar;

