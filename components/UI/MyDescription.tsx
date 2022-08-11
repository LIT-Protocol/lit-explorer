import { Typography } from "@mui/material";
import { FormattedMessage } from 'react-intl';

const MyDescription = ({
    titleId,
    paragraphs
} : {
    titleId: string,
    paragraphs: Array<any>
}) => {
    return (
        <div className="p-12">
          <Typography variant="h5">
            <FormattedMessage id={titleId} />
          </Typography>

          <Typography variant="subtitle1" paragraph={true}>
            {
                paragraphs.map((p: any) => {

                    // -- if it's a link
                    if( p?.link) {
                        return <FormattedMessage id={p.id}>
                        {chunks => <a href={p.link} rel="noreferrer" target="_blank">{ chunks }</a>}
                        </FormattedMessage>
                    }

                    // -- else
                    return <>
                        <FormattedMessage id={p.id} />
                    </>
                })
            }
          </Typography>
        </div>
    )
}
export default MyDescription;