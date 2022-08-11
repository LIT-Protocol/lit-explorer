import { Button, Input } from "@mui/material";
import { FormattedMessage } from 'react-intl';

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
          
          <Input id="search-bar" 
            onKeyDown={props.onSearch} 
            className="input-bright" 
            type="search" 
            placeholder={config.placeholder} 
          />

          <Button onClick={props.onSearch} className='btn-clear'>
            <img src={config.imgSrc} alt="search"/>
          </Button>
        </div>
    )
}

export default SearchBar;