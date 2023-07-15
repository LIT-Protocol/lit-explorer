import { LOCALES } from "./locales";
import { IntlProvider } from "react-intl";
import { Fragment } from "react";
import messages from "./messages";

const i18nProvider = ({
	children,
	locale = LOCALES.ENGLISH,
}: {
	children: any;
	locale: any;
}) => {
	return (
		<IntlProvider
			locale={locale}
			textComponent={Fragment}
			messages={messages[locale]}
			wrapRichTextChunksInFragment={true}
		>
			{children}
		</IntlProvider>
	);
};
export default i18nProvider;
