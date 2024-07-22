import {
	CHRONICLE_APP_CONFIG,
	VESUVIUS_APP_CONFIG,
	YELLOWSTONE_APP_CONFIG,
} from "../../../app_config";

export const networkConfigMap: { [key: string]: any } = {
	"datil-dev": VESUVIUS_APP_CONFIG,
	"datil-test": YELLOWSTONE_APP_CONFIG,
	datil: YELLOWSTONE_APP_CONFIG,
	default: CHRONICLE_APP_CONFIG,
};
