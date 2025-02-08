export default function handler(req, res) {
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
    ];
    res.status(200).json(users);
}
