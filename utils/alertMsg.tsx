const alertMsg = (title: string, msg: string) => {

    const globalMessage = document.getElementById('global-message-success') as HTMLDivElement;

    const globalMessageTitle = document.getElementById('global-message-success-title') as HTMLDivElement;

    const globalMessageContent = document.getElementById('global-message-success-content') as HTMLDivElement;

    globalMessage.style.display = 'block';
    globalMessageTitle.innerText = title;
    globalMessageContent.innerText = msg;

    setTimeout(() => {
        globalMessage.style.display = 'none';
        globalMessageTitle.innerText = '';
        globalMessageContent.innerText = '';
    }, 3000)

    throw new Error(`${msg}`);
}

export default alertMsg;