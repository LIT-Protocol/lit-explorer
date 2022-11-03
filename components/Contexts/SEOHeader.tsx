import Head from 'next/head'

export default function SEOHeader({
    description='Lit Protocol Explorer for PKP(Programmable Key Pair), RLI(Rate Limit Increase NFT), and Lit Action (decentralised serverless functions)',
    link='https://explorer.litprotocol.com/',
    image='https://explorer.litprotocol.com/thumbnail.jpeg'
}){

    const title = 'Lit Protocol Explorer';

    return (
        <Head>
            <title>{ title }</title>
            <meta name="description" content={description} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={link} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={link} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            <link rel="icon" href="/favicon.ico" />

            <script defer data-domain="explorer.litprotocol.com" src="https://plausible.io/js/script.js"></script>
            
        </Head>
    )
}