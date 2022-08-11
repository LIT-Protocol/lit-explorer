import { LOCALES } from '../locales';

export default {
    [LOCALES.SPANISH]:{
        'read more' : '(...Leer más)',
        'what is pkp - title' : `¿Qué es un PKP?`,
        'what is pkp' : `Un PKP es un par de claves programables descentralizadas. Utiliza esta página para acuñar una NFT PKP que te permita controlar qué Acciones Lit pueden firmar utilizando esa clave.`,
        'Mint New PKP' : 'Menta Nueva PKP',
        'Create Action': 'Crear acción',
        'Pages': 'PAGINAS',
        'Owners': 'Propietarios',
        'PKPs': 'PKPs',
        'Actions': 'Lit Acción',
        'Contracts': 'Contratos',
        'RLIs': 'RLIs',
        'what are lit actions - title': '¿Qué son Las Acciones Lit?',
        'what are lit actions': `Las acciones Lit son funciones de Javascript que pueden utilizar la criptografía de umbral que impulsa el protocolo Lit. Puede escribir código JS, cargarlo en IPFS y pedir a los Nodos Lit que ejecuten ese código y devuelvan el resultado.`,
        'owners page - title': 'Definición de propietario de PKP NFT',
        'owners page': 'Un propietario de PKP NFT puede otorgar la capacidad de usar el PKP para firmar y descifrar datos tanto para otros usuarios (a través de su dirección de billetera) como para Lit Actions.',
        'pkps page - title': 'Múltiples identificadores PKP',
        'pkps page': 'Dado que un PKP es una billetera ECDSA válida, puede enviarle una combinación de BTC y ETH NFT y luego venderlo como un paquete vendiendo el NFT que lo controla en OpenSea. El comprador tiene la capacidad de firmar y descifrar datos con el PKP, ya que posee el NFT de control. El comprador podría luego retirar el BTC y los NFT si lo desea.',
        'actions page - title': '¿Dónde se almacenan Las Acciones Lit?',
        'actions page': 'Las Acciones Lit se almacenan en IPFS y son inmutables, como los contratos inteligentes. Puede pensar en ellos como contratos inteligentes de Javascript que tienen acceso a la red y pueden realizar solicitudes HTTP.',
        'rlis page - title': '¿Qué es un NFT de aumento de límite de tasa?',
        'rlis page' : 'De manera predeterminada, cada ejecución de Lit Action viene con un "plan gratuito" que le permite ejecutar un número limitado de solicitudes por milisegundo en los nodos de Lit. Para eliminar esta limitación, puede "actualizar" su plan comprando un RLI NFT que viene con "términos flexibles" que se pueden personalizar por 2 factores, el número de solicitudes/milisegundo y la fecha de vencimiento.',
        'all rlis - title': 'NFT de aumento de límite de tasa más reciente',
        'all rlis - error': 'No se encontraron RLI NFT.',
    }
}