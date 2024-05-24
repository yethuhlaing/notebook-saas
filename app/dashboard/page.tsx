import { Button } from "@/ui/button";
import Link from "next/link";
import prisma from "../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, Trash } from "lucide-react";
import { Card } from "@/ui/card";

import { TrashDelete } from "../components/SubmitButton";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
    noStore();
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            Notes: {
                select: {
                    title: true,
                    id: true,
                    description: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },

            Subscription: {
                select: {
                    status: true,
                },
            },
        },
    });

    return data;
}

export default async function DashboardPage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const data = await getData(user?.id as string);

    async function deleteNote(formData: FormData) {
        "use server";

        const noteId = formData.get("noteId") as string;

        await prisma.note.delete({
            where: {
                id: noteId,
            },
        });

        revalidatePath("/dasboard");
    }
    return (
        <div className="grid items-start gap-y-8">
            <div className="flex flex-col items-center md:flex-row md:justify-between px-2">
                <div className="grid gap-1 mb-4">
                    <h1 className="text-2xl text-center md:text-left md:text-3xl">Your Notes</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Here you can see and create new notes
                    </p>
                </div>

                {data?.Subscription?.status === "active" ? (
                    <Button asChild>
                        <Link href="/dashboard/new">Create a new Note</Link>
                    </Button>
                ) : (
                    <Button asChild>
                        <Link href="/dashboard/billing">Create a new Note</Link>
                    </Button>
                )}
            </div>

            {data?.Notes.length == 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <File className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold">
                        You dont have any notes created
                    </h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                        You currently dont have any notes. please create some so that you
                        can see them right here.
                    </p>

                    {data?.Subscription?.status === "active" ? (
                        <Button asChild>
                            <Link href="/dashboard/new">Create a new Note</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/dashboard/billing">Create a new Note</Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-y-4">

                </div>
            )}
        </div>
    );
}