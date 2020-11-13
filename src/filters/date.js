export default function (time) {
    const data = new Date(time * 1000);
    return data.toLocaleDateString();
}