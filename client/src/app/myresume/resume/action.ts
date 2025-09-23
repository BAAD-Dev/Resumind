"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { toast } from "react-toastify";

export async function uploadCV(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cv/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        toast.error(text)
        return { ok: false, message: text || `Upload failed: ${res.status}` } as const;
    }

    revalidatePath("/myresume/resume");
    return { ok: true } as const;
}
