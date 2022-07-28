import { Button, Input } from "@mui/material";

interface SearchBarProps {
    onSearch: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> ) => void
}

const SearchBar = (props: SearchBarProps) => {
    return (
        <div className="search-bar">
          <Input id="search-bar" onKeyDown={props.onSearch} className="input-bright" type="search" placeholder='Search by address, token id, or CID' />
          <Button onClick={props.onSearch} className='btn-clear'>
            <img src='/svg/search.svg' alt="search"/>
          </Button>
        </div>
    )
}

export default SearchBar;