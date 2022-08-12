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
        <div className="mt-24 mb-12 d-title">
          <Typography variant="h5" className="mb-6">
            <FormattedMessage id={titleId} />
          </Typography>

          <Typography className="paragraph" variant="subtitle1" paragraph={true}>
            {
                paragraphs.map((p: any) => {

                    // -- if it's a link
                    if( p?.link) {
                        return <FormattedMessage key={p.id} id={p.id}>
                        {chunks => <a href={p.link} rel="noreferrer" target="_blank">{ chunks }</a>}
                        </FormattedMessage>
                    }

                    // -- else
                    return <FormattedMessage key={p.id} id={p.id} />
                })
            }
          </Typography>
        </div>
    )
}
export default MyDescription;