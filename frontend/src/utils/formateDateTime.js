export function formateDateTime(msg) {
    return new Date(msg?.createdAt || msg?.updatedAt).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    })
}