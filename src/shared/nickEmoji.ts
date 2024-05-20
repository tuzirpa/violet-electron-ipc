export function nickEmoji(nick?: string) {
    if (!nick) return '';
    nick = nick.replace(/\[emoji=.+?\]/gi, (match: string) => {
        const emojiValue = match.substring(7, match.length - 1);
        const unicodeString = `\\u${emojiValue}`;
        return JSON.parse(`"${unicodeString}"`);
    });
    return nick;
}
