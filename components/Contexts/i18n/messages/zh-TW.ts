// @ts-nocheck
import { LOCALES } from "../locales";

export default {
	[LOCALES.CHINESE]: {
		"read more": "(...閱讀更多)",
		"what is pkp - title": `什麼是 PKP?`,
		"what is pkp": `PKP是一個分散的可編程的密鑰對。使用這個頁面來鑄造一個PKP NFT, 讓你控制哪些Lit Actions可以使用該密鑰進行簽名。`,
		"Mint New PKP": "創建新的 PKP",
		"Create Action": "創建Lit Actions",
		Profile: "個人資料",
		"profile page - title": "個人儀表板",
		"profile page - p1": "這裡是您可以查看自己的 PKP 和容量積分的地方。",
		"Buy Capacity Credits": "購買容量積分",
		Pages: "頁面",
		Owners: "擁有者",
		PKPs: "PKPs",
		Actions: "Lit Actions",
		Contracts: "合同",
		RLIs: "RLIs",
		"what are lit actions - title": "什麼是 Lit Actions?",
		"what are lit actions": `Lit Actions 是 Javascript 函數，可以利用為 Lit 協議提供支持的閾值加密技術。您可以編寫一些 JS 代碼，將其上傳到 IPFS, 並要求 Lit 節點執行該代碼並返回結果。`,
		"owners page - title": "PKP NFT 所有者的定義",
		"owners page":
			"PKP NFT 所有者可以向其他用戶（通過他們的錢包地址）以及 Lit Actions 授予使用 PKP 對數據進行簽名和解密的能力。",
		"pkps page - title": "多個 PKP 標識符",
		"pkps page":
			"由於 PKP 是有效的 ECDSA 錢包，您可以向其發送 BTC 和 ETH NFT 的混合，然後通過在 OpenSea 上出售控制它的 NFT 將其作為捆綁出售。買方可以使用 PKP 簽署和解密數據，因為他們擁有控制 NFT。然後, 如果需要, 買方可以提取 BTC 和 NFT。",
		"actions page - title": "Lit Actions 存儲在哪裡？",
		"actions page":
			"Lit Actions 存儲在 IPFS 上並且是不可變的，就像智能​​合約一樣。您可以將它們視為具有網絡訪問權限並可以發出 HTTP 請求的 Javascript 智能合約。",
		"rlis page - title": "什麼是容量積分 NFT？",
		"rlis page":
			"默認情況下，每個 Lit Action 執行都附帶一個「免費計劃」，允許您在 Lit 節點上每秒執行有限數量的請求。要解除此限制，您可以通過購買帶有「靈活條款」的容量積分 NFT 來「升級」您的計劃，該條款可根據兩個因素自定義，即每秒請求數量和到期日期。",
		"all rlis - title": "其他用戶最近鑄造的容量積分 NFT",
		"all rlis - error": "未找到容量積分 NFT。",
		"all rlis - loading": "正在加載容量積分 NFT...",
		"mint rli - title": "鑄造容量積分 NFT",
		"mint rli - button": "購買容量積分",
	},
};
