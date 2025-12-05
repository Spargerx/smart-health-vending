export function setCookie(name: string, value: string, days: number) {
    if (typeof document === "undefined") return;

    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

export function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function setProfileCookie(profile: any) {
    // Store full profile as JSON string
    // Encode it to handle special characters safely
    const jsonProfile = JSON.stringify(profile);
    setCookie("studentProfile", encodeURIComponent(jsonProfile), 7); // Store for 7 days
}

export function getProfileCookie(): any | null {
    const cookie = getCookie("studentProfile");
    if (!cookie) return null;

    try {
        return JSON.parse(decodeURIComponent(cookie));
    } catch (e) {
        console.error("Failed to parse profile cookie", e);
        return null;
    }
}
