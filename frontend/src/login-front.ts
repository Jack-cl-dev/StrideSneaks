//hash password string (this is more for fun than any actual real security)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert hash buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        const usernameInput = document.getElementById("username") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;

        const hashedpassword = await hashPassword(passwordInput.value);
        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log(username, password, hashedpassword);

        try {
            const response = await fetch("http://localhost:3000/api/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password: hashedpassword })
            });
            const data = await response.json();
            alert(data.message); //should return the messages from the backend
            console.log(data.message);
        }
        catch (error) {
            console.log(error);
        }
    });
});
