import { Button, Input } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = (props: {
  onSearch: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> ) => void,
  placeholder?: string,
  imgSrc?: string
}) => {

    // -- (config)
    const config = {
      placeholder : props?.placeholder ?? 'Search by Address / PKP Token ID / RFI Token ID / IPFS ID / ',
      imgSrc: props?.imgSrc ?? '/svg/search.svg',
    }

    // -- (finally)
    return (
        <div className="search-bar">

          <Button onClick={props.onSearch} className='btn-clear'>
            <SearchIcon className="search-icon"/>
          </Button>

          <Input id="search-bar" 
            onKeyDown={props.onSearch} 
            className="input-bright" 
            type="search" 
            placeholder={config.placeholder} 
          />

        </div>
    )
}

export default SearchBar;