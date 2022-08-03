interface AlertMsgProps{
    title: string
    message: string
    throwError?: boolean
}

const alertMsg = (props: AlertMsgProps) => {

    const globalMessage = document.getElementById('global-message-success') as HTMLDivElement;

    const globalMessageTitle = document.getElementById('global-message-success-title') as HTMLDivElement;

    const globalMessageContent = document.getElementById('global-message-success-content') as HTMLDivElement;

    globalMessage.style.display = 'block';
    globalMessageTitle.innerText = props.title;
    globalMessageContent.innerText = props.message;

    setTimeout(() => {
        globalMessage.style.display = 'none';
        globalMessageTitle.innerText = '';
        globalMessageContent.innerText = '';
    }, 3000)

    if( props?.throwError ){
        throw new Error(`${props.message}`);
    }
}

export default alertMsg;